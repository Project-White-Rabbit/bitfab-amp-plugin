import { describe, expect, it } from "vitest";
import { platform } from "./platform.js";
describe("platform", () => {
    it("uses Amp-specific auth and hints", () => {
        expect(platform.authPath).toBe("amp");
        expect(platform.displayName).toBe("Amp");
        expect(platform.cliBinary).toBe("amp");
        expect(platform.loginHint).toBe("bitfab:setup login");
    });
    it("updates through the CLI, since amp plugins update skips git-clone installs", () => {
        expect(platform.pluginUpdateCommands).toEqual([
            "npx bitfab-cli update --editor amp plugin",
        ]);
    });
    it("offers no auto-update setting, since Amp has none to point at", () => {
        expect(platform.enableAutoUpdateHint).toBeUndefined();
    });
});
