import puppeteer from 'puppeteer'

export default {
    async startBrowser() {
        let browser = await puppeteer.launch({
            args: [
                `--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 OPR/85.0.4341.65`,
                `--window-size=1920,1080`,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--no-startup-window',
                '--suppress-message-center-popups',
            ],
            defaultViewport: null,
            headless: true,
            ignoreHTTPSErrors: true,
        })

        return browser
    },
    async hideAutomation(page) {
        const userAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 OPR/85.0.4341.65'
        await page.setUserAgent(userAgent)

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            })
        })

        await page.evaluateOnNewDocument(() => {
            window.navigator.chrome = {
                app: {
                    isInstalled: false,
                    InstallState: {
                        DISABLED: 'disabled',
                        INSTALLED: 'installed',
                        NOT_INSTALLED: 'not_installed',
                    },
                    RunningState: {
                        CANNOT_RUN: 'cannot_run',
                        READY_TO_RUN: 'ready_to_run',
                        RUNNING: 'running',
                    },
                },
                runtime: {
                    OnInstalledReason: {
                        CHROME_UPDATE: 'chrome_update',
                        INSTALL: 'install',
                        SHARED_MODULE_UPDATE: 'shared_module_update',
                        UPDATE: 'update',
                    },
                    OnRestartRequiredReason: {
                        APP_UPDATE: 'app_update',
                        OS_UPDATE: 'os_update',
                        PERIODIC: 'periodic',
                    },
                    PlatformArch: {
                        ARM: 'arm',
                        ARM64: 'arm64',
                        MIPS: 'mips',
                        MIPS64: 'mips64',
                        X86_32: 'x86-32',
                        X86_64: 'x86-64',
                    },
                    PlatformNaclArch: {
                        ARM: 'arm',
                        MIPS: 'mips',
                        MIPS64: 'mips64',
                        X86_32: 'x86-32',
                        X86_64: 'x86-64',
                    },
                    PlatformOs: {
                        ANDROID: 'android',
                        CROS: 'cros',
                        LINUX: 'linux',
                        MAC: 'mac',
                        OPENBSD: 'openbsd',
                        WIN: 'win',
                    },
                    RequestUpdateCheckStatus: {
                        NO_UPDATE: 'no_update',
                        THROTTLED: 'throttled',
                        UPDATE_AVAILABLE: 'update_available',
                    },
                },
            }
        })

        await page.evaluateOnNewDocument(() => {
            const originalQuery = window.navigator.permissions.query
            return (window.navigator.permissions.query = (parameters) =>
                parameters.name === 'notifications'
                    ? Promise.resolve({ state: Notification.permission })
                    : originalQuery(parameters))
        })

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            })
        })

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'languages', {
                get: () => ['fr-FR', 'fr'],
            })
        })

        await page.evaluateOnNewDocument((userAgent) => {
            let open = window.open
            
            window.open = (...args) => {
                let newPage = open(...args)
                Object.defineProperty(newPage.navigator, 'userAgent', {
                    get: () => userAgent
                })
            }

            window.open.toString = () => 'function open() { [native code] }'
        }, userAgent)
    },
}
