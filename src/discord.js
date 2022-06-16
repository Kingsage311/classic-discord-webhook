const {MessageEmbed, WebhookClient} = require("discord.js")
const MAX_MESSAGE_LENGTH = 40

module.exports.send = (id, token, repo, branch, url, commits, size) =>
    new Promise((resolve, reject) => {
        let client
        console.log('Preparing Webhook...')
        try {
            client = new WebhookClient({id: id, token: token})
        } catch (error) {
            console.log('Error creating Webhook')
            reject(error.message)
            return
        }

        client.send({embeds: [createEmbed(repo, branch, url, commits, size)]}).then(() => {
            console.log('Successfully sent the message!')
            resolve()
        }, reject)
    })

function createEmbed(repo, branch, url, commits, size) {
    console.log('Constructing Embed...')
    const latest = commits[0]
    console.log(latest)
    return new MessageEmbed()
        .setColor('#fbab04')
        .setTitle(`${repo.url} Was updated at ${branch}`)
        //.setTitle(`${size} ${size === 1 ? 'commit was' : 'commits were'} added to ${repo}`)
        //.setTitle(size + (size == 1 ? " Commit was " : " Commits were ") + "added to " + repo + " (" + branch + ")")
        .setAuthor({
            name: `${latest.author.username}`,    
        //name: `${size} ${size === 1 ? 'commit was' : 'commits were'} added to ${repo}`,
            iconURL: `https://github.com/${latest.author.username}.png?size=32`,
        })
        .setThumbnail('https://raw.githubusercontent.com/Kingsage311/Kingsage311/main/assets/B1old.png')
        .setDescription(`${getChangeLog(commits, size)}`)
        .setTimestamp(Date.parse(latest.timestamp))
        .setFooter({
            text: 'Burn One Studios' ,
            iconURL: 'https://raw.githubusercontent.com/Kingsage311/Kingsage311/main/assets/B1old.png',
        })
}
//text: `⚡ Edited by @${latest.author.username}`

function getChangeLog(commits, size) {
    let changelog = ''
    for (const i in commits) {
        if (i > 7) {
            changelog += `+ ${size - i} more...\n`
            break
        }

        const commit = commits[i]
        const sha = commit.id.substring(0, 6)
        const message =
            commit.message.length > MAX_MESSAGE_LENGTH
                ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + '...'
                : commit.message
        changelog += `[\`${sha}\`](${commit.url}) — ${message}\n`
    }

    return changelog
}
