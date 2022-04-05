import puppeteer from 'puppeteer'

export default {
    async startBrowser() {
        let browser = await puppeteer.launch({
            args: [`--window-size=1920,1080`, '--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null,
            headless: false,
            ignoreHTTPSErrors: true,
        })

        return browser
    },
}
