"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var fs = require("fs");
var ok = process.platform === 'win32' ? '√' : '✔';
var not = process.platform === 'win32' ? '×' : '✖';
var arrow = '⇢';
var vendors = [];
exports.default = {
    parse: function (file, opts) {
        var dom = new jsdom_1.JSDOM(file.contents.toString());
        return new Promise(function (resolve, reject) {
            var linkElements = dom.window.document.querySelectorAll('link');
            var masks = {};
            var base = opts.base ? opts.base : '';
            var echo = opts.log ? opts.log : false;
            for (var x = 0; x < linkElements.length; x++) {
                var href = linkElements[x].getAttribute('href');
                if (/^(\/\/)|(:\/\/)/uig.test(href)) {
                    echo && console.log('\u001b[31m%s \u001b[39m %s', not, href);
                }
                else {
                    var ref = href.split('/');
                    var dist = [];
                    for (var i = 2; i < ref.length - 1; i++)
                        dist.push(ref[i]);
                    var link = {
                        path: ref[0],
                        dist: dist.join('/'),
                        vendor: ref[1],
                        css: ref[ref.length - 1],
                        href: ref.join('/')
                    };
                    if (!masks[link.vendor]) {
                        var tmp_1 = Math.round((Math.random() * 999999999));
                        masks[link.vendor] = tmp_1;
                        try {
                            fs.renameSync(base + "/" + link.path + "/" + link.vendor, base + "/" + link.path + "/" + tmp_1);
                        }
                        catch (w) {
                            console.log(w);
                            if (w.code == 'ENOENT')
                                echo && console.info('\u001b[33m%s not found in \'%s\' dir.\u001b[39m', base + "/" + link.path + "/" + tmp_1, base);
                            else
                                echo && console.info('\u001b[33m%s already masked, skipped.\u001b[39m', base + "/" + link.path + "/" + tmp_1);
                        }
                    }
                    var mask = masks[link.vendor];
                    var tmp = link.path + "/" + mask + "/" + (link.dist ? link.dist.concat('/') : '') + mask + ".css";
                    try {
                        fs.renameSync(base + "/" + link.path + "/" + mask + "/" + link.dist + "/" + link.css, base + "/" + tmp);
                        dom.window.document.querySelectorAll('link')[x].setAttribute('href', tmp);
                        echo && console.log('\u001b[32m%s \u001b[39m %s \u001b[32m%s\u001b[39m %s', ok, link.href, arrow, tmp);
                    }
                    catch (err) {
                        console.error('\u001b[31mError renaming %s: %s\u001b[39m', link.css, err.toString());
                    }
                    vendors.push(base + "/" + tmp);
                }
            }
            resolve({ dom: dom, vendors: vendors });
        });
    }
};
