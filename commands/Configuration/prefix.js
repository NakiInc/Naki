const Discord = require('discord.js');
const low = require('lowdb');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Commande prefix                                                ║                             
 * ╚═════════════════════════════════════════════════════════════════╝                                                               
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {String[]} args
 * @param {low.LowdbSync<any>} db
 */
module.exports.run = async (bot, message, args, db, emotes, dateFormat) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor("Une erreur est survenue", emotes.errorUrl).setDescription("```diff\n- Vous n'avez pas les permissions nécessaires pour utiliser cette commande.```").addField("> Permission(s) demandée(s):", `\`Administrateur\``).setColor(bot.config.colors.error));
    let newprefix = args.slice(0).join(' ');
    if (!newprefix) return message.channel.send(new Discord.MessageEmbed().setAuthor("Une erreur est survenue", emotes.errorUrl).setDescription("```diff\n- Veuillez entrer le nouveau prefix du bot pour votre serveur.```").setColor(bot.config.colors.error));
    if (db.get('prefixes').find({ guild: message.guild.id }).value()) {
        let warn = new Discord.MessageEmbed()
            .setAuthor("Vous vous préparez à changer le prefix du bot sur votre serveur", emotes.warningUrl)
            .setColor("#f7cf09")
            .setDescription(`Si vous voulez changer le prefix du bot sur votre serveur, réagissez:\n\n${emotes.success} : Je veux changer.\n${emotes.error} : Je ne veux pas changer.`);
        let msg = await message.channel.send(warn);
        msg.react(bot.emojis.cache.find(e => e.id === "695464763685208064")).then(msg.react(bot.emojis.cache.find(e => e.id === "695466155359600651")));
        bot.on('messageReactionAdd', (react, author) => {
            if (react.message.id !== msg.id) return;
            if (author.bot) return;
            if (author.id !== message.author.id) return;

            if (react.emoji.id === "695464763685208064") {
                react.message.delete();
                db.get('prefixes').find({ guild: message.guild.id }).assign({ prefix: newprefix }).write();
                message.channel.send(`${emotes.success} Nouveau prefix : \`${newprefix}\``);
            };

            if (react.emoji.id === "695466155359600651") {
                react.message.delete();
            };
        });
    } else {
        let warn = new Discord.MessageEmbed()
            .setAuthor("Vous vous préparez à changer le prefix du bot sur votre serveur", emotes.warningUrl)
            .setColor("#f7cf09")
            .setDescription(`Si vous voulez changer le prefix du bot sur votre serveur, réagissez:\n\n${emotes.success} : Je veux changer.\n${emotes.error} : Je ne veux pas changer.`);
        let msg = await message.channel.send(warn);
        msg.react(bot.emojis.cache.find(e => e.id === "695464763685208064")).then(msg.react(bot.emojis.cache.find(e => e.id === "695466155359600651")));
        bot.on('messageReactionAdd', (react, author) => {
            if (react.message.id !== msg.id) return;
            if (author.bot) return;
            if (author.id !== message.author.id) return;

            if (react.emoji.id === "695464763685208064") {
                react.message.delete();
                db.get('prefixes').push({guild: message.guild.id, prefix: newprefix}).write();
                message.channel.send(`${emotes.success} Nouveau prefix : \`${newprefix}\``);
            };

            if (react.emoji.id === "695466155359600651") {
                react.message.delete();
            };
        });
    };
};

module.exports.help = {
    name: "prefix",
    category: "Configuration",
    description: "Changement du prefix relatif au serveur.",
    usage: "[nouveau prefix]",
    aliases: ["p"]
}