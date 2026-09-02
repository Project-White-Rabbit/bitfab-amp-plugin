import fs from "node:fs"
import path from "node:path"
import type { PluginAPI, PluginToolDefinition } from "@ampcode/plugin"
import {
  createBitfabToolHandlers,
  getConfig,
  type ToolCallResult,
} from "bitfab-plugin-lib"
import { z } from "zod"
import { platform } from "./platform.js"

export const description =
  "Bitfab: capture real runs of your AI features as traces, replay them against current code, and verify the change helped"

const SKILLS = ["setup", "assistant", "update"]

function pluginVersion(): string {
  const packageJson = path.join(import.meta.dir, "package.json")
  return JSON.parse(fs.readFileSync(packageJson, "utf-8")).version as string
}

function toolInputSchema(
  shape: z.ZodRawShape,
): PluginToolDefinition["inputSchema"] {
  return z.toJSONSchema(z.object(shape), {
    unrepresentable: "any",
  }) as PluginToolDefinition["inputSchema"]
}

function resultText(result: ToolCallResult): string {
  return result.content.map((block) => block.text).join("\n")
}

export default async function bitfab(amp: PluginAPI): Promise<void> {
  const version = pluginVersion()
  for (const skill of SKILLS) {
    await amp.registerSkill({ path: `skills/${skill}` })
  }
  const { handlers } = createBitfabToolHandlers(platform, getConfig, version)
  for (const { contract, handle } of handlers) {
    amp.registerTool({
      name: contract.name,
      title: contract.title,
      description: contract.description,
      inputSchema: toolInputSchema(contract.inputSchema),
      async execute(input) {
        const result = await handle(input)
        const text = resultText(result)
        if (result.isError) {
          throw new Error(text)
        }
        return text
      },
    })
  }
  amp.logger.log(`Bitfab ${version} loaded: ${handlers.length} tools`)
}
