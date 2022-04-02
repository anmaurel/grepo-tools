import puppeteer from 'puppeteer'
import userAgent from 'user-agents'
import fs from 'fs'
import Discord from 'discord.js'

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

    const client = new Discord.Client({
        intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
    })

    const prefix = '!'

    let worldsOpened = []
    let pagesOpened = []

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return
        if (!message.content.startsWith(prefix)) return

        const commandBody = message.content.slice(prefix.length)
        const args = commandBody.split(' ')
        const command = args.shift().toLowerCase()

        const channelGeneral = client.channels.cache.get('764795042468200482')
        const channelLogs = client.channels.cache.get('764796155824439296')

        setTimeout(() => message.delete(), 1000)

        if (args.length == 1) {
            if (command === 'run') {
                info.credentials.forEach(async (account) => {
                    if (args[0] === account.WORLD_ID) {
                        worldsOpened.push(args[0])
                        channelLogs.send(`${args[0]} launched`)

                        process(browser, account, channelLogs, worldsOpened, pagesOpened)
                    } else {
                        channelLogs.send(`World ${args[0]} not found`)
                    }
                })
            } else if (command === 'stop') {
                if (worldsOpened.indexOf(args[0]) >= 0) {
                    const pageIndex = pagesOpened.findIndex(obj => obj.world === args[0])
                    await pagesOpened[pageIndex].page.close()
                    pagesOpened.splice(pageIndex, 1)

                    const worldIndex = worldsOpened.find(element => element === args[0])
                    worldsOpened.splice(worldIndex, 1)

                    channelLogs.send(`${args[0]} stopped`)
                } else {
                    channelLogs.send(`Impossible to stop ${args[0]} because it is not open`)
                }
            }
        } else {
            channelLogs.send('error - Unknown arguments')
        }
    })

    client.login(info.BOT_TOKEN)
})()

async function process(browser, account, channelLogs, worldsOpened, pagesOpened) {
    let page = await browser.newPage()
    pagesOpened.push({
        world: account.WORLD_ID,
        page: page
    })
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
            channelLogs.send(`${time} - x${rep}`)
            await utils.sleep(600000)
        }
    } catch (error) {
        channelLogs.send(`error - ${error}`)
    }
}