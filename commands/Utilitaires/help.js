const Discord = require('discord.js');
const {readdirSync} = require('fs');
const low = require('lowdb');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Commande help                                                  ║                             
 * ╚═════════════════════════════════════════════════════════════════╝                                                               
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {String[]} args
 * @param {low.LowdbSync<any>} db
 */
module.exports.run = async (bot, message, args, db, emotes) => {
    var prefix;
    if (bot.db.get('prefixes').find({guild: message.guild.id}).value()) {
        let searchPrefix = Object.values(bot.db.get('prefixes').filter({guild: message.guild.id}).find('prefix').value());
        return prefix = searchPrefix[1];
    };
    prefix = bot.config.prefix;
    
    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.colors.primary)
        .setFooter(`Naki Inc © All rights reserved | ${message.author.tag}`, message.author.displayAvatarURL());
    if (args[0]) {
        let command = args[0];
        let cmd;

        if (bot.commands.has(command)) cmd = bot.commands.get(command);
        else if (bot.aliases.has(command)) cmd = bot.commands.get(bot.aliases.get(command));

        let err = new Discord.MessageEmbed()
            .setAuthor("Une erreur est survenue", emotes.errorUrl)
            .addField("> Type:", "```\nSaisie invalide.```")
            .addField("> Message:", `\`\`\`\nCommande "${command}" introuvable.\`\`\``)
            .setColor(bot.config.colors.error);
        if (!cmd) return message.channel.send(err);

        command = cmd.help;

        embed.setAuthor(`Commande ${command.name.slice(0,1).toUpperCase() + command.name.slice(1).toLowerCase()}`, emotes.infoUrl)
            .addField("> Nom:", `\`\`\`fix\n${command.name}\`\`\``, true)
            .addField("> Catégorie:", `\`\`\`fix\n${command.category}\`\`\``, true)
            .addField("> Description:", `\`\`\`\n${command.description || "-"}\`\`\``)
            .addField("> Usage:", `\`\`\`\n${command.usage ? `${prefix}${command.name} ${command.usage}` : `${prefix}${command.name}`}\`\`\``)
            .addField("> Alias:", `\`\`\`\n${command.aliases ? command.aliases.join(', ') : "-"}\`\`\``);
        return message.channel.send(embed);
    };
    const categories = readdirSync('./commands/');
    embed.setAuthor("Page d'aide", emotes.infoUrl);
    embed.setDescription(`Prefix du serveur: [${prefix}](https://discordapp.com/terms)\n\n[[Serveur de support]](https://discord.gg/E8Y6YFH) | [[Lien d'invitation]](https://discordapp.com/oauth2/authorize?client_id=695397943997497358&scope=bot&permissions=8)\n`);
    categories.forEach(category => {
        const dir = bot.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
        const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
        
        if (dir.size === 0) return;
        embed.addField(`> ${capitalise} (${dir.size})`, dir.map(c => `\`${c.help.name}\``).join(', '));
    });
    return message.channel.send(embed);
};

module.exports.help = {
    name: "help",
    category: "Utilitaires",
    description: "Affichage d'une page listant toutes les commandes que vous pouvez utiliser.",
    aliases: ["h"],
    usage: "(commande)"
};