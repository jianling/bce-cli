"use strict";
var path = require('path');
var chcpContext = require(path.resolve(__dirname, 'hcp', 'context.js'));


function execute(cmd, argv) {
    switch(cmd) {
        case 'build':
        case 'deploy':
            console.log('BCE Cli Running: hcp ' + cmd);
            var command = require(path.resolve(__dirname, 'hcp', cmd + '.js'));
            var context = chcpContext.context(argv);
            command.execute(context);
            break;
        default:
            console.log('TODO: Should print usage instructions.');
            process.exit(0);
    }
}

module.exports = {
    execute: execute
};