"use strict";
var path = require('path');

var fs_extra = require('fs-extra');
var node_sass = require('node-sass');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var Q = require('q');


function render() {
    var sassConfig = require(path.resolve('config/common.sass.config.js'));

    var q = Q.defer();

    node_sass.render(sassConfig, function (sassError, sassResult) {
        if (sassError) {
            console.log(sassError);
            // sass render error :(
            return q.reject(sassError);
        }
        else {
            // sass render success :)
            renderSassSuccess(sassResult, sassConfig).then(function (outFile) {
                return q.resolve(outFile);
            }).catch(function (err) {
                return q.reject(err);
            });
        }
    });

    return q.promise;
}
function renderSassSuccess(sassResult, sassConfig) {
    if (sassConfig.autoprefixer) {
        // with autoprefixer
        var autoPrefixerMapOptions = false;
        var postcssOptions = {
            to: path.basename(sassConfig.outFile),
            map: autoPrefixerMapOptions
        };
        return postcss([autoprefixer(sassConfig.autoprefixer)])
                .process(sassResult.css, postcssOptions)
                .then(function (postCssResult) {
                    postCssResult.warnings().forEach(function (warn) {
                        console.log(warn.toString());
                    });
                    return writeOutput(sassConfig, postCssResult.css);
                });
    }
    return writeOutput(sassConfig, sassResult.css.toString());
}
function writeOutput(sassConfig, cssOutput) {
    var q = Q.defer();

    console.log("sass start write output: " + sassConfig.outFile);
    var buildDir = path.dirname(sassConfig.outFile);
    fs_extra.ensureDirSync(buildDir);
    fs_extra.writeFile(sassConfig.outFile, cssOutput, function (cssWriteErr) {
        if (cssWriteErr) {
            return q.reject("Error writing css file, " + sassConfig.outFile + ": " + cssWriteErr);
        }
        else {
            console.log("sass saved output: " + sassConfig.outFile);
            // css file all saved
            // note that we're not waiting on the css map to finish saving
            return q.resolve(sassConfig.outFile);
        }
    });

    return q.promise;
}

module.exports = {
    render: render
};
