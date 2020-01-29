#!/usr/bin/env node

"use strict";

const path = require("path"); // Join path of process.cwd() and file
const fs = require("fs"); // Create file, delete file, create folder, write to file
const prompt = require("syncprompt"); // Get input from terminal
const chalk = require("chalk"); // Color text
const emoji = require("node-emoji"); // Show emoji
const treeify = require("treeify"); // Turn object to tree
const ncp = require("ncp").ncp; // Copy folder
ncp.limit = 16;

const htmlFile = require("./html.js"); // Data of all html preprocessor code
const cssFile = require("./css.js"); // Data of all css preprocessor code
const jsFile = require("./javascript.js"); // Data of all js preprocessor code

// Store all kind of preprocessor able to use
const htmlOption = [chalk.underline("none"), "haml", "pug", "slim"];
const cssOption = [chalk.underline("none"), "sass", "scss", "stylus", "less"];
const jsOption = [chalk.underline("none"), "typescript", "coffeescript"];

const htmlPreprocessor = ["none", "haml", "pug", "slim"];
const cssPreprocessor = ["none", "sass", "scss", "stylus", "less"];
const jsPreprocessor = ["none", "typescript", "coffeescript"];

// Store argument of cli-app
var args = require("minimist")(process.argv.slice(2), {
  // Use --
  boolean: ["help", "version", "tree"],
  // Use -
  alias: { h: "help", v: "version", t: "tree" }
});

var dir = process.cwd(); // current directory

// Check user argument
if (args.help) {
  help(); // Show help screen
} else if (args.version) {
  console.log("v.1.1.0"); // Show version of app
} else if (args._[0] == "init") {
  let overwrite = false; // Check if folder name is existed in this directory
  if (args._[1]) {
    // Check if dirname is existed
    if (!fs.existsSync(dir + "\\" + args._[1])) {
      dir = dir + "\\" + args._[1]; // Change dir to new directory
    } else {
      overwrite = true;
      console.error(
        chalk.yellow(emoji.get("no_entry"), "This file name is exist !")
      );
    }
    if (!overwrite) {
      fs.mkdirSync(dir); // Create new project folder
    }
  }

  if (!overwrite) {
    // Store html preprocessor option
    let html = prompt("HTML preprocessor ( " + htmlOption.join(" | ") + " ): ");
    // Check if option is exist
    if (html == "") {
      html = "none";
    }
    if (!htmlPreprocessor.includes(html)) {
      showError("Invalid html preprocessor type file.", true);
    } else {
      // Store css preprocessor option if html option existed
      var css = prompt("CSS preprocessor ( " + cssOption.join(" | ") + " ): ");

      if (css == "") {
        css = "none";
      }
      // Check if option is existed
      if (!cssPreprocessor.includes(css)) {
        showError("Invalid css preprocessor type file.", true);
      } else {
        // Store js preprocessor option if css option in existed
        var js = prompt("JS preprocessor ( " + jsOption.join(" | ") + " ): ");
        if (js == "") {
          js = "none";
        }
        // Check if option is existed
        if (!jsPreprocessor.includes(js)) {
          showError("Invalid js preprocessor type file", true);
        } else {
          var license;
          if (fs.existsSync(process.cwd() + "\\" + "package.json")) {
            let configData = fs.readFileSync(
              process.cwd() + "\\" + "package.json"
            );
            let obj = JSON.parse(configData);
            license = obj["license"];
            if (license != "MIT" && license != "ISC") {
              showError("Invalid license", true);
            } else {
              let configText;
              if (license == "ISC") {
                var name = obj["author"];
                configText =
                  `${html} \n` +
                  `${css} \n` +
                  `${js} \n` +
                  `${license}|${name}`;
              } else {
                configText =
                  `${html} \n` + `${css} \n` + `${js} \n` + `${license}`;
              }

              // Write to config file and create one
              fs.writeFile(
                dir + "\\" + "generateConfig.txt",
                configText,
                function(err) {
                  // Show error
                  if (err) {
                    showError("Something wrong when read you option", true);
                  }
                }
              );
            }
          } else {
            // showError("It missed gensetup.json", true);
            license = prompt(
              "License ( " +
                chalk.underline(" MIT ") +
                "|" +
                " ISC " +
                "|" +
                " none " +
                " ): "
            );
            if (license == "") {
              license = "MIT";
            }
            // Check if option is existed
            if (license != "MIT" && license != "none" && license != "ISC") {
              showError("Invalid license", true);
            } else {
              let configText;
              if (license == "ISC") {
                var name = prompt("Author: ");
                configText =
                  `${html} \n` +
                  `${css} \n` +
                  `${js} \n` +
                  `${license}|${name}`;
              } else {
                configText =
                  `${html} \n` + `${css} \n` + `${js} \n` + `${license}`;
              }

              // Write to config file and create one
              fs.writeFile(
                dir + "\\" + "generateConfig.txt",
                configText,
                function(err) {
                  // Show error
                  if (err) {
                    showError("Something wrong when read options", true);
                  }
                }
              );
            }
          }
        }
      }
    }
    // Join config file and dir in path
    var filePath = path.join(dir, "generateConfig.txt");

    // Store config content for future option
    var dataOption = [];

    /**
     * Readfile and store data in dataOption
     * @param {string} filePath path directory
     * @param {object} encoding for enconding
     * @param {any} function for asynchronous
     */
    fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
      // Show error
      if (!err) {
        // Split and trim data from file
        dataOption = data.split("\n").map(x => x.trim());

        // Create source folder base on data from config file
        makeSrc(dataOption, dir);
      } else {
        showError("Something wrong when read options", true);
      }
    });
  }
} else if (args.tree) {
  // Show tree of file
  showTree();
} else {
  showError("Can not find this command ", true);
}

// *********************************************

/**
 * Show error and help if we need
 * @param {string} mess This is error message we want to show
 * @param {boolean} showHelp This check if we need to show help
 */
function showError(mess, showHelp = false) {
  console.error(chalk.red(emoji.get("x") + mess));
  if (showHelp) {
    // Show help screen
    help();
  }
}

/**
 * Show directory tree using genproject
 */
function showTree() {
  // Show directory of
  let dir1 = process.cwd();
  if (fs.existsSync(dir + "\\" + "genproject.json")) {
    let configData = fs.readFileSync(dir + "\\" + "genproject.json");
    let obj = JSON.parse(configData);
    console.log(treeify.asTree(obj, true, false));
  } else {
    showError("It missed gensetup.json", true);
  }
}

function objectTree(fileName, fileType, err, obj, folderName1) {
  if (err) {
    // Show error
    showError(err.toString(), true);
    // checkError = true;
    return true;
  }
  console.log(
    chalk.green(
      emoji.get("heavy_check_mark"),
      ` File ${fileName}.${fileType} is created successfully.`
    )
  );
  obj["src"][folderName1][`${fileName}.${fileType}`] = null;
  return false;
}

var createFile = function(
  dirsrc,
  fileName,
  subFolder = "",
  fileType,
  text = ""
) {
  fs.writeFile(
    `${dirsrc}\\${fileType}\\${subFolder}${fileName}`,
    text,
    function(err) {
      // Show error
      if (err) {
        showError(err.toString(), true);
        // checkError = true;
        return true;
      }
      console.log(
        chalk.green(
          emoji.get("heavy_check_mark"),
          ` File ${fileName} is created successfully.`
        )
      );
      return false;
    }
  );
};

/**
 * Create src folder
 * @param {array} data Save all data type to create folder source
 * @param {string} dir Store directory of source
 */
function makeSrc(data, dir) {
  var objTree = {};
  let checkError = false;

  // Store directory of src folder
  let dirsrc = path.join(dir, "src");
  let dirdocs = path.join(dir, "docs");
  let current = process.cwd();

  // Create source folder
  fs.mkdirSync(dirsrc);
  fs.mkdirSync(dirdocs);
  objTree["src"] = {};
  objTree["docs"] = null;

  // TODO: Create .gitignore
  if (!checkError) {
    fs.writeFile(dir + "\\" + ".gitignore", "node_modules", function(err) {
      if (err) {
        //Show error
        showError(err.toString(), true);
        checkError = true;
      }
      console.log(
        chalk.green(
          emoji.get("heavy_check_mark"),
          " File .gitignore is created successfully."
        )
      );
    });
  }

  // TODO: Create package.json if it not exist
  if (!checkError) {
    let license;
    if (data[3] == "MIT") {
      license = "MIT";
    } else {
      license = "ISC";
    }
    let projectNameObj = dir.split("\\");
    let projectName = projectNameObj[projectNameObj.length - 1];
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

    if (data[0] != "none") {
      if (data[1] != "none") {
        htmlDependencies += ",";
        if (data[2] != "none") {
          cssDependencies += ",";
        }
      } else {
        if (data[2] != "none") {
          htmlDependencies += ",";
        }
      }
    }

    let samplePackage = `{
  "name": "${projectName}",
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
    ${htmlDependencies}${cssDependencies}${jsDependencies}
  }
}`;

    fs.writeFile(dir + "\\" + "package.json", samplePackage, function(err) {
      if (err) {
        //Show error
        showError(err.toString(), true);
        checkError = true;
      }
      console.log(
        chalk.green(
          emoji.get("heavy_check_mark"),
          " File package.json is created successfully."
        )
      );
    });
  }

  // TODO: Create README.md file to show in github in future
  if (!checkError) {
    fs.writeFile(dir + "\\" + "README.md", "", function(err) {
      if (err) {
        //Show error if can not create file
        showError(err.toString(), true);
        checkError = true;
      }
      console.log(
        chalk.green(
          emoji.get("heavy_check_mark"),
          " File README.md is created successfully."
        )
      );
    });
  }

  // TODO: Create gulpfile.js file
  if (!checkError) {
    let gulpData = `const gulp = require('gulp');
const { series, parallel, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const image = require('gulp-imagemin');
const htmlReplace = require('gulp-html-replace');
const changed = require('gulp-changed');
const newer = require('gulp-newer');
const size = require('gulp-size');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const urlAdjuster = require('gulp-css-replace-url');
`;
    let cssPackage,
      cssFunction,
      jsPackage,
      jsFunction,
      htmlPackage,
      htmlFunction,
      cssWatch,
      jsWatch,
      htmlWatch;

    switch (data[0]) {
      case "pug":
        htmlPackage = `const pug = require('gulp-pug');`;
        htmlFunction = `

function htmlPreprocessor() {
  return src('./src/pug/*.pug')
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(dest('./src'))
    .pipe(browserSync.stream());
}`;
        htmlWatch = `  gulp.watch('./src/pug/*.pug', htmlPreprocessor);`;
        break;
      case "haml":
        htmlPackage = `const haml = require('gulp-haml');`;
        htmlFunction = `

function htmlPreprocessor() {
  return src('./src/haml/*.haml')
    .pipe(
      haml()
    )
    .pipe(dest('./src'))
    .pipe(browserSync.stream());
}`;
        htmlWatch = `  gulp.watch('./src/haml/*.haml', htmlPreprocessor);`;
        break;
      case "slim":
        htmlPackage = `const slim = require('gulp-slim');`;
        htmlFunction = `

function htmlPreprocessor() {
  return src('./src/slim/*.slim')
    .pipe(
      slim({
        pretty: true
      })
    )
    .pipe(dest('./src'))
    .pipe(browserSync.stream());
}`;
        htmlWatch = `  gulp.watch('./src/slim/*.slim', htmlPreprocessor);`;
        break;
      default:
        htmlPackage = ``;
        htmlFunction = `
`;
        htmlWatch = `  gulp.watch('./src/*.html').on('change', browserSync.reload);`;
        break;
    }

    switch (data[1]) {
      case "sass":
        cssPackage = `
const sass = require('gulp-sass');
const Fiber = require('fibers');`;
        cssFunction = `

function cssPreprocessor() {
  return src('./src/sass/*.sass')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'expanded',
        fiber: Fiber,
        precision: 3,
        errLogToConsole: true
      }).on('error', sass.logError)
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream());
}`;
        cssWatch = `  gulp.watch('./src/sass/**/*.sass', cssPreprocessor);`;
        break;
      case "scss":
        cssPackage = `
const scss = require('gulp-sass');
const Fiber = require('fibers');`;
        cssFunction = `

function cssPreprocessor() {
  return src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(
      scss({
        outputStyle: 'expanded',
        fiber: Fiber,
        precision: 3,
        errLogToConsole: true
      }).on('error', scss.logError)
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream());
}`;
        cssWatch = `  gulp.watch('./src/scss/**/*.scss', cssPreprocessor);`;
        break;
      case "stylus":
        cssPackage = `
const stylus = require('gulp-stylus');`;
        cssFunction = `

function cssPreprocessor() {
  return src('./src/stylus/**/*.styl')
    .pipe(sourcemaps.init())
    .pipe(
      stylus({
        compress: true
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream());
}`;
        cssWatch = `  gulp.watch('./src/stylus/**/*.styl', cssPreprocessor);`;
        break;
      case "less":
        cssPackage = `
const less = require('gulp-less');`;
        cssFunction = `

function cssPreprocessor() {
  return src('./src/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(dest('./src/css'))
    .pipe(browserSync.stream());
}`;
        cssWatch = `  gulp.watch('./src/less/**/*.less', cssPreprocessor);`;
        break;
      default:
        cssPackage = ``;
        cssFunction = ``;
        cssWatch = `  gulp.watch('./src/*.css').on('change', browserSync.reload);`;
        break;
    }

    switch (data[2]) {
      case "typescript":
        jsPackage = `
const ts = require('gulp-typescript');`;
        jsFunction = `
function jsPreprocessor() {
  return src('./src/ts/**/*.ts')
    .pipe(
      ts()
    )
    .pipe(dest('./src/js'))
    .pipe(browserSync.stream());
}`;
        jsWatch = `  gulp.watch('./src/ts/**/*.ts', jsPreprocessor);`;
        break;
      case "coffeescript":
        jsPackage = `
const coffee = require('gulp-coffee');`;
        jsFunction = `
function jsPreprocessor() {
  return src('./src/coffeescript/**/*.coffee')
    .pipe(
      coffee()
    )
    .pipe(dest('./src/js'))
    .pipe(browserSync.stream());
}`;
        jsWatch = `  gulp.watch('./src/coffeescript/**/*.coffee', jsPreprocessor);`;
        break;
      default:
        jsPackage = ``;
        jsFunction = ``;
        jsWatch = `  gulp.watch('./js/**/*.js').on('change', browserSync.reload);`;
        break;
    }

    let gulpWatch = `

function watch() {
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });
  ${cssWatch}
  ${htmlWatch}
  ${jsWatch}
}`;

    let gulpMinify = `

function minifyImage() {
  return src(['./src/img/**/*', '!./src/img/desktop.ini'])
    .pipe(changed('./docs/img'))
    .pipe(newer('image/'))
    .pipe(
      image([
        image.gifsicle({ interlaced: true }),
        image.mozjpeg({quality: 75, progressive: true}),
        image.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(
      size({
        showFiles: true
      })
    )
    .pipe(dest('./docs/img'))
    .pipe(dest('./src/img'));
}

function minifyJs() {
  return src('./src/js/**/*.js')
    .pipe(changed('./docs/js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(dest('./docs/js'));
}

function minifyCss() {
  return (
    src(['./src/css/*.css'])
      .pipe(changed('./docs/css'))
      .pipe(sourcemaps.init())
      .pipe(
        urlAdjuster({
          replace: ['../../', '../']
        })
      )
      .pipe(autoprefixer())
      .pipe(csso())
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(sourcemaps.write('.'))
      .pipe(
        size({
          showFiles: true
        })
      )
      .pipe(dest('./docs/css'))
  );
}

function minifyHtml() {
  return (
    src('./src/**/*.html')
      .pipe(changed('./docs'))
      .pipe(
        htmlReplace({
          css: 'css/main.min.css',
          js: 'js/index.min.js'
        })
      )
      .pipe(dest('./docs'))
  );
}

function fontCopy() {
  return src('./src/font/*')
    .pipe(changed('./docs/font'))
    .pipe(dest('./docs/font'));
}

function libCopy() {
  return src('./src/lib/**/*')
    .pipe(changed('./docs/lib'))
    .pipe(dest('./docs/lib'));
}

function cleanDist() {
  return src('./docs', { read: false }).pipe(clean());
}

exports.watch = watch;
exports.minifyImage = minifyImage;
exports.minifyJs = minifyJs;
exports.minifyCss = minifyCss;
exports.minifyHtml = minifyHtml;
exports.cleanDist = cleanDist;
exports.default = series(
  cleanDist,
  parallel(
    minifyImage,
    parallel(
      minifyJs,
      parallel(minifyCss, parallel(minifyHtml, parallel(fontCopy, libCopy)))
    )
  )
);`;

    gulpData += htmlPackage;
    gulpData += cssPackage;
    gulpData += jsPackage;

    gulpData += htmlFunction;
    gulpData += cssFunction;
    gulpData += jsFunction;

    gulpData += gulpWatch;
    gulpData += gulpMinify;

    fs.writeFile(dir + "\\" + "gulpfile.js", gulpData, function(err) {
      if (err) {
        //Show error if can not create file
        showError(err.toString(), true);
        checkError = true;
      }
      console.log(
        chalk.green(
          emoji.get("heavy_check_mark"),
          " File gulpfile.js is created successfully."
        )
      );
    });
  }

  // TODO: Create LICENSE file to show license of open source project in github in future
  if (!checkError) {
    let license;
    if (data[3] != "none") {
      if (data[3] == "MIT") {
        license = `The MIT License

Copyright (c)

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
      } else {
        let isc = data[3].split("|");
        let currentYear = new Date().getFullYear();
        license = `Copyright ${currentYear} ${isc[1]}

Permission to use, copy, modify, and/or distribute this software for any 
purpose with or without fee is hereby granted, provided that the above 
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`;
      }
      fs.writeFile(dir + "\\" + "LICENSE", license, function(err) {
        if (err) {
          showError(err.toString(), true);
          checkError = true;
        }
        console.log(
          chalk.green(
            emoji.get("heavy_check_mark"),
            " File LICENSE is created successfully."
          )
        );
      });
    }
  }

  // Default folder and file
  // Create css folder default
  if (!checkError) {
    fs.mkdirSync(dirsrc + "\\" + "css");
    objTree["src"]["css"] = {};
  }

  // Create main.css file in css folder default
  if (!checkError) {
    fs.writeFile(
      dirsrc + "\\" + "css" + "\\" + "main.css",
      cssFile.none.main,
      function(err) {
        // Show error
        if (err) {
          showError(err.toString(), true);
          checkError = true;
        }
        console.log(
          chalk.green(
            emoji.get("heavy_check_mark"),
            " File main.css is created successfully."
          )
        );
        objTree["src"]["css"]["main.css"] = null;
      }
    );
  }

  // Create js folder default
  if (!checkError) {
    fs.mkdirSync(dirsrc + "\\" + "js");
    objTree["src"]["js"] = {};
  }

  // Create index.js file in js folder default
  if (!checkError) {
    fs.writeFile(
      dirsrc + "\\" + "js" + "\\" + "index.js",
      jsFile.none.index,
      function(err) {
        // Show error
        if (err) {
          showError(err.toString(), true);
          checkError = true;
        }
        console.log(
          chalk.green(
            emoji.get("heavy_check_mark"),
            " File index.js is created successfully."
          )
        );
        objTree["src"]["js"]["index.js"] = null;
      }
    );
  }

  // Create index.html file default
  if (!checkError) {
    fs.writeFile(dirsrc + "\\" + "index.html", htmlFile.none.index, function(
      err
    ) {
      if (err) {
        showError(err.toString(), true);
        checkError = true;
      }
      console.log(
        chalk.green(
          emoji.get("heavy_check_mark"),
          " File index.html is created successfully."
        )
      );
      objTree["src"]["index.html"] = null;
    });
  }

  // Check if user contain html preprocessor
  if (data[0] != "none" && !checkError) {
    // Create folder with data type
    fs.mkdirSync(dirsrc + "\\" + data[0]);
    objTree["src"][data[0]] = {};
    // Create file with data type at the end

    if (data[0] == "pug") {
      let pugFile = htmlFile.pug;

      checkError = createFile(dirsrc, "index.pug", "", "pug", pugFile.index);

      if (!checkError) {
        objTree["src"]["pug"]["index.pug"] = null;
      }
    } else if (data[0] == "haml") {
      let hamlFile = htmlFile.haml;

      checkError = createFile(dirsrc, "index.haml", "", "haml", hamlFile.index);

      if (!checkError) {
        objTree["src"]["haml"]["index.haml"] = null;
      }
    } else {
      let slimFile = htmlFile.slim;
      checkError = createFile(dirsrc, "index.slim", "", "slim", slimFile.index);

      if (!checkError) {
        objTree["src"]["slim"]["index.slim"] = null;
      }
    }
  }

  // Check if user contain css preprocessor
  if (data[1] != "none" && !checkError) {
    // Create folder with data type
    fs.mkdirSync(dirsrc + "\\" + data[1]);
    objTree["src"][data[1]] = {};
    // Create file with data type at the end
    if (data[1] == "less") {
      let lessFile = cssFile.less;
      checkError = createFile(dirsrc, "main.less", "", "less", lessFile.main);

      if (!checkError) {
        objTree["src"]["less"]["main.less"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "less" + "\\" + "utilities");
      objTree["src"]["less"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "font.less",
        "utilities\\",
        "less",
        lessFile.font
      );

      if (!checkError) {
        objTree["src"]["less"]["utilities"]["font.less"] = null;
      }

      checkError = createFile(
        dirsrc,
        "text.less",
        "utilities\\",
        "less",
        lessFile.text
      );

      if (!checkError) {
        objTree["src"]["less"]["utilities"]["text.less"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "less" + "\\" + "layout");
      objTree["src"]["less"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "flex.less",
        "layout\\",
        "less",
        lessFile.flex
      );

      if (!checkError) {
        objTree["src"]["less"]["layout"]["flex.less"] = null;
      }

      checkError = createFile(
        dirsrc,
        "header.less",
        "layout\\",
        "less",
        lessFile.header
      );

      if (!checkError) {
        objTree["src"]["less"]["layout"]["header.less"] = null;
      }

      checkError = createFile(
        dirsrc,
        "section.less",
        "layout\\",
        "less",
        lessFile.section
      );

      if (!checkError) {
        objTree["src"]["less"]["layout"]["section.less"] = null;
      }

      checkError = createFile(
        dirsrc,
        "footer.less",
        "layout\\",
        "less",
        lessFile.footer
      );

      if (!checkError) {
        objTree["src"]["less"]["layout"]["footer.less"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "less" + "\\" + "components");
      objTree["src"]["less"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "button.less",
        "components\\",
        "less",
        ""
      );

      if (!checkError) {
        objTree["src"]["less"]["components"]["button.less"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "less" + "\\" + "base");
      objTree["src"]["less"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "reset.less",
        "base\\",
        "less",
        lessFile.reset
      );

      if (!checkError) {
        objTree["src"]["less"]["base"]["reset.less"] = null;
      }

      checkError = createFile(
        dirsrc,
        "typography.less",
        "base\\",
        "less",
        lessFile.typography
      );

      if (!checkError) {
        objTree["src"]["less"]["base"]["typography.less"] = null;
      }
    } else if (data[1] == "sass") {
      let sassFile = cssFile.sass;

      checkError = createFile(dirsrc, "main.sass", "", "sass", sassFile.main);

      if (!checkError) {
        objTree["src"]["sass"]["main.sass"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "sass" + "\\" + "utilities");
      objTree["src"]["sass"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "_font.sass",
        "utilities\\",
        "sass",
        sassFile.font
      );

      if (!checkError) {
        objTree["src"]["sass"]["utilities"]["_font.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_text.sass",
        "utilities\\",
        "sass",
        sassFile.text
      );

      if (!checkError) {
        objTree["src"]["sass"]["utilities"]["_text.sass"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "sass" + "\\" + "layout");
      objTree["src"]["sass"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "_flex.sass",
        "layout\\",
        "sass",
        sassFile.flex
      );

      if (!checkError) {
        objTree["src"]["sass"]["layout"]["_flex.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_header.sass",
        "layout\\",
        "sass",
        sassFile.header
      );

      if (!checkError) {
        objTree["src"]["sass"]["layout"]["_header.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_section.sass",
        "layout\\",
        "sass",
        sassFile.section
      );

      if (!checkError) {
        objTree["src"]["sass"]["layout"]["_section.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_footer.sass",
        "layout\\",
        "sass",
        sassFile.footer
      );

      if (!checkError) {
        objTree["src"]["sass"]["layout"]["_footer.sass"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "sass" + "\\" + "helpers");
      objTree["src"]["sass"]["helpers"] = {};

      checkError = createFile(
        dirsrc,
        "_variables.sass",
        "helpers\\",
        "sass",
        sassFile.variables
      );

      if (!checkError) {
        objTree["src"]["sass"]["helpers"]["_variables.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_mixins.sass",
        "helpers\\",
        "sass",
        sassFile.mixins
      );

      if (!checkError) {
        objTree["src"]["sass"]["helpers"]["_mixins.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_functions.sass",
        "helpers\\",
        "sass",
        sassFile.functions
      );

      if (!checkError) {
        objTree["src"]["sass"]["helpers"]["_functions.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_helpers.sass",
        "helpers\\",
        "sass",
        sassFile.helpers
      );

      if (!checkError) {
        objTree["src"]["sass"]["helpers"]["_helpers.sass"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "sass" + "\\" + "components");
      objTree["src"]["sass"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "_button.sass",
        "components\\",
        "sass",
        sassFile.button
      );

      if (!checkError) {
        objTree["src"]["sass"]["components"]["_button.sass"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "sass" + "\\" + "base");
      objTree["src"]["sass"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "_reset.sass",
        "base\\",
        "sass",
        sassFile.reset
      );

      if (!checkError) {
        objTree["src"]["sass"]["base"]["_reset.sass"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_typography.sass",
        "base\\",
        "sass",
        sassFile.typography
      );

      if (!checkError) {
        objTree["src"]["sass"]["base"]["_typography.sass"] = null;
      }
    } else if (data[1] == "scss") {
      let scssFile = cssFile.scss;

      checkError = createFile(dirsrc, "main.scss", "", "scss", scssFile.main);

      if (!checkError) {
        objTree["src"]["scss"]["main.scss"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "utilities");
      objTree["src"]["scss"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "_font.scss",
        "utilities\\",
        "scss",
        scssFile.font
      );

      if (!checkError) {
        objTree["src"]["scss"]["utilities"]["_font.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_text.scss",
        "utilities\\",
        "scss",
        scssFile.text
      );

      if (!checkError) {
        objTree["src"]["scss"]["utilities"]["_text.scss"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "layout");
      objTree["src"]["scss"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "_flex.scss",
        "layout\\",
        "scss",
        scssFile.flex
      );

      if (!checkError) {
        objTree["src"]["scss"]["layout"]["_flex.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_header.scss",
        "layout\\",
        "scss",
        scssFile.header
      );

      if (!checkError) {
        objTree["src"]["scss"]["layout"]["_header.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_section.scss",
        "layout\\",
        "scss",
        scssFile.section
      );

      if (!checkError) {
        objTree["src"]["scss"]["layout"]["_section.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_footer.scss",
        "layout\\",
        "scss",
        scssFile.footer
      );

      if (!checkError) {
        objTree["src"]["scss"]["layout"]["_footer.scss"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "helpers");
      objTree["src"]["scss"]["helpers"] = {};

      checkError = createFile(
        dirsrc,
        "_variables.scss",
        "helpers\\",
        "scss",
        scssFile.variables
      );

      if (!checkError) {
        objTree["src"]["scss"]["helpers"]["_variables.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_mixins.scss",
        "helpers\\",
        "scss",
        scssFile.mixins
      );

      if (!checkError) {
        objTree["src"]["scss"]["helpers"]["_mixins.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_functions.scss",
        "helpers\\",
        "scss",
        scssFile.functions
      );

      if (!checkError) {
        objTree["src"]["scss"]["helpers"]["_functions.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_helpers.scss",
        "helpers\\",
        "scss",
        scssFile.helpers
      );

      if (!checkError) {
        objTree["src"]["scss"]["helpers"]["_helpers.scss"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "components");
      objTree["src"]["scss"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "_button.scss",
        "components\\",
        "scss",
        scssFile.button
      );

      if (!checkError) {
        objTree["src"]["scss"]["components"]["_button.scss"] = null;
      }

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "base");
      objTree["src"]["scss"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "_reset.scss",
        "base\\",
        "scss",
        scssFile.reset
      );

      if (!checkError) {
        objTree["src"]["scss"]["base"]["_reset.scss"] = null;
      }

      checkError = createFile(
        dirsrc,
        "_typography.scss",
        "base\\",
        "scss",
        scssFile.typography
      );

      if (!checkError) {
        objTree["src"]["scss"]["base"]["_typography.scss"] = null;
      }
    } else {
      checkError = createFile(dirsrc, "main.styl", "", "stylus", "");

      if (!checkError) {
        objTree["src"]["stylus"]["main.styl"] = null;
      }
    }
  }

  // Check if user contain js preprocessor
  if (data[2] != "none" && !checkError) {
    // Check if user use typescript
    if (data[2] == "typescript") {
      // Create ts folder instead of typescript
      let tsFile = jsFile.typescript;
      fs.mkdirSync(`${dirsrc}\\ts`);
      objTree["src"]["ts"] = {};

      checkError = createFile(dirsrc, "index.ts", "", "ts", tsFile.index);

      if (!checkError) {
        objTree["src"]["ts"]["index.ts"] = null;
      }
    } else {
      let coffeeFile = jsFile.coffeescript;
      // Create coffee folder instead of coffeescript
      fs.mkdirSync(`${dirsrc}\\coffeescript`);
      objTree["src"]["coffeescript"] = {};

      checkError = createFile(
        dirsrc,
        "index.coffee",
        "",
        "coffeescript",
        coffeeFile.index
      );
      if (!checkError) {
        objTree["src"]["coffeescript"]["index.coffee"] = null;
      }
    }
  }

  // TODO: Create font folder for store font in future
  if (!checkError) {
    ncp(__dirname + "\\" + "font", dirsrc + "\\" + "font", function(err) {
      if (err) {
        return console.error(err);
      }
      objTree["src"]["font"] = {};
      objTree["src"]["font"]["FiraCode-Regular.ttf"] = null;
      objTree["src"]["font"]["Roboto-Bold.ttf"] = null;
      objTree["src"]["font"]["Roboto-Medium.ttf"] = null;
      objTree["src"]["font"]["Roboto-Regular.ttf"] = null;
    });
  }

  // TODO: Create img folder for store img in future
  if (!checkError) {
    // fs.mkdirSync(dirsrc + "\\" + "img");
    // objTree["src"]["img"] = null;
    ncp(__dirname + "\\" + "img", dirsrc + "\\" + "img", function(err) {
      if (err) {
        return console.error(err);
      }
      objTree["src"]["img"] = {};
      objTree["src"]["img"]["header.svg"] = null;
      objTree["src"]["img"]["section.svg"] = null;
    });
  }

  // TODO: Create lib folder for store lib in future
  if (!checkError) {
    ncp(__dirname + "\\" + "lib", dirsrc + "\\" + "lib", function(err) {
      if (err) {
        return console.error(err);
      }
      objTree["src"]["lib"] = {};
      objTree["src"]["lib"]["jquery.scrollify.js"] = null;
      objTree["src"]["lib"]["jquery-3.4.1.min.js"] = null;
    });
  }

  if (!checkError) {
    objTree[".gitignore"] = null;
    objTree["gulpfile.js"] = null;
    objTree["package.json"] = null;
    objTree["README.md"] = null;
    objTree["LICENSE"] = null;
  }

  // Delete config file after create success folder
  fs.unlinkSync(dir + "\\" + "generateConfig.txt");
  setTimeout(
    function(objTree) {
      var json = JSON.stringify(objTree);
      // TODO: Create LICENSE file to show license of open source project in github in future
      if (!checkError) {
        fs.writeFile(dir + "\\" + "genproject.json", json, function(err) {
          if (err) {
            showError(err.toString(), true);
            checkError = true;
          }
          console.log(
            chalk.green(
              emoji.get("heavy_check_mark"),
              " File genproject.json is created successfully."
            )
          );
          // This show that to do after create project
          console.log();
          console.log();
          let dirArr = dir.split("\\");
          let folderName = dirArr[dirArr.length - 1];
          console.log(chalk.green("Let go to directory:    cd " + folderName));
          console.log(chalk.green("Show folder and file:   genproject -t"));
          console.log();
          console.log();
        });
      } else {
        showError("Fail to create folder ", true);
      }
    },
    1000,
    objTree
  );
}

/**
 * Print help to remind command line able to use
 */
function help() {
  console.log();
  console.log("Usage:");
  console.log("  $ gensetup <command>");
  console.log();
  console.log("Options:");
  console.log("  -h, --help            print this help");
  console.log("  -v, --version         print version");
  console.log("  -t, --tree            print directory tree");
  console.log("  init <folder name>    create new folder");
  console.log();
}
