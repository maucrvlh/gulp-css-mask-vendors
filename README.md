<h1 align="center">Gulp CSS Mask Vendors</h1>

---

:fire: Need hide CSS vendors names/ids? This plugin is 4u. ;)
## Warning
Since this plugin changes stylesheet links references and libraries filenames and paths, you <strong>must</strong> use it in builded files (thouse ones in /dist or /build, for instance).

## Installation
```
npm install gulp-css-mask-vendors --save-dev
```
## API
```javascript
gulpCssMaskVendors(options, callback(vendorsList))
```
- Options
```
{
	base: string, // build path, default '.'
    log: boolean // if it should log events or no
}
```
- callback(vendorsList)

Returns a list of masked vendors.
## Example
Assuming a project structure like
```
├── dist
│   └── libs
│   │   ├── x
│   │   ├── y
│   │   └── z
|   └── index.html
└── src
│   └── libs
│   │   ├── x
│   │   ├── y
│   │   └── z
|   └── index.html
```
### index.html (in dist path)
```html
<html>
	<head>
        <title>gulpCssMaskVendors</title>
        <link rel="stylesheet" type="text/css" href="dist/libs/x/sheet/x.css">
        <link rel="stylesheet" type="text/css" href="dist/libs/y/dist/css/y.css">
        <link rel="stylesheet" type="text/css" href="dist/libs/z/z.css">
        <link href="https://fonts.googleapis.com/css?family=Julius+Sans+One|Enriqueta" rel="stylesheet">
    </head>
	<body></body>
</html>
```

### gulpfile.js
```javascript
const gulpCssMaskVendors = require('gulp-css-mask-vendors');
const vendors = [];
gulp.task('maskCssVendors', function() {
    return gulp.src('dist/index.html')
        .pipe(gulpCssMaskVendors({ base: 'dist', log: true }, function(masked) {
            vendors = masked;
        }))
        .pipe(gulp.dest('dist'));
});
```

## License
MIT
