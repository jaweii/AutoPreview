import { DebugConfigurationProvider } from "vscode";
import cdpController from "./cdpController";

export default {
  async provideDebugConfigurations(folder, token) {
    return Promise.resolve([
      {
        name: 'AutoPreview',
        type: 'AutoPreview',
        request: 'attach'
      },
    ]);

  },
  async resolveDebugConfiguration(folder, config, token) {
    if (config.type !== 'AutoPreview') { return; };
    await cdpController.init();
    const debugConfig = {
      ...config,
      name: `AutoPreview`,
      type: `pwa-chrome`,
      request: 'attach',
      port: cdpController.port!,
    };
    // await vscode.debug.startDebugging(folder, debugConfig);
    return debugConfig;
  },
} as DebugConfigurationProvider;
