'use strict';

var path = require('path');
var prompt = require('prompt');
var build = require('./build.js').execute;
var fs = require('fs');
var Q = require('q');
var _ = require('lodash');
var prompt = require('prompt');
var readdirp = require('readdirp');
var es = require('event-stream');
var bce = require('baidubce-sdk');
var credentialsFile = path.join(process.cwd(), '.hcplogin');

var schema = {
    properties: {
        key: {
            description: 'Access Key ID',
            message: 'You need to provide the Access Key ID.',
            default: '',
            required: true,
        },
        secret: {
            description: 'Secret Access Key',
            message: 'You need to provide the Secret Access Key.',
            default: '',
            required: true,
        },
    },
};

function execute(context) {
    build(context).then(function() {
        getDeployInfo(context).then(function(config) {
            deploy(context, config);
        });
    });
}

function getDeployInfo(context) {
    var dfd = Q.defer();
    var config;
    var credentials;

    try {
        config = fs.readFileSync(context.defaultConfig, 'utf8');
        config = JSON.parse(config);
    } catch(e) {
        console.log('Cannot parse cordova-hcp.json. Fix int please');
        process.exit(0);
    }
    if(!config) {
        console.log('Cannot find hcp config. Fix int please');
        process.exit(0);
    }
    try {
        credentials = fs.readFileSync(credentialsFile, 'utf8');
        credentials = JSON.parse(credentials);

        schema.properties.key.default = credentials.ak;
        schema.properties.secret.default = credentials.sk;
    } catch(e) {
        // console.log('Cannot parse .hcplogin: ');
    }

    prompt.message = 'Enter Your';
    prompt.delimiter = ': ';
    prompt.start();
    prompt.get(schema, function (err, result) {
        config.ak = result.key;
        config.sk = result.secret;

        dfd.resolve(config);
    });

    return dfd.promise;
}

function deploy(context, config) {
    var bosClientconfig = {
        credentials: {
            ak: config.ak,
            sk: config.sk
        },
        endpoint: config.endpoint
    };
    var bucket = config.bucket;
    var bosClient = new bce.BosClient(bosClientconfig);

    var ignore = context.ignoredFiles;
    ignore = ignore.filter( ignoredFile => !ignoredFile.match(/^chcp/) )
    ignore = ignore.map( ignoredFile => `!${ignoredFile}` )

    var files = readdirp({
        root: context.sourceDirectory,
        fileFilter: ignore,
        directoryFilter: ignore
    });

    files.pipe(es.mapSync(function (entry) {
        var key = config.prefix + entry.path;

         bosClient.putObjectFromFile(bucket, key, entry.path)
            .then(function(response) {
                console.log('upload ' + entry.path + ' to ' + config.endpoint + '/' + bucket + '/' + key);
            })
            .catch(function(error) {
                console.error(error);
            });
    }));
}

module.exports = {
    execute: execute
};
