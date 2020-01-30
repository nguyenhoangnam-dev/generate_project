let npmPackage = function(name, license, html, css, js) {
  return `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "${license}",
  "devDependencies": {
    "@babel/core": "7.8.3",
    "@babel/preset-env": "7.8.3",
    "browser-sync": "2.26.7",
    "gulp": "4.0.2",
    "gulp-autoprefixer": "7.0.1",
    "gulp-babel": "8.0.0",
    "gulp-changed": "4.0.2",
    "gulp-clean": "0.4.0",
    "gulp-css-replace-url": "0.2.4",
    "gulp-csso": "4.0.1",
    "gulp-html-replace": "1.6.2",
    "gulp-imagemin": "7.0.0",
    "gulp-newer": "1.4.0",
    "gulp-rename": "2.0.0",
    "gulp-size": "3.0.0",
    "gulp-sourcemaps": "2.6.5",
    "gulp-uglify": "3.0.2",
    "lodash": "4.17.15",
    "lodash.template": "4.5.0",
    ${html}${css}${js}
  }
}`;
};

let gulpPackage = function(data) {
  let htmlDependencies, cssDependencies, jsDependencies;
  switch (data[0]) {
    case "pug":
      htmlDependencies = `"gulp-pug": "4.0.1"`;
      break;
    case "haml":
      htmlDependencies = `"gulp-haml": "1.0.1"`;
      break;
    case "slim":
      htmlDependencies = `"gulp-slim": "0.3.0"`;
      break;
    default:
      htmlDependencies = ``;
      break;
  }

  switch (data[1]) {
    case "sass":
      cssDependencies = `"gulp-sass": "4.0.2",
    "fibers": "4.0.2"`;
      break;
    case "scss":
      cssDependencies = `"gulp-sass": "4.0.2",
    "fibers": "4.0.2"`;
      break;
    case "stylus":
      cssDependencies = `"gulp-stylus": "2.7.0"`;
      break;
    case "less":
      cssDependencies = `"gulp-less": "4.0.1"`;
      break;
    default:
      cssDependencies = ``;
      break;
  }

  switch (data[2]) {
    case "typescript":
      jsDependencies = `"typescript": "3.7.5",
    "gulp-typescript": "6.0.0-alpha.1"`;
      break;
    case "coffeescript":
      jsDependencies = `"gulp-coffee": "3.0.3"`;
      break;
    default:
      jsDependencies = ``;
      break;
  }
  return [htmlDependencies, cssDependencies, jsDependencies];
};

let package = {
  npm: npmPackage,
  gulp: gulpPackage
};

module.exports = package;
