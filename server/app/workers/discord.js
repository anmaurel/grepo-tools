import Discord from 'discord.js'

export default {
    startDiscordClient() {
        const client = new Discord.Client({
            intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
        })

        return client
    }
}