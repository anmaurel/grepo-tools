import puppeteer from 'puppeteer'
import userAgent from 'user-agents'
import fs from 'fs'

import User from './app/runners/User.js'
import premium from './app/runners/Premium.js'
import utils from './app/utils.js'

(async () => {
    const info = JSON.parse(fs.readFileSync('config.json', 'utf-8'))

    const browser = await puppeteer.launch({
        args: [`--window-size=1920,1080`, '--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null,
        headless: false,
        ignoreHTTPSErrors: true,
    })

    info.credentials.forEach(async (account) => {
        process(browser, account)
    })
})()

async function process(browser, account) {
    let page = await browser.newPage()
    await page.setUserAgent(userAgent.toString())
    await page.setDefaultTimeout(10000)

    try {
        await page.goto(`https://fr.grepolis.com/`, {
            waitUntil: 'networkidle2',
            timeout: 0,
        })

        let user = new User(page, account.USERNAME, account.PASSWORD, account.WORLD)
        await user.auth()

        for (let rep = 1; rep < 1000; rep++) {
            const time = utils.datetimeNow()
            await utils.sleep(utils.random(200, 4000))
            await premium.collectResources(page)
            console.log(`${time} - x${rep}`)
            await utils.sleep(600000)
        }
    } catch (error) {
        await page.close()
        process(browser, account)
    }
}
