
import getPort from 'get-port';
import * as puppeteer from 'puppeteer-core';
import { DebugConfigurationProvider } from "vscode";
import * as chrome from 'karma-chrome-launcher';
import * as vscode from "vscode";
import { getExtensionConfig } from './utils/vscode';

function getChromiumPath() {
  let foundPath: string | undefined = undefined;
  const knownChromiums = Object.keys(chrome);

  knownChromiums.forEach((key) => {
    if (foundPath) { return; }
    if (!key.startsWith('launcher')) { return; }

    // @ts-ignore
    const info: typeof import('karma-chrome-launcher').example = chrome[key];

    if (!info[1].prototype) { return; }
    if (!info[1].prototype.DEFAULT_CMD) { return; }

    const possiblePaths = info[1].prototype.DEFAULT_CMD;
    const maybeThisPath = possiblePaths[process.platform];
    if (maybeThisPath && typeof maybeThisPath === 'string') {
      foundPath = maybeThisPath;
    }
  });

  return foundPath;
}

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
    const port = await getPort({
      port: 18597,
      host: 'localhost'
    });

    const browser = await puppeteer.launch({
      executablePath: getChromiumPath(),
      args: [`--remote-debugging-port=${port}`],
      ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    client.send('Page.navigate', { url: getExtensionConfig().get('serverURL') });

    const debugConfig = {
      name: `Browser Preview`,
      type: `chrome`,
      request: 'attach',
      port,
      webRoot: undefined,
      pathMapping: undefined,
      trace: undefined,
      sourceMapPathOverrides: undefined,
      urlFilter: '',
      url: '',
    };
    await vscode.debug.startDebugging(folder, debugConfig);

    return null;
  },
} as DebugConfigurationProvider;
