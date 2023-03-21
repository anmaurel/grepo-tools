import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

export default {
  async startBrowser() {
    const extensions = process.env.BROWSER_EXTENSIONS_PATHS

    puppeteer.use(StealthPlugin())
    let browser = await puppeteer.launch({
      defaultViewport: null,
      executablePath: process.env.BROWSER_EXEC_PATH,
      headless: false,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ['--disable-extensions', '--enable-automation'],
      args: [
        `--user-data-dir=${process.env.BROWSER_USERDATA_DIRECTORY}`,
        '--disable-blink-features=AutomationControlled',
        `--start-fullscreen`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        `--disable-extensions-except=${extensions}`,
        `--load-extension=${extensions}`,
        '--no-first-run',
        '--no-service-autorun',
        '--password-store=basic',
        '--suppress-message-center-popups',
      ],
    })

    return browser
  },
}
