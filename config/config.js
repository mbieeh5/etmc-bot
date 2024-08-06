require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('../etmc-whatsapp-bot.json');
const { Client, LocalAuth } = require('whatsapp-web.js');
const {Wit} = require('node-wit');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

module.exports = {
  db: admin.database(),
  witAi: new Wit({ accessToken: `${process.env.WIT_TOKEN}` }),
  client: new Client({authStrategy: new LocalAuth()})
};
