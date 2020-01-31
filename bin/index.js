#!/usr/bin/env node

"use strict";

const path = require("path"); // Join path of process.cwd() and file
const fs = require("fs"); // Create file, delete file, create folder, write to file
const chalk = require("chalk"); // Color text
const ncp = require("ncp").ncp; // Copy folder
ncp.limit = 16;

const prompts = require("prompts"); // New prompt to autocomplete
const ora = require("ora");
// @ts-ignore
let spinner = new ora({
  discardStdin: false,
  text: ""
});

let htmlFile = require("./html.js"); // Data of all html preprocessor code
let cssFile = require("./css.js"); // Data of all css preprocessor code
let jsFile = require("./javascript.js"); // Data of all js preprocessor code
let licenseFile = require("./license.js");
let taskFile = require("./task.js");
let packageFile = require("./package.js");
let dirTree = require("./tree");

// Store all kind of preprocessor able to use
const htmlOption = [chalk.underline("none"), "haml", "pug", "slim"];
const cssOption = [chalk.underline("none"), "sass", "scss", "stylus", "less"];
const jsOption = [chalk.underline("none"), "typescript", "coffeescript"];

const htmlPreprocessor = ["none", "haml", "pug", "slim"];
const cssPreprocessor = ["none", "sass", "scss", "stylus", "less"];
const jsPreprocessor = ["none", "typescript", "coffeescript"];

// Store argument of cli-app
var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "version", "tree", "remove"], // Use --
  alias: { h: "help", v: "version", t: "tree", r: "remove" } // Use -
});

var dir = process.cwd(); // current directory

// Check user argument
if (args.help) {
  help(); // Show help screen
} else if (args.version) {
  console.log("v3.0.0"); // Show version of app
} else if (args._[0] == "init") {
  let overwrite = false; // Check if folder name is existed in this directory
  if (args._[1]) {
    // Check if dirname is existed
    if (!fs.existsSync(`{dir}\\{args._[1]}`)) {
      dir = `${dir}\\${args._[1]}`; // Change dir to new directory
    } else {
      overwrite = true;
      console.error(chalk.yellow("This file name is exist !"));
    }
    if (!overwrite) fs.mkdirSync(dir); // Create new project folder
  }

  if (!overwrite) {
    let checkSupportPrompts;
    let shell = process.env.SHELL;
    if (shell == undefined) {
      checkSupportPrompts = true;
    } else {
      let c = shell.split`\\`.pop();
      // Check if git bash run CLI app
      if (c == "bash.exe") {
        checkSupportPrompts = false;
      } else {
        checkSupportPrompts = true;
      }
    }

    if (checkSupportPrompts) {
      (async () => {
        // @ts-ignore
        let response = await prompts([
          {
            type: "autocomplete",
            name: "html",
            message: "HTML preprocessor ( " + htmlOption.join(" | ") + " ): ",
            choices: [
              { title: "none" },
              { title: "haml" },
              { title: "pug" },
              { title: "slim" }
            ]
          },
          {
            type: "autocomplete",
            name: "css",
            message: "CSS preprocessor ( " + cssOption.join(" | ") + " ): ",
            choices: [
              { title: "none" },
              { title: "sass" },
              { title: "scss" },
              { title: "stylus" },
              { title: "less" }
            ]
          },
          {
            type: "autocomplete",
            name: "js",
            message: "JS preprocessor ( " + jsOption.join(" | ") + " ): ",
            choices: [
              { title: "none" },
              { title: "typescript" },
              { title: "coffeescript" }
            ]
          },
          {
            type: "autocomplete",
            name: "license",
            message:
              "License ( " +
              chalk.underline(" MIT ") +
              "|" +
              " ISC " +
              "|" +
              " none " +
              " ): ",
            choices: [{ title: "MIT" }, { title: "ISC" }, { title: "none" }]
          }
        ]);
        let dataOption;
        if (response.license == "ISC") {
          let response1 = await prompts({
            type: "text",
            name: "author",
            message: "  Author: "
          });
          dataOption = [
            response.html,
            response.css,
            response.js,
            `${response.license}|${response1.author}`
          ];
        } else {
          dataOption = [
            response.html,
            response.css,
            response.js,
            response.license
          ];
        }

        if (args.remove) {
          if (args.tree) makeSrc(dataOption, dir, true, true);
          else makeSrc(dataOption, dir, true);
        } else {
          if (args.tree) makeSrc(dataOption, dir, false, true);
          else makeSrc(dataOption, dir);
        }
      })();
    } else {
      (async () => {
        // @ts-ignore
        let response = await prompts([
          {
            type: "text",
            name: "html",
            message: `HTML preprocessor ( ${htmlOption.join(" | ")} ): `
          },
          {
            type: "text",
            name: "css",
            message: `CSS preprocessor ( ${cssOption.join(" | ")} ): `
          },
          {
            type: "text",
            name: "js",
            message: `JS preprocessor ( ${jsOption.join(" | ")} ): `
          },
          {
            type: "text",
            name: "license",
            message: `License (${chalk.underline(" MIT ")}| ISC | none ): `
          }
        ]);
        if (response.html == "") response.html = "none";
        if (response.css == "") response.css = "none";
        if (response.js == "") response.js = "none";
        if (response.license == "") response.license = "MIT";

        let invalid = false;
        if (!htmlPreprocessor.includes(response.html)) {
          invalid = true;
          showError("Invalid html preprocessor type file.");
        }
        if (!cssPreprocessor.includes(response.css)) {
          invalid = true;
          showError("Invalid css preprocessor type file.");
        }
        if (!jsPreprocessor.includes(response.js)) {
          invalid = true;
          showError("Invalid js preprocessor type file.");
        }
        if (
          response.license != "MIT" &&
          response.license != "ISC" &&
          response.license != "none"
        ) {
          invalid = true;
          showError("Invalid license.");
        }

        let dataOption;
        if (!invalid) {
          if (response.license == "ISC") {
            let response1 = await prompts({
              type: "text",
              name: "author",
              message: "  Author: "
            });
            dataOption = [
              response.html,
              response.css,
              response.js,
              `${response.license}|${response1.author}`
            ];
          } else {
            dataOption = [
              response.html,
              response.css,
              response.js,
              response.license
            ];
          }
          if (args.remove) {
            if (args.tree) makeSrc(dataOption, dir, true, true);
            else makeSrc(dataOption, dir, true);
          } else {
            if (args.tree) makeSrc(dataOption, dir, false, true);
            else makeSrc(dataOption, dir);
          }
        } else {
          help();
        }
      })();
    }
  }
} else if (args.tree) {
  dirTree(dir);
} else showError("Can not find this command ", true);

// *********************************************

/**
 * Show error and help if we need
 * @param {string} mess This is error message we want to show
 * @param {boolean} showHelp This check if we need to show help
 */
function showError(mess, showHelp = false) {
  console.error(chalk.red(!!!mess));
  if (showHelp) help();
}

/**
 *
 * @param {String} dirsrc source path
 * @param {String} fileName name of file
 * @param {String} subFolder name of subfolder
 * @param {String} fileType name of file type
 * @param {String} text content of file
 * @returns {Boolean} check error
 */
function createFile(dirsrc, fileName, subFolder = "", fileType, text = "") {
  spinner.start();
  spinner.text = `Loading ${chalk.yellow(`${fileName}`)}`;
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
      setTimeout(() => {
        spinner.succeed(
          `${chalk.green(`File ${fileName} is created successfully.`)}`
        );
      }, 2200);
    }
  );
  return false;
}

/**
 * Create src folder
 * @param {array} data Save all data type to create folder source
 * @param {string} dir Store directory of source
 */
function makeSrc(data, dir, remove = false, showTree = false) {
  let checkError = false;

  // Store directory of src folder
  let dirsrc = path.join(dir, "src");
  let dirdocs = path.join(dir, "docs");
  let current = process.cwd();

  // Create source folder
  fs.mkdirSync(dirsrc);
  fs.mkdirSync(dirdocs);

  if (remove) {
    htmlFile = {
      pug: {
        index: ""
      },
      none: {
        index: ""
      },
      haml: {
        index: ""
      },
      slim: {
        index: ""
      }
    };

    cssFile = {
      scss: {
        reset: "",
        typography: "",
        variables: "",
        flex: "",
        header: "",
        section: "",
        footer: "",
        font: "",
        text: "",
        main: cssFile.scss.main
      },
      none: {
        main: ""
      },
      sass: {
        reset: "",
        typography: "",
        variables: "",
        flex: "",
        header: "",
        section: "",
        footer: "",
        font: "",
        text: "",
        main: cssFile.sass.main
      },
      less: {
        reset: "",
        typography: "",
        flex: "",
        header: "",
        section: "",
        footer: "",
        font: "",
        text: "",
        main: cssFile.less.main
      },
      stylus: {
        reset: "",
        typography: "",
        variables: "",
        flex: "",
        header: "",
        section: "",
        footer: "",
        font: "",
        text: "",
        main: cssFile.stylus.main
      }
    };

    jsFile = {
      none: {
        index: ""
      },
      typescript: {
        index: ""
      },
      coffeescript: {
        index: ""
      }
    };
  }

  // TODO: Create .gitignore
  if (!checkError) {
    spinner.start();
    spinner.text = `Loading ${chalk.yellow(".gitignore")}`;
    fs.writeFile(`${dir}\\.gitignore`, "node_modules", function(err) {
      if (err) {
        showError(err.toString(), true);
        checkError = true;
      }
      setTimeout(() => {
        spinner.succeed(
          `${chalk.green("File .gitignore is created successfully.")}`
        );
      }, 700);
    });
  }

  // TODO: Create package.json if it not exist
  if (!checkError) {
    spinner.start();
    spinner.text = `Loading ${chalk.yellow("package.json")}`;
    let license;
    if (data[3] == "MIT") {
      license = "MIT";
    } else {
      license = "ISC";
    }
    let projectNameObj = dir.split("\\");
    let projectName = projectNameObj[projectNameObj.length - 1];
    let htmlDependencies, cssDependencies, jsDependencies;

    [htmlDependencies, cssDependencies, jsDependencies] = [
      ...packageFile.gulp(data)
    ];

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
    let samplePackage = packageFile.npm(
      projectName,
      license,
      htmlDependencies,
      cssDependencies,
      jsDependencies
    );

    fs.writeFile(`${dir}\\package.json`, samplePackage, function(err) {
      if (err) {
        showError(err.toString(), true);
        checkError = true;
      }
      setTimeout(() => {
        spinner.succeed(
          `${chalk.green("File package.json is created successfully.")}`
        );
      }, 800);
    });
  }

  // TODO: Create README.md file to show in github in future
  if (!checkError) {
    spinner.start();
    spinner.text = `Loading ${chalk.yellow("README.md")}`;
    fs.writeFile(`${dir}\\README.md`, "", function(err) {
      if (err) {
        showError(err.toString(), true);
        checkError = true;
      }
      setTimeout(() => {
        spinner.succeed(
          `${chalk.green("File README.md is created successfully.")}`
        );
      }, 1000);
    });
  }

  // TODO: Create gulpfile.js file
  if (!checkError) {
    spinner.start();
    spinner.text = `Loading ${chalk.yellow("gulpfile.js")}`;
    let gulpData = taskFile.gulp.data;
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
        cssWatch = `  gulp.watch('./src/css/**/*.css').on('change', browserSync.reload);`;
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
        jsWatch = `  gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);`;
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
    let gulpMinify = taskFile.gulp.minify;

    gulpData += htmlPackage;
    gulpData += cssPackage;
    gulpData += jsPackage;

    gulpData += htmlFunction;
    gulpData += cssFunction;
    gulpData += jsFunction;

    gulpData += gulpWatch;
    gulpData += gulpMinify;

    fs.writeFile(`${dir}\\gulpfile.js`, gulpData, function(err) {
      if (err) {
        //Show error if can not create file
        showError(err.toString(), true);
        checkError = true;
      }
      setTimeout(() => {
        spinner.succeed(
          `${chalk.green("File gulpfile.js is created successfully.")}`
        );
      }, 1500);
    });
  }

  // TODO: Create LICENSE file to show license of open source project in github in future
  if (!checkError) {
    spinner.start();
    spinner.text = `Loading ${chalk.yellow("LICENSE")}`;
    let license;
    if (data[3] != "none") {
      if (data[3] == "MIT") license = licenseFile.mit;
      else {
        let isc = data[3].split("|");
        let currentYear = new Date().getFullYear();
        license = licenseFile.isc(currentYear, isc[1]);
      }
      fs.writeFile(`${dir}\\LICENSE`, license, function(err) {
        if (err) {
          showError(err.toString(), true);
          checkError = true;
        }
        setTimeout(() => {
          spinner.succeed(
            `${chalk.green("File LICENSE is created successfully.")}`
          );
        }, 1100);
      });
    }
  }

  // Default folder and file
  // Create css folder default
  if (!checkError) {
    fs.mkdirSync(`${dirsrc}\\css`);
  }

  // Create main.css file in css folder default
  if (!checkError) {
    checkError = createFile(dirsrc, "main.css", "", "css", cssFile.none.main);
  }

  // Create js folder default
  if (!checkError) {
    fs.mkdirSync(`${dirsrc}\\js`);
  }

  // Create index.js file in js folder default
  if (!checkError) {
    checkError = createFile(dirsrc, "index.js", "", "js", jsFile.none.index);
  }

  // Create index.html file default
  if (!checkError) {
    spinner.start();
    spinner.text = `Loading ${chalk.yellow("index.html")}`;
    fs.writeFile(`${dirsrc}\\index.html`, htmlFile.none.index, function(err) {
      if (err) {
        showError(err.toString(), true);
        checkError = true;
      }
      setTimeout(() => {
        spinner.succeed(
          `${chalk.green("File index.html is created successfully.")}`
        );
      }, 2000);
    });
  }

  // Check if user contain html preprocessor
  if (data[0] != "none" && !checkError) {
    fs.mkdirSync(`${dirsrc}\\${data[0]}`);

    if (data[0] == "pug") {
      let pugFile = htmlFile.pug;

      checkError = createFile(dirsrc, "index.pug", "", "pug", pugFile.index);
    } else if (data[0] == "haml") {
      let hamlFile = htmlFile.haml;

      checkError = createFile(dirsrc, "index.haml", "", "haml", hamlFile.index);
    } else {
      let slimFile = htmlFile.slim;
      checkError = createFile(dirsrc, "index.slim", "", "slim", slimFile.index);
    }
  }

  // Check if user contain css preprocessor
  if (data[1] != "none" && !checkError) {
    fs.mkdirSync(`${dirsrc}\\${data[1]}`);

    if (data[1] == "less") {
      let lessFile = cssFile.less;
      checkError = createFile(dirsrc, "main.less", "", "less", lessFile.main);

      fs.mkdirSync(`${dirsrc}\\less\\utilities`);

      checkError = createFile(
        dirsrc,
        "font.less",
        "utilities\\",
        "less",
        lessFile.font
      );

      checkError = createFile(
        dirsrc,
        "text.less",
        "utilities\\",
        "less",
        lessFile.text
      );

      fs.mkdirSync(`${dirsrc}\\less\\layout`);

      checkError = createFile(
        dirsrc,
        "flex.less",
        "layout\\",
        "less",
        lessFile.flex
      );

      checkError = createFile(
        dirsrc,
        "header.less",
        "layout\\",
        "less",
        lessFile.header
      );

      checkError = createFile(
        dirsrc,
        "section.less",
        "layout\\",
        "less",
        lessFile.section
      );

      checkError = createFile(
        dirsrc,
        "footer.less",
        "layout\\",
        "less",
        lessFile.footer
      );

      fs.mkdirSync(`${dirsrc}\\less\\components`);

      checkError = createFile(
        dirsrc,
        "button.less",
        "components\\",
        "less",
        ""
      );

      fs.mkdirSync(`${dirsrc}\\less\\base`);

      checkError = createFile(
        dirsrc,
        "reset.less",
        "base\\",
        "less",
        lessFile.reset
      );

      checkError = createFile(
        dirsrc,
        "typography.less",
        "base\\",
        "less",
        lessFile.typography
      );
    } else if (data[1] == "sass") {
      let sassFile = cssFile.sass;

      checkError = createFile(dirsrc, "main.sass", "", "sass", sassFile.main);

      fs.mkdirSync(`${dirsrc}\\sass\\utilities`);

      checkError = createFile(
        dirsrc,
        "_font.sass",
        "utilities\\",
        "sass",
        sassFile.font
      );

      checkError = createFile(
        dirsrc,
        "_text.sass",
        "utilities\\",
        "sass",
        sassFile.text
      );

      fs.mkdirSync(`${dirsrc}\\sass\\layout`);

      checkError = createFile(
        dirsrc,
        "_flex.sass",
        "layout\\",
        "sass",
        sassFile.flex
      );

      checkError = createFile(
        dirsrc,
        "_header.sass",
        "layout\\",
        "sass",
        sassFile.header
      );

      checkError = createFile(
        dirsrc,
        "_section.sass",
        "layout\\",
        "sass",
        sassFile.section
      );

      checkError = createFile(
        dirsrc,
        "_footer.sass",
        "layout\\",
        "sass",
        sassFile.footer
      );

      fs.mkdirSync(`${dirsrc}\\sass\\helpers`);

      checkError = createFile(
        dirsrc,
        "_variables.sass",
        "helpers\\",
        "sass",
        sassFile.variables
      );

      checkError = createFile(
        dirsrc,
        "_mixins.sass",
        "helpers\\",
        "sass",
        sassFile.mixins
      );

      checkError = createFile(
        dirsrc,
        "_functions.sass",
        "helpers\\",
        "sass",
        sassFile.functions
      );

      checkError = createFile(
        dirsrc,
        "_helpers.sass",
        "helpers\\",
        "sass",
        sassFile.helpers
      );

      fs.mkdirSync(`${dirsrc}\\sass\\components`);

      checkError = createFile(
        dirsrc,
        "_button.sass",
        "components\\",
        "sass",
        sassFile.button
      );

      fs.mkdirSync(`${dirsrc}\\sass\\base`);

      checkError = createFile(
        dirsrc,
        "_reset.sass",
        "base\\",
        "sass",
        sassFile.reset
      );

      checkError = createFile(
        dirsrc,
        "_typography.sass",
        "base\\",
        "sass",
        sassFile.typography
      );
    } else if (data[1] == "scss") {
      let scssFile = cssFile.scss;

      checkError = createFile(dirsrc, "main.scss", "", "scss", scssFile.main);

      fs.mkdirSync(`${dirsrc}\\scss\\utilities`);

      checkError = createFile(
        dirsrc,
        "_font.scss",
        "utilities\\",
        "scss",
        scssFile.font
      );

      checkError = createFile(
        dirsrc,
        "_text.scss",
        "utilities\\",
        "scss",
        scssFile.text
      );

      fs.mkdirSync(`${dirsrc}\\scss\\layout`);

      checkError = createFile(
        dirsrc,
        "_flex.scss",
        "layout\\",
        "scss",
        scssFile.flex
      );

      checkError = createFile(
        dirsrc,
        "_header.scss",
        "layout\\",
        "scss",
        scssFile.header
      );

      checkError = createFile(
        dirsrc,
        "_section.scss",
        "layout\\",
        "scss",
        scssFile.section
      );

      checkError = createFile(
        dirsrc,
        "_footer.scss",
        "layout\\",
        "scss",
        scssFile.footer
      );

      fs.mkdirSync(`${dirsrc}\\scss\\helpers`);

      checkError = createFile(
        dirsrc,
        "_variables.scss",
        "helpers\\",
        "scss",
        scssFile.variables
      );

      if (!checkError)
        checkError = createFile(
          dirsrc,
          "_mixins.scss",
          "helpers\\",
          "scss",
          scssFile.mixins
        );

      checkError = createFile(
        dirsrc,
        "_functions.scss",
        "helpers\\",
        "scss",
        scssFile.functions
      );

      checkError = createFile(
        dirsrc,
        "_helpers.scss",
        "helpers\\",
        "scss",
        scssFile.helpers
      );

      fs.mkdirSync(`${dirsrc}\\scss\\components`);

      checkError = createFile(
        dirsrc,
        "_button.scss",
        "components\\",
        "scss",
        scssFile.button
      );

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "base");

      checkError = createFile(
        dirsrc,
        "_reset.scss",
        "base\\",
        "scss",
        scssFile.reset
      );

      checkError = createFile(
        dirsrc,
        "_typography.scss",
        "base\\",
        "scss",
        scssFile.typography
      );
    } else {
      let stylusFile = cssFile.stylus;

      checkError = createFile(
        dirsrc,
        "main.styl",
        "",
        "stylus",
        stylusFile.main
      );

      fs.mkdirSync(`${dirsrc}\\stylus\\utilities`);

      checkError = createFile(
        dirsrc,
        "_font.styl",
        "utilities\\",
        "stylus",
        stylusFile.font
      );

      checkError = createFile(
        dirsrc,
        "_text.styl",
        "utilities\\",
        "stylus",
        stylusFile.text
      );

      fs.mkdirSync(`${dirsrc}\\stylus\\layout`);

      checkError = createFile(
        dirsrc,
        "_flex.styl",
        "layout\\",
        "stylus",
        stylusFile.flex
      );

      checkError = createFile(
        dirsrc,
        "_header.styl",
        "layout\\",
        "stylus",
        stylusFile.header
      );

      checkError = createFile(
        dirsrc,
        "_section.styl",
        "layout\\",
        "stylus",
        stylusFile.section
      );

      checkError = createFile(
        dirsrc,
        "_footer.styl",
        "layout\\",
        "stylus",
        stylusFile.footer
      );

      fs.mkdirSync(`${dirsrc}\\stylus\\helpers`);

      checkError = createFile(
        dirsrc,
        "_variables.styl",
        "helpers\\",
        "stylus",
        stylusFile.variables
      );

      checkError = createFile(
        dirsrc,
        "_mixins.styl",
        "helpers\\",
        "stylus",
        stylusFile.mixins
      );

      checkError = createFile(
        dirsrc,
        "_functions.styl",
        "helpers\\",
        "stylus",
        stylusFile.functions
      );

      checkError = createFile(
        dirsrc,
        "_helpers.styl",
        "helpers\\",
        "stylus",
        stylusFile.helpers
      );

      fs.mkdirSync(`${dirsrc}\\stylus\\components`);

      checkError = createFile(
        dirsrc,
        "_button.styl",
        "components\\",
        "stylus",
        stylusFile.button
      );

      fs.mkdirSync(`${dirsrc}\\stylus\\base`);

      checkError = createFile(
        dirsrc,
        "_reset.styl",
        "base\\",
        "stylus",
        stylusFile.reset
      );

      checkError = createFile(
        dirsrc,
        "_typography.styl",
        "base\\",
        "stylus",
        stylusFile.typography
      );
    }
  }

  // Check if user contain js preprocessor
  if (data[2] != "none" && !checkError) {
    // Check if user use typescript
    if (data[2] == "typescript") {
      // Create ts folder instead of typescript
      let tsFile = jsFile.typescript;
      fs.mkdirSync(`${dirsrc}\\ts`);

      checkError = createFile(dirsrc, "index.ts", "", "ts", tsFile.index);
    } else {
      let coffeeFile = jsFile.coffeescript;
      // Create coffee folder instead of coffeescript
      fs.mkdirSync(`${dirsrc}\\coffeescript`);

      checkError = createFile(
        dirsrc,
        "index.coffee",
        "",
        "coffeescript",
        coffeeFile.index
      );
    }
  }

  // TODO: Create font folder for store font in future
  if (!checkError) {
    if (remove) {
      fs.mkdirSync(`${dirsrc}\\font`);
    } else {
      ncp(`${__dirname}\\font`, `${dirsrc}\\font`, function(err) {
        if (err) {
          return console.error(err);
        }
      });
    }
  }

  // TODO: Create img folder for store img in future
  if (!checkError) {
    if (remove) {
      fs.mkdirSync(`${dirsrc}\\img`);
    } else {
      ncp(`${__dirname}\\img`, `${dirsrc}\\img`, function(err) {
        if (err) {
          return console.error(err);
        }
      });
    }
  }

  // TODO: Create lib folder for store lib in future
  if (!checkError) {
    if (remove) {
      fs.mkdirSync(`${dirsrc}\\lib`);
    } else {
      ncp(`${__dirname}\\lib`, `${dirsrc}\\lib`, function(err) {
        if (err) {
          return console.error(err);
        }
      });
    }
  }

  setTimeout(function() {
    if (!checkError) {
      if (showTree) {
        console.log();
        console.log();
        dirTree(dir);
      }
      console.log();
      console.log();
      let dirArr = dir.split("\\");
      let folderName = dirArr[dirArr.length - 1];
      console.log(
        chalk.blue.bold("Run those command line to see sample website")
      );
      console.log();
      console.log(
        chalk.green.bold(
          `Let go to directory:                 cd ${folderName}`
        )
      );
      console.log(
        chalk.yellow("Show folder and file (optional):     genproject -t")
      );
      console.log(
        chalk.green.bold("Install package for gulp:            npm i")
      );
      console.log(
        chalk.green.bold("Run browsersync in gulp:             gulp watch")
      );
      console.log();
      console.log();
    } else {
      showError("Fail to create folder ", true);
    }
  }, 3000);
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
  console.log("  -h, --help               print this help");
  console.log("  -v, --version            print version");
  console.log("  -t, --tree               print directory tree");
  console.log("  init <folder_name>       create new folder with sample");
  console.log("  init <folder_name> -r    create new folder without sample");
  console.log();
}
