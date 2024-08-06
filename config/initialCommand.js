const {selesaiRestart} = require('../lib/restartServer');

function initialCommand() {
    selesaiRestart();
}
    
module.exports ={
    initialCommand
} 