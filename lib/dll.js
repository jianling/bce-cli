"use strict";
var path = require('path');

var webpack = require('webpack');
var Q = require('q');


function build(options) {
    console.log('start build webpack dll file');
    var dllConfig = require(path.resolve('config/dll.webpack.config.js'));

    var q = Q.defer();

    var callback = function (err, stats) {
        if (err) {
            q.reject(err);
        }
        else {
            console.log('build webpack dll file successfuly');
            q.resolve(stats);
        }
    };
    var compiler = webpack(dllConfig);
    compiler.run(callback);

    return q.promise;
}


module.exports = {
    build: build
};
