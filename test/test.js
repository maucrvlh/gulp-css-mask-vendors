const assert = require('assert');
const gutil = require('gulp-util');
const fs = require('fs');
const path = require('path');
const gulpCssMaskVendors = require('../dist/');

const dist = path.join(__dirname, 'fixtures/index.html');



function extract(data) {
    let output = data.contents.toString();
    fs.writeFileSync(dist, output);
}

describe('gulp-css-mask-vendors', function(done) {
    it('should rename files and css links from lib path and return an array of 3 renamed vendors', function() {
        let stream = gulpCssMaskVendors({ base: path.join(__dirname,'fixtures'), log: false }, function(vendors) {
            assert.ok(Array.isArray(vendors));
            assert.equal(vendors.length, 3);
        });

        let indexFile = path.join(__dirname, 'fixtures/index.html');

        stream.write(new gutil.File({contents: fs.readFileSync(indexFile)}));

        stream.on('data', extract);

        stream.on('end', () => {
            done()
        });
        
        stream.end();
    });
});