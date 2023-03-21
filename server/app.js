import 'dotenv/config'
import readline from 'readline'

import User from './app/classes/User'
import { grepolis, puppeteer } from './app/workers/'
import utils from './app/utils'

const world = {
  usr: process.env.GREPO_USERNAME,
  pswd: process.env.GREPO_PASSWORD,
  name: process.env.GREPO_WORLD,
}

const main = async (world) => {
  try {
    let browser = await puppeteer.startBrowser()
    let page = await browser.newPage()
    page.setDefaultTimeout(10000)

    await page.goto(`https://fr.grepolis.com/`, {
      waitUntil: 'networkidle2',
      timeout: 0,
    })

    let user = new User(page, world.usr, world.pswd, world.name)
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
}

main(world)
