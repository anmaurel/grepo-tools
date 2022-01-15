import puppeteer from "puppeteer";
import userAgent from "user-agents";
import fs from "fs";
import Discord from "discord.js";

import User from "./app/runners/User.js";
import premium from "./app/runners/Premium.js";
import utils from "./app/utils.js";

(async () => {
    const info = JSON.parse(fs.readFileSync("config.json", "utf-8"));

    const browser = await puppeteer.launch({
        args: [
            `--window-size=1920,1080`,
            "--incognito",
            "--no-sandbox",
            "--disable-setuid-sandbox",
        ],
        defaultViewport: null,
        headless: false,
        ignoreHTTPSErrors: true,
    });

    const client = new Discord.Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
        ],
    });

    const prefix = "!";

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(" ");
        const command = args.shift().toLowerCase();

        setTimeout(() => message.delete(), 1000);

        if (args.length == 1) {
            if (command === "run") {
                info.credentials.forEach(async (account) => {
                    if (args[0] === account.WORLD_ID) {
                        message.channel.send(`Bot ${args[0]} launched`);

                        let page = await browser.newPage();
                        await page.setUserAgent(userAgent.toString());

                        try {
                            await page.goto(`https://fr.grepolis.com/`, {
                                waitUntil: "networkidle2",
                                timeout: 0,
                            });

                            let user = new User(
                                page,
                                account.USERNAME,
                                account.PASSWORD,
                                account.WORLD
                            );
                            await user.auth();

                            for (let rep = 1; rep < 1000; rep++) {
                                await utils.sleep(utils.random(200, 4000));
                                await premium.collectResources(page, rep);
                                message.channel.send(`${args[0]} recolt ${rep}`);   
                                await utils.sleep(300000);
                            }
                        } catch (error) {
                            message.channel.send(error.toString());
                        }
                    } else {
                        message.channel.send(`World ${args[0]} not found`);
                    }
                });
            } else if (command === "stop") {
                let pages = await browser.pages();
                console.log(pages.length);

                for (const p of pages) {
                    if (p.url() != "" && p.url() != "about:blank") {
                        let baseUrl = p.url().toString();
                        let u = baseUrl.split("//");
                        let ur = u[1].split("/");
                        let url = ur[0].split(".");

                        if (url[0] === args[0]) {
                            p.close();
                            message.channel.send(`Bot ${args[0]} stopped`);
                        }
                    }
                }
            }
        } else {
            message.channel.send("Unknown arguments");
        }
    });

    client.login(info.BOT_TOKEN);
})();
