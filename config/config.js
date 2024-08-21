const admin = require('firebase-admin');
const serviceAccount = require('../etmc-whatsapp-bot.json');
const { Client, LocalAuth } = require('whatsapp-web.js');
const {Wit, log} = require('node-wit');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const db = admin.database();

const client = new Client({authStrategy: new LocalAuth()});


module.exports = {
  witAi: new Wit({ accessToken: `${process.env.WIT_TOKEN}`,logger: new log.Logger(log.INFO) }),
  db,client
}