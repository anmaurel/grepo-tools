import 'dotenv/config'

import User from './app/classes/User'
import { grepolis, puppeteer, discord } from './app/workers/'
import utils from './app/utils'

const worlds = [
    {
        name: process.env.GREPO_WORLD,
        id: process.env.GREPO_WORLD_ID,
        usr: process.env.GREPO_USERNAME,
        pswd: process.env.GREPO_PASSWORD,
    },
    {
        name: process.env.GREPO2_WORLD,
        id: process.env.GREPO2_WORLD_ID,
        usr: process.env.GREPO2_USERNAME,
        pswd: process.env.GREPO2_PASSWORD,
    },
]

const discordListener = async () => {
    let browser = await puppeteer.startBrowser()
    const discordClient = discord.startDiscordClient()
    const prefix = '!'

    discordClient.on('messageCreate', async (message) => {
        if (message.author.bot) return
        if (!message.content.startsWith(prefix)) return

        const commandBody = message.content.slice(prefix.length)
        const args = commandBody.split(' ')
        const command = args.shift().toLowerCase()

        // const channelGeneral = discordClient.channels.cache.get('764795042468200482')
        const channelLogs = discordClient.channels.cache.get('764796155824439296')

        setTimeout(() => message.delete(), 1000)

        if (args.length == 1) {
            if (command === 'run') {
                switch (args[0]) {
                    case worlds[0].id:
                        channelLogs.send(`${args[0]} launched`)
                        main(browser, channelLogs, worlds[0], discordClient)
                        break
                    case worlds[1].id:
                        channelLogs.send(`${args[0]} launched`)
                        main(browser, channelLogs, worlds[1], discordClient)
                        break
                    default:
                        channelLogs.send(`error - World ${args[0]} it is not found`)
                        break
                }
            }
        } else {
            const pages = await browser.pages()
            for(const page of pages) await page.close()

            channelLogs.send('error - Unknown arguments')
        }
    })

    discordClient.login(process.env.DISCORD_BOT_TOKEN)
}

const main = async (browser, channelLogs, world, discordClient) => {
    const pages = await browser.pages()
    for(const page of pages) await page.close()

    let page = await browser.newPage()
    page.setDefaultTimeout(10000)

    try {
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

            discordClient.on('ready', () => {
                channelLogs.send(`${time} - x${rep}`)
            })

            await utils.sleep(600000)
        }
    } catch (error) {
        channelLogs.send(`error - ${error}`)
    }
}

discordListener()
