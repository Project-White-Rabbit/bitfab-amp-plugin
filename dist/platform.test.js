import { describe, expect, it } from "vitest";
import { platform } from "./platform.js";
describe("platform", () => {
    it("uses Amp-specific auth and hints", () => {
        expect(platform.authPath).toBe("amp");
        expect(platform.displayName).toBe("Amp");
        expect(platform.cliBinary).toBe("amp");
        expect(platform.loginHint).toBe("bitfab:setup login");
        expect(platform.pluginUpdateCommands).toEqual(["amp plugins update bitfab"]);
    });
});
