import { captureAmpAgentEnd, captureAmpAgentStart, captureAmpBitfabToolCall, captureAmpSessionStart, collectSessionStartMessages, createBitfabToolHandlers, getConfig, } from "bitfab-plugin-lib";
import { z } from "zod";
import { platform } from "./platform.js";
import { getVersion } from "./version.js";
export const description = "Bitfab: capture real runs of your AI features as traces, replay them against current code, and verify the change helped";
const SKILLS = ["setup", "assistant", "update"];
function toolInputSchema(shape) {
    return z.toJSONSchema(z.object(shape), {
        unrepresentable: "any",
    });
}
function resultText(result) {
    return result.content.map((block) => block.text).join("\n");
}
let sessionNoticesShown = false;
async function showSessionNotices(amp, ctx, pluginVersion) {
    let notices;
    try {
        notices = await collectSessionStartMessages(pluginVersion, platform);
    }
    catch {
        return;
    }
    if (notices.length === 0) {
        return;
    }
    try {
        await ctx.ui.notify(notices.join("\n"));
    }
    catch (error) {
        if (!(error instanceof Error) ||
            !amp.helpers.isPluginUINotAvailableError(error)) {
            amp.logger.log(`Bitfab notice not shown: ${String(error)}`);
        }
    }
}
function registerSessionCapture(amp, pluginVersion) {
    amp.on("session.start", (event, ctx) => {
        void captureAmpSessionStart({
            threadId: String(event.thread.id),
            pluginVersion,
        });
        if (sessionNoticesShown) {
            return;
        }
        sessionNoticesShown = true;
        void showSessionNotices(amp, ctx, pluginVersion);
    });
    amp.on("agent.start", (event) => {
        void captureAmpAgentStart({
            threadId: String(event.thread.id),
            prompt: event.message,
            platform,
            pluginVersion,
        });
        return {};
    });
    amp.on("agent.end", async (event) => {
        await captureAmpAgentEnd({
            threadId: String(event.thread.id),
            messages: event.messages,
            pluginVersion,
        });
    });
}
export default async function bitfab(amp) {
    const version = getVersion();
    for (const skill of SKILLS) {
        await amp.registerSkill({ path: `skills/${skill}` });
    }
    const { handlers } = createBitfabToolHandlers(platform, getConfig, version);
    for (const { contract, handle } of handlers) {
        amp.registerTool({
            name: contract.name,
            title: contract.title,
            description: contract.description,
            inputSchema: toolInputSchema(contract.inputSchema),
            async execute(input, ctx) {
                void captureAmpBitfabToolCall({
                    threadId: String(ctx.thread.id),
                    pluginVersion: version,
                });
                const result = await handle(input);
                const text = resultText(result);
                if (result.isError) {
                    throw new Error(text);
                }
                return text;
            },
        });
    }
    registerSessionCapture(amp, version);
    amp.logger.log(`Bitfab ${version} loaded: ${handlers.length} tools`);
}
