var path = require('path');
var fs = require('fs');

var optimist = require('optimist');

var Setup = require('./setup');
var Sass = require('./sass');
var Dll = require('./dll');

var Cli = {};

function getUsageText() {
    var versionInfo = 'BCE v' + require('../package.json').version;
    var usageDetail = fs.readFileSync('./usage.md', {encoding:'utf-8'});

    return versionInfo + '\n' + usageDetail;
}

Cli.run = function run(processArgv) {
    var rawCliArguments = processArgv.slice(2);

    var argv = optimist(rawCliArguments).argv;

    // bce --help
    if (argv._.length == 0 && argv.help) {
        console.log(getUsageText());
        return;
    }

    var taskName = argv._[0];

    switch(taskName) {
        // bce setup bceApp
        case 'setup':
            console.log('Setup bce mobile app project.');
            var targetPath = argv._[1] ? path.resolve(argv._[1]) : path.resolve('.');
            Setup.startApp({
                targetPath: targetPath
            });
            break;

        // bce buildCommon
        case 'buildCommon':
            console.log('Build common js and css.');
            Sass.render()
                .then(function () {
                    Dll.build();
                });
            break;

        default:
            console.log('Unknown command.\nexit.');
    }
};

module.exports = Cli;
