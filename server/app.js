import 'dotenv/config'
import userAgent from 'user-agents'

import User from './app/classes/User'
import { grepolis, puppeteer } from './app/workers/'
import utils from './app/utils'

(async () => {
    let browser = await puppeteer.startBrowser()

    let page = await browser.newPage()

    await page.setUserAgent(userAgent.toString())
    await page.setDefaultTimeout(10000)

    try {
        await page.goto(`https://fr.grepolis.com/`, {
            waitUntil: 'networkidle2',
            timeout: 0,
        })

        let user = new User(page, process.env.GREPO_USERNAME, process.env.GREPO_PASSWORD, process.env.GREPO_WORLD)
        await user.auth()

        for (let rep = 1; rep < 1000; rep++) {
            const time = utils.datetimeNow()
            await utils.sleep(utils.random(600, 6000))
            await grepolis.collectResources(page)
            console.log(`${time} - x${rep}`)
            await utils.sleep(600000)
        }
    } catch (error) {
        console.log(`error - ${error}`)
    }
})()
