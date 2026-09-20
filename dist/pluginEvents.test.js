import { describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
    captureAmpAgentEnd: vi.fn(),
    captureAmpAgentStart: vi.fn(() => Promise.resolve()),
    captureAmpSessionStart: vi.fn(() => Promise.resolve()),
    captureAmpBitfabToolCall: vi.fn(() => Promise.resolve()),
    collectSessionStartMessages: vi.fn(() => Promise.resolve([])),
}));
vi.mock("bitfab-plugin-lib", async (importOriginal) => ({
    ...(await importOriginal()),
    ...mocks,
}));
async function registeredHandlers() {
    vi.resetModules();
    const { default: bitfab } = await import("./plugin.js");
    const handlers = new Map();
    const amp = {
        logger: { log: vi.fn() },
        helpers: { isPluginUINotAvailableError: () => false },
        on: (event, handler) => {
            handlers.set(event, handler);
            return { dispose: vi.fn() };
        },
        registerTool: vi.fn(),
        registerSkill: vi.fn(() => Promise.resolve({ dispose: vi.fn() })),
    };
    await bitfab(amp);
    return handlers;
}
describe("Amp event handlers", () => {
    it("waits for the turn's upload before the turn ends", async () => {
        let finishUpload;
        mocks.captureAmpAgentEnd.mockImplementationOnce(() => new Promise((resolve) => {
            finishUpload = resolve;
        }));
        const handlers = await registeredHandlers();
        const agentEnd = handlers.get("agent.end");
        expect(agentEnd).toBeDefined();
        let settled = false;
        const pending = Promise.resolve(agentEnd?.({ thread: { id: "T-1" }, messages: [] })).then(() => {
            settled = true;
        });
        await Promise.resolve();
        expect(settled).toBe(false);
        finishUpload?.();
        await pending;
        expect(settled).toBe(true);
    });
    it("subscribes to the events capture needs", async () => {
        const handlers = await registeredHandlers();
        expect([...handlers.keys()].sort()).toEqual([
            "agent.end",
            "agent.start",
            "session.start",
        ]);
    });
});
describe("session start notices", () => {
    it("shows the update notice once, not on every thread switch", async () => {
        mocks.collectSessionStartMessages.mockResolvedValue([
            "[Bitfab] Update available: v1 → v2.",
        ]);
        const notify = vi.fn((_message) => Promise.resolve());
        const handlers = await registeredHandlers();
        const sessionStart = handlers.get("session.start");
        const ctx = { ui: { notify } };
        sessionStart?.({ thread: { id: "T-1" } }, ctx);
        sessionStart?.({ thread: { id: "T-2" } }, ctx);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify.mock.calls[0][0]).toContain("Update available");
    });
    it("says nothing when there is no notice to show", async () => {
        mocks.collectSessionStartMessages.mockResolvedValue([]);
        const notify = vi.fn((_message) => Promise.resolve());
        const handlers = await registeredHandlers();
        handlers.get("session.start")?.({ thread: { id: "T-3" } }, { ui: { notify } });
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(notify).not.toHaveBeenCalled();
    });
});
