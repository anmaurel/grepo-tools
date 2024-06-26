import utils from '../utils'

export default {
    async collectResources(page) {
        await page.waitForTimeout(utils.random(1200, 10000))
        await page.waitForSelector('#quickbar_dropdown1', { timeout: 0 })
        await page.click('#quickbar_dropdown1 > div')

        await page.waitForTimeout(utils.random(800, 2000))
        await page.waitForSelector('.select_all', { timeout: 0 })
        await page.click('.select_all')
        await page.waitForTimeout(utils.random(800, 2000))
        await page.click('#fto_claim_button')
    },
}
