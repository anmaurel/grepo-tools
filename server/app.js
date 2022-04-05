import 'dotenv/config'
import userAgent from 'user-agents'

import User from './app/classes/User'
import { grepolis, puppeteer, discord } from './app/workers/'
import utils from './app/utils'

(async () => {
    let browser = await puppeteer.startBrowser()
    const discordClient = discord.startDiscordClient()

    const grepoWorldId = process.env.GREPO_WORLD_ID
    const prefix = '!'

    discordClient.on('messageCreate', async (message) => {
        if (message.author.bot) return
        if (!message.content.startsWith(prefix)) return

        const commandBody = message.content.slice(prefix.length)
        const args = commandBody.split(' ')
        const command = args.shift().toLowerCase()

        const channelGeneral = discordClient.channels.cache.get('764795042468200482')
        const channelLogs = discordClient.channels.cache.get('764796155824439296')

        setTimeout(() => message.delete(), 1000)

        if (args.length == 1) {
            if (command === 'run') {
                if (args[0] === grepoWorldId) {
                    channelLogs.send(`${args[0]} launched`)
                    main(browser, channelLogs)
                } else {
                    channelLogs.send(`error - World ${args[0]} it is not found`)
                }
            } else if (command === 'stop') {
                if (args[0] === grepoWorldId) {
                    let pages = await browser.pages()
                    for (const page of pages) {
                        await page.close()
                    }

                    channelLogs.send(`${args[0]} stopped`)
                } else {
                    channelLogs.send(`error - World ${args[0]} it is not open`)
                }
            }
        } else {
            channelLogs.send('error - Unknown arguments')
        }
    })

    discordClient.login(process.env.DISCORD_BOT_TOKEN)
})()

async function main(browser, channelLogs) {
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
            await utils.sleep(utils.random(200, 4000))
            await grepolis.collectResources(page)
            channelLogs.send(`${time} - x${rep}`)
            await utils.sleep(600000)
        }
    } catch (error) {
        channelLogs.send(`error - ${error}`)
    }
}
