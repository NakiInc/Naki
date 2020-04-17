const Discord = require('discord.js');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Événement ready du bot                                         ║                             
 * ╚═════════════════════════════════════════════════════════════════╝                                                               
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 */
module.exports = async (bot, message) => {
    var prefix;
    if (bot.db.get('prefixes').find({guild: message.guild.id}).value()) {
        let searchPrefix = Object.values(bot.db.get('prefixes').filter({guild: message.guild.id}).find('prefix').value());
        prefix = searchPrefix[1];
    } else { prefix = bot.config.prefix };

    // Variables globales

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const db = bot.db;
    var command;
    let emotes = {
        success: `<:${bot.emojis.cache.find(e => e.id === "695464763685208064").name}:${bot.emojis.cache.find(e => e.id === "695464763685208064").id}>`,
        error: `<:${bot.emojis.cache.find(e => e.id === "695466155359600651").name}:${bot.emojis.cache.find(e => e.id === "695466155359600651").id}>`,
        warning: `<:${bot.emojis.cache.find(e => e.id === "695848098467151873").name}:${bot.emojis.cache.find(e => e.id === "695848098467151873").id}>`,
        info: `<:${bot.emojis.cache.find(e => e.id === "695737758940921918").name}:${bot.emojis.cache.find(e => e.id === "695737758940921918").id}>`,
        successUrl: bot.emojis.cache.find(e => e.id === "695464763685208064").url,
        errorUrl: bot.emojis.cache.find(e => e.id === "695466155359600651").url,
        warningUrl: bot.emojis.cache.find(e => e.id === "695848098467151873").url,
        infoUrl: bot.emojis.cache.find(e => e.id === "695737758940921918").url
    };

    /**
     * Format la date
     * 
     * @param {Date} date 
     */
    var dateFormat = (date) => {
        return `${date.getDate()}/${date.getMonth() < 9 ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`}/${date.getFullYear()} ${date.toLocaleTimeString()}`;
    };

    // conditions

    if (!message.content.startsWith(prefix)) return;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.member) message.member = await message.guild.members.fetch(message.author);
    // Nous allons maintenant activer le command handler

    if (bot.commands.has(cmd)) command = bot.commands.get(cmd);
    else if (bot.aliases.has(cmd)) command = bot.commands.get(bot.aliases.get(cmd));
    
    if (command) command.run(bot, message, args, db, emotes, dateFormat);
};