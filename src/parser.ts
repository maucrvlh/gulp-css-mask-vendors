// const dom = require('gulp-dom');
// const jsdom = require("jsdom");
// const fs = require('fs');
// const { JSDOM } = jsdom;

// import { gulp } from 'gulp-dom';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';

interface IMask {
    [index: string]: number;
}

interface IOpts {
    /**
     * Base path where files will be renamed from
     */
    base: string;

    /**
     * If parser should log success/errors when renaming
     */
    log: boolean;
}



/**
 * Ok & Not symbols based on:
 *  https://github.com/jonschlinkert/success-symbol/
 *  https://github.com/jonschlinkert/error-symbol/
 */

const ok = process.platform === 'win32' ? '√' : '✔';
const not = process.platform === 'win32' ? '×' : '✖';

const arrow = '⇢';

let vendors: string[] = [];

export default {
    parse: (file: any, opts: IOpts | any) => {
        let dom = new JSDOM(file.contents.toString());
        return new Promise((resolve, reject) => {

            let linkElements = dom.window.document.querySelectorAll('link');
            let masks = {} as IMask;
            let base = opts.base ? opts.base : '';
            let echo = opts.log ? opts.log : false;

            for (var x = 0; x < linkElements.length; x++) {
                
                let href = linkElements[x].getAttribute('href');

                if (/^(\/\/)|(:\/\/)/uig.test(href)) {
                    echo && console.log('\u001b[31m%s \u001b[39m %s', not, href);
                } else {
                    let ref = href.split('/');

                    let dist = [];
                    for (let i = 2; i < ref.length-1; i++)
                        dist.push(ref[i]);

                    let link = {
                        path: ref[0],
                        dist: dist.join('/'),
                        vendor: ref[1],
                        css: ref[ref.length-1],
                        href: ref.join('/')
                    }

                    if (!masks[link.vendor]) {
                        let tmp = Math.round((Math.random()*999999999));
                        masks[link.vendor] = tmp;                        
                        try {
                            fs.renameSync(`${base}/${link.path}/${link.vendor}`, `${base}/${link.path}/${tmp}`);                       
                        } catch(w) {
                            console.log(w);
                            if (w.code == 'ENOENT')
                                echo && console.info('\u001b[33m%s not found in \'%s\' dir.\u001b[39m', `${base}/${link.path}/${tmp}`, base);
                            else
                                echo && console.info('\u001b[33m%s already masked, skipped.\u001b[39m', `${base}/${link.path}/${tmp}`);
                        }
                    }

                    let mask = masks[link.vendor];                

                    let tmp = `${link.path}/${mask}/${link.dist?link.dist.concat('/'):''}${mask}.css`;

                    try {
                        fs.renameSync(`${base}/${link.path}/${mask}/${link.dist}/${link.css}`, `${base}/${tmp}`);
                        dom.window.document.querySelectorAll('link')[x].setAttribute('href', tmp);
                        echo && console.log('\u001b[32m%s \u001b[39m %s \u001b[32m%s\u001b[39m %s', ok, link.href, arrow, tmp);
                    } catch(err) {
                        console.error('\u001b[31mError renaming %s: %s\u001b[39m', link.css, err.toString());
                    }                

                    vendors.push(`${base}/${tmp}`);
                }
            }
            resolve({dom, vendors});
        });
    }
}