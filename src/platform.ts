import type { PlatformConfig } from "bitfab-plugin-lib"

export const platform: PlatformConfig = {
  authPath: "amp",
  loginHint: "bitfab:setup login",
  setupHint: "bitfab:setup",
  updateHint: "bitfab:update",
  repo: "Project-White-Rabbit/bitfab-amp-plugin",
  remotePackageJsonPath: "package.json",
  cliBinary: "amp",
  displayName: "Amp",
  supportsAutoUpdate: true,
  marketplaceName: "bitfab",
  pluginName: "bitfab",
  marketplacePreRegistered: false,
  pluginUpdateCommands: ["amp plugins update bitfab"],
}
