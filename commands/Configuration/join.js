const Discord = require('discord.js');
const low = require('lowdb');

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Commande join                                                  ║                             
 * ╚═════════════════════════════════════════════════════════════════╝                                                               
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {String[]} args
 * @param {low.LowdbSync<any>} db
 */
module.exports.run = async (bot, message, args, db, emotes, dateFormat) => {
    let action = args.slice(0,1).join(' ');
    switch (action.toLowerCase()) {
        case 'enable':
            if (db.get('join').find({guild: message.guild.id}).value()) return message.channel.send(new Discord.MessageEmbed().setAuthor("Une erreur est survenue", emotes.errorUrl).setDescription("```diff\n- Le système d'arrivée est déjà activé sur ce serveur.```").setColor(bot.config.colors.error));
            let channel = message.mentions.channels.first();
            if (!channel) return message.channel.send(new Discord.MessageEmbed().setAuthor("Une erreur est survenue", emotes.errorUrl).setDescription("```diff\n- Veuillez mentionner le canal dans lequel sera publié l'arrivée de nouveaux membres.```").setColor(bot.config.colors.error));
            let msgJoin = args.slice(2).join(' ');
            if (!msgJoin) msgJoin = "Hey! {member.user} vient de rejoindre `{server.name}`.";
            let embed = new Discord.MessageEmbed()
                .setAuthor("Vous vous apprêtez à activer le système d'arrivée", emotes.warningUrl)
                .setDescription(`Nous nous apprétons à activer le système d'arrivée sur votre serveur. Le canal qui recevra les publications sera : ${channel}. Est-ce bien cela?`)
                .setColor("#f7cf09");
            let msg = await message.channel.send(embed);
            msg.react(bot.emojis.cache.find(e => e.id === "695464763685208064")).then(msg.react(bot.emojis.cache.find(e => e.id === "695466155359600651")));
            bot.on('messageReactionAdd', (react, author) => {
                if (msg.id !== react.message.id) return;
                if (author.bot) return;
                if (author.id !== message.author.id) return;

                if (react.emoji.id === "695464763685208064") {
                    react.message.delete();
                    db.get('join').push({guild: message.guild.id, channel: channel.id, message: msgJoin, addedAt: new Date(Date.now())}).write();
                    message.channel.send(`${emotes.success} **Système d'arrivée définie sur le canal ${channel}**`);
                };

                if (react.emoji.id === "695466155359600651") {
                    react.message.delete();
                }
            });
        break;
        case 'disable':
            if (!db.get('join').find({guild: message.guild.id}).value()) return message.channel.send(new Discord.MessageEmbed().setAuthor("Une erreur est survenue", emotes.errorUrl).setDescription("```diff\n- Le système d'arrivée est désactivé sur votre serveur.```").setColor(bot.config.colors.error));
            let searchChannel = Object.values(db.get('join').filter({guild: message.guild.id}).find('channel').value());
            let embedDis = new Discord.MessageEmbed()
                .setAuthor("Vous vous apprêtez à désactiver le système d'arrivée", emotes.warningUrl)
                .setDescription(`Nous nous apprétons à désactiver le système d'arrivée sur votre serveur. Le voulez-vous vraiment?`)
                .setColor("#f7cf09");
            let m = await message.channel.send(embedDis);
            m.react(bot.emojis.cache.find(e => e.id === "695464763685208064")).then(m.react(bot.emojis.cache.find(e => e.id === "695466155359600651")));
            bot.on('messageReactionAdd', (react, author) => {
                if (m.id !== react.message.id) return;
                if (author.bot) return;
                if (author.id !== message.author.id) return;

                if (react.emoji.id === "695464763685208064") {
                    react.message.delete();
                    db.get("join").remove({guild: message.guild.id, channel: searchChannel[1], message: searchChannel[2], addedAt: searchChannel[3]}).write();
                    message.channel.send(`${emotes.success} **Système d'arrivée désactiver sur le serveur.**`);
                };

                if (react.emoji.id === "695466155359600651") {
                    react.message.delete();
                }
            });
        break;
        case 'help':
            message.channel.send(`Liste des mots clés pour le système d'arrivée:\n\n{member.user} = Mention de l'utilisateur ayant rejoint le serveur.\n{member.tag} = Le tag Discord de l'utilisateur ayant rejoint le serveur.\n{server.name} = Nom du serveur sur lequel l'utilisateur a rejoint.\n{server.members} = Nombre de membres que comporte le serveur.\n{server.owner} = Mention du propriétaire du serveur.\n{server.ownerTag} = Tag Discord du propriétaire du serveur.`, { code: "markdown" });
        break;
        default:
            message.channel.send(`Liste des actions disponible:\n\nenable = Activer le système d'arrivée.\ndisable = Désactiver le système d'arrivée.\nhelp = Aide à propos des variables globales utilisateur et serveur.`, { code: "markdown" });
        break;
    };
};

module.exports.help = {
    name: "join",
    category: "Configuration",
    description: "Activation du système d'arrivée.",
    usage: "[enable|disable|help] [#canal] (message)"
};