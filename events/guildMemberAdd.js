const Discord = require('discord.js');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Événement guildMemberAdd du bot                                ║                             
 * ╚═════════════════════════════════════════════════════════════════╝                                                               
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member
 */
module.exports = async (bot, member) => {
    if (bot.db.get('join').find({guild: member.guild.id}).value()) {
        let searchChannel = Object.values(bot.db.get('join').filter({guild: member.guild.id}).find('channel').value());
        let guildChannel = member.guild.channels.cache.find(c => c.id === searchChannel[1]);
        if (!guildChannel) return;
        guildChannel.send(searchChannel[2].replace("{member.user}", member.user).replace('{member.tag}', member.user.tag).replace("{server.name}", member.guild.name).replace("{server.members}", member.guild.memberCount).replace("{server.owner}", member.guild.owner.user).replace("{server.ownerTag}", member.guild.owner.user.tag));
    };
};