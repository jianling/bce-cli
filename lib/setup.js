var fs = require('fs');
var os = require('os');
var parseUrl = require('url').parse;
var chalk = require('chalk');
var request = require('request');
var shelljs = require('shelljs');
var prompt = require('prompt');
var Q = require('q');
var open = require('open');

var Utils = require('ionic-app-lib/lib/utils');
var Cordova = require('ionic-app-lib/lib/cordova');
var log = require('ionic-app-lib/lib/logging').logger;

var sassBuilder = require('./sass');

var baseRepoUrl = 'https://github.com/jianling/bce-app-base';
var Setup = {};
var DEFAULT_APP = {
    plugins: [
        'cordova-plugin-device',
        'cordova-plugin-console',
        'cordova-plugin-whitelist',
        'cordova-plugin-splashscreen',
        'cordova-plugin-statusbar',
        'ionic-plugin-keyboard',
        'https://github.com/jianling/cordova-HTTP',
        'https://github.com/jianling/cordova-plugin-inappbrowser'
    ],
    sass: false
};

function startApp(options) {

    console.log('Creating in ' + options.targetPath);

    return fetchBase(options)
    .then(function() {
        console.log('Installing npm packages...');
        return runSpawnCommand('npm', ['install']);
    })
    .then(function() {
        return addCordovaPlugins(options);
    })
    .then(function() {
        return addDefaultPlatforms(options);
    });
};

function fetchBase(options) {
    var q = Q.defer();
    var wrapperBranchName = 'master';
    var archiveUrl = baseRepoUrl + '/archive/' + wrapperBranchName + '.zip';

    Utils.fetchArchive(options.targetPath, archiveUrl)
    .then(function() {
        // bce-app-base-master
        var repoFolderName = baseRepoUrl.replace(/.*\//, '') + '-' + wrapperBranchName;

        // Copy contents of starter template into base, overwriting if already exists
        shelljs.cp('-R', options.targetPath + '/' + repoFolderName + '/.', options.targetPath);
        shelljs.rm('-rf', options.targetPath + '/' + repoFolderName + '/');
        shelljs.cd(options.targetPath);

        q.resolve();
    }, function(err) {
        q.reject(err);
    }).catch(function(err) {
        q.reject('Error: Unable to fetch wrapper repo: ' + err);
    });

    return q.promise;
};

function runSpawnCommand(cmd, args) {
    var q = Q.defer();
    var command = cmd + ' ' + args.join(' ');
    var spawn = require('cross-spawn');

    console.log('Running exec command:', command);
    var spawned = spawn(cmd, args, { stdio: 'inherit' });
    spawned.on('error', function(err) {
        console.log('Unable to run spawn command' + err);
    });
    spawned.on('exit', function(code) {
        console.log('Spawn command completed');
        if (code !== 0) {
            return q.reject('There was an error with the spawned command: ' + command);
        }
        return q.resolve();
    });

    return q.promise;
};

function addCordovaPlugins(options) {
    var promises = [];

    // add plugins
    for (var x = 0; x < DEFAULT_APP.plugins.length; x += 1) {
        promises.push(Cordova.addPlugin(options.targetPath, DEFAULT_APP.plugins[x], null, true));
    }

    return Q.all(promises);
};

function addDefaultPlatforms(options) {
    var promises = [];

    promises.push(Cordova.addPlatform(options.targetPath, 'ios', true));

    return Q.all(promises);
};


module.exports = {
    startApp: startApp
};
