import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
function readPluginVersion() {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
        path.join(moduleDir, "..", "package.json"),
        path.join(moduleDir, "package.json"),
    ];
    for (const candidate of candidates) {
        try {
            return JSON.parse(fs.readFileSync(candidate, "utf-8")).version;
        }
        catch { }
    }
    throw new Error(`bitfab-amp-plugin package.json not found from ${moduleDir}. Looked in: ${candidates.join(", ")}`);
}
const PLUGIN_VERSION = readPluginVersion();
export function getVersion() {
    return PLUGIN_VERSION;
}
