var path = require('path');
var fs = require('fs');

var optimist = require('optimist');

var Setup = require('./setup');
var Sass = require('./sass');
var Dll = require('./dll');
var Hcp = require('./hcp');

var Cli = {};

function getUsageText() {
    var versionInfo = 'BCE v' + require('../package.json').version;
    var usageDetail = fs.readFileSync(path.join(__dirname, '../', 'usage.md'), {encoding:'utf-8'});

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
            console.log('BCE Cli Running: Setup bce mobile app project.');
            var targetPath = argv._[1] ? path.resolve(argv._[1]) : path.resolve('.');
            Setup.startApp({
                targetPath: targetPath
            });
            break;

        // bce buildCommon
        case 'buildCommon':
            console.log('BCE Cli Running: Build common js and css.');
            Sass.render()
                .then(function () {
                    Dll.build();
                });
            break;

        // hot push
        case 'hcp':
            var cmd = argv._[1];
            Hcp.execute(cmd, argv);
            break;

        default:
            console.log('Unknown command.\nexit.');
    }
};

module.exports = Cli;

// Hcp.execute('deploy', {_: ['hcp', 'deploy', './']});
