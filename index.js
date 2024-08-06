const qrcode = require('qrcode-terminal');
const client = require('./config/config').client;
const {initialCommand } = require('./config/initialCommand');
const { handleCommand } = require('./config/handleCommand');
const { UpdateStock } = require('./lib/updateStock');


client.on('qr', qr => { qrcode.generate(qr, {small: true})});

initialCommand();
UpdateStock();

client.on('message', async (message) => {handleCommand(message)});

client.initialize();