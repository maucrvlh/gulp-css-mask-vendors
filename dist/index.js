'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var through = require("through2");
var gutil = require("gulp-util");
var parser_1 = require("./parser");
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-css-mask-vendors';
function gulpMaskCssVendors(opts, returnVendorsListCallback) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (!file.isBuffer()) {
            cb(new PluginError(PLUGIN_NAME, 'This plugin only accepts buffered inputs.'));
        }
        else {
            parser_1.default.parse(file, opts ? opts : {})
                .then(function (parsed) {
                file.contents = Buffer.from(parsed.dom.serialize(), enc);
                if (typeof (returnVendorsListCallback) == 'function')
                    returnVendorsListCallback(parsed.vendors);
                cb(null, file);
            })
                .catch(function (err) {
                cb(new PluginError(PLUGIN_NAME, 'Error at parser.'));
            });
        }
    });
}
module.exports = gulpMaskCssVendors;
