var path = require('path');
var Setup = require('./setup');
var Cli = {};

/**
 * The main entry point for the CLI
 * This takes the process.argv array for arguments
 * The args passed should be unfiltered.
 * From here, we will filter the options/args out
 * using optimist. Each command is responsible for
 * parsing out the args/options in the way they need.
 * This way, we can still test with passing in arguments.
 *
 * @method run
 * @param {Array} processArgv a list of command line arguments including
 * @return {Promise}
 */
Cli.run = function run(processArgv) {

  var rawCliArguments = processArgv.slice(2);
  var taskName = rawCliArguments[0];
  var targetPath = rawCliArguments[1] ? path.resolve(rawCliArguments[1]) : path.resolve('.');

  console.log(targetPath);

  switch(taskName) {
    case 'setup':
        console.log('Setup bce mobile app project.');
        Setup.startApp({
            targetPath: targetPath
        });
        break;
    default:
        console.log('exit.');
  }
};


module.exports = Cli;
