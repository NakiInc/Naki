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
const {success, error, warning} = require('log-symbols')

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
    let data = [["Fichier", "Événement", "Statut"]], events = [];
    readdirSync(path).forEach(files => {
        if (!files.endsWith('.js')) return;
        let eventName = files.split('.')[0];
        bot.on(eventName, files.bind(null, bot));
        events.push([files, eventName, ]);
    });
};