const Discord = require('discord.js');
const low = require('lowdb');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Commande serverinfo                                            ║                             
 * ╚═════════════════════════════════════════════════════════════════╝                                                               
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {String[]} args
 * @param {low.LowdbSync<any>} db
 */
module.exports.run = async (bot, message, args, db, emotes, dateFormat) => {
    let prefix;
    if (bot.db.get('prefixes').find({guild: message.guild.id}).value()) {
        let searchPrefix = Object.values(bot.db.get('prefixes').filter({guild: message.guild.id}).find('prefix').value());
        prefix = searchPrefix[1];
    } else { prefix = bot.config.prefix; };
    

    let hasJoinMessage;
    if (db.get('join').find({guild: message.guild.id}).value()) {
        var searchJoinChannel = Object.values(db.get('join').filter({guild: message.guild.id}).find('channel').value());
        hasJoinMessage = true; 
    } else {
        hasJoinMessage = false;
    }

    let hasLeaveMessage;
    if (db.get('leave').find({guild: message.guild.id}).value()) {
        var searchLeaveChannel = Object.values(db.get('leave').filter({guild: message.guild.id}).find('channel').value());
        hasLeaveMessage = true;
    } else { hasLeaveMessage = false; }
    

    let hasAutoRole;
    if (db.get('autorole').find({guild: message.guild.id}).value()) {
        var searchRole = Object.values(db.get('autorole').filter({guild: message.guild.id}).find('role').value());
        hasAutoRole = true;
    } else { hasAutoRole = false; };
    

    let embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, emotes.infoUrl)
        .addField("> Nom:", `\`\`\`fix\n${message.guild.name}\`\`\``, true)
        .addField("> Propriétaire:", message.guild.owner.user, true)
        .addField("> ID:", `\`\`\`js\n${message.guild.id}\`\`\``, true)
        .addField("> Canal(aux):", `\`\`\`js\n${message.guild.channels.cache.filter(c => c.type !== "category").size}\`\`\``, true)
        .addField("> Canal(aux) textuel(s):", `\`\`\`js\n${message.guild.channels.cache.filter(c => c.type === "text").size}\`\`\``, true)
        .addField("> Canal(aux) vocal(aux):", `\`\`\`js\n${message.guild.channels.cache.filter(c => c.type === "voice").size}\`\`\``, true)
        .addField("> Membre(s):", `\`\`\`js\n${message.guild.members.cache.size}\`\`\``, true)
        .addField("> Membre(s) humain(s):", `\`\`\`js\n${message.guild.members.cache.filter(m => !m.user.bot).size}\`\`\``, true)
        .addField("> Membre(s) non-humain(s):", `\`\`\`js\n${message.guild.members.cache.filter(m => m.user.bot).size}\`\`\``, true)
        .addField("> Rôle(s):", `\`\`\`js\n${message.guild.roles.cache.size}\`\`\``, true)
        .addField("> Prefix:", `\`\`\`fix\n${prefix}\`\`\``, true)
        .addField("> Date de création:", `\`\`\`js\n${dateFormat(message.guild.createdAt)}\`\`\``, true)
        .addField("> Système d'arrivée:", hasJoinMessage ? `**Activvé sur le canal <#${searchJoinChannel[1]}>** (\`${dateFormat(searchJoinChannel[3])}\`)` : "```Désactivé```")
        .addField("> Système de départ:", hasLeaveMessage ? `**Activvé sur le canal <#${searchLeaveChannel[1]}>** (\`${dateFormat(searchLeaveChannel[3])}\`)` : "```Désactivé```")
        .addField("> Système d'autorôle:", hasAutoRole ? `**Activé sur le rôle <@&${searchRole[1]}>**` : "```Désactivé```")
        .setColor(bot.config.colors.primary)
        .setFooter(`Naki Inc © All rights reserved | ${message.author.tag}`, message.author.displayAvatarURL());
    message.channel.send(embed);
};

module.exports.help = {
    name: "serverinfo",
    category: "Utilitaires",
    description: "Affichage d'informations relatives au serveur courant.",
    aliases: ["si", "sinfo", "server"]
};