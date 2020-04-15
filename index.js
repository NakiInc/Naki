const {Client, Collection} = require('discord.js');
const bot = new Client();
const figlet = require('figlet');
const {table} = require('table');
const chalk = require('chalk');
const low = require('lowdb'), FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.bot.json');
const db = low(adapter);
const conf = require('./config'); // fichier de configuration permettant d'accéder aux couleurs représentatives, au prefix, au(x) créateur(s) et au token du bot (Client).
const {readdirSync} = require('fs');
const {success, error, warning} = require('log-symbols');
const {sep} = require('path');

// Maintenant, nous allons attacher certaines variables à la variable bot afin de pouvoir y accéder partout.

bot.config = conf;
bot.db = db;
["commands", "aliases"].forEach(x => bot[x] = new Collection());

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Charge tous les événements du bot.                             ║
 * ║═════════════════════════════════════════════════════════════════║                                                                
 * ║  @param {String} path                                           ║ 
 * ╚═════════════════════════════════════════════════════════════════╝
 */
var eventLoader = async (path = './events/') => {
    console.log(chalk.magenta("╔═════════════════════════════════════════════════════════════════╗\n"));
    let data = [["Fichier", "Événement", "Statut"]];
    readdirSync(path).forEach(files => {
        if (!files.endsWith('.js')) return;
        let pull = require(`${path}/${files}`);
        let eventName = files.split('.')[0];
        if (typeof (pull) !== "function") {
            data.push([files, eventName, error]);
            return;
        } else {
            bot.on(eventName, pull.bind(null, bot));
            data.push([files, eventName, success]);
        };
    });
    console.log(table(data));
    console.log(chalk.magenta("╚═════════════════════════════════════════════════════════════════╝"));
};

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  Charge toutes les commandes du bot.                            ║ 
 * ║═════════════════════════════════════════════════════════════════║                                                                
 * ║  @param {String} path                                           ║
 * ╚═════════════════════════════════════════════════════════════════╝
 */
var commandLoader = async (path = './commands/') => {
    console.log(chalk.magenta("╔═════════════════════════════════════════════════════════════════╗\n"));
    let data = [["Fichier", "Commande", "Statut"]];
    readdirSync(path).forEach(categories => {
        const commands = readdirSync(`${path}${sep}${categories}${sep}`).filter(files => files.endsWith('.js'));
        for (const file of commands) {
            var pull = require(`${path}/${categories}/${file}`);
            if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
                if (bot.commands.get(pull.help.name)) return data.push([file, pull.help.name, warning]);
                bot.commands.set(pull.help.name, pull);
                data.push([file, pull.help.name, success]);
            } else {
                data.push([file, "Unknown", error]);
                continue;
            };
            if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
                pull.help.aliases.forEach(alias => {
                    if (bot.aliases.get(alias)) return;
                    if (!pull.help.name) return;
                    bot.aliases.set(alias, pull.help.name);
                });
            };
        };
    });
    console.log(table(data));
    console.log(chalk.magenta("╚═════════════════════════════════════════════════════════════════╝"));
};

// Nous allons activer le command et event handler en les séparant par un ascii art.

figlet('Événements', (err, data) => {
    if (err) return;
    console.log(data);
    eventLoader();
    figlet("Commandes", (err, data) => {
        if (err) return;
        console.log(data);
        commandLoader();
    });
});

bot.login(bot.config.token); // Le bot se connecte.