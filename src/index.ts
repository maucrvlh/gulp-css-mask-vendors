'use strict';

import * as through from 'through2';
import * as gutil from 'gulp-util';
import parser from './parser';

const PluginError = gutil.PluginError;
const PLUGIN_NAME = 'gulp-css-mask-vendors';

function gulpMaskCssVendors(opts?: Object, returnVendorsListCallback?: Function) {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (!file.isBuffer()) {                    
            cb(new PluginError(PLUGIN_NAME, 'This plugin only accepts buffered inputs.'));
        } else {
            parser.parse(file, opts?opts:{})
                .then((parsed: any) => {

                    file.contents = Buffer.from(parsed.dom.serialize(), enc);

                    if (typeof(returnVendorsListCallback) == 'function')
                        returnVendorsListCallback(parsed.vendors);
                    
                    cb(null, file);
                })
                .catch((err: Error) => {
                    cb(new PluginError(PLUGIN_NAME, 'Error at parser.'));
                });
        }
    });
}

export default gulpMaskCssVendors;