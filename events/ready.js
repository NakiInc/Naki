const {Client} = require('discord.js');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Événement ready du bot                                         ║                             
 * ║═════════════════════════════════════════════════════════════════║                                                                
 * @param {Client} bot
 *
 */
module.exports = async (bot) => {
    bot.user.setActivity(`${bot.guilds.cache.size} serveur(s) | ${bot.config.prefix}help.`, { type: "WATCHING" });
};