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

// New feature
const prompts = require("prompts");

//

let htmlFile = require("./html.js"); // Data of all html preprocessor code
let cssFile = require("./css.js"); // Data of all css preprocessor code
let jsFile = require("./javascript.js"); // Data of all js preprocessor code
let licenseFile = require("./license.js");
let taskFile = require("./task.js");
let packageFile = require("./package.js");

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
  boolean: ["help", "version", "tree", "remove"],
  // Use -
  alias: { h: "help", v: "version", t: "tree", r: "remove" }
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
    if (!fs.existsSync(`{dir}\\{args._[1]}`)) {
      dir = `${dir}\\${args._[1]}`; // Change dir to new directory
    } else {
      overwrite = true;
      console.error(
        chalk.yellow(emoji.get("no_entry"), "This file name is exist !")
      );
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

        if (args.remove) makeSrc(dataOption, dir, true);
        else makeSrc(dataOption, dir);
      })();
    } else {
      let html = prompt(
        "HTML preprocessor ( " + htmlOption.join(" | ") + " ): "
      );
      if (html == "") html = "none";

      if (!htmlPreprocessor.includes(html))
        showError("Invalid html preprocessor type file.", true);
      else {
        var css = prompt(
          "CSS preprocessor ( " + cssOption.join(" | ") + " ): "
        );
        if (css == "") css = "none";

        if (!cssPreprocessor.includes(css))
          showError("Invalid css preprocessor type file.", true);
        else {
          var js = prompt("JS preprocessor ( " + jsOption.join(" | ") + " ): ");
          if (js == "") js = "none";

          if (!jsPreprocessor.includes(js))
            showError("Invalid js preprocessor type file", true);
          else {
            var license;
            if (fs.existsSync(`${process.cwd()}\\package.json`)) {
              let configData = fs.readFileSync(
                `${process.cwd()}\\package.json`
              );
              let obj = JSON.parse(configData);
              license = obj["license"];
              if (license != "MIT" && license != "ISC")
                showError("Invalid license", true);
              else {
                let configText;
                if (license == "ISC") {
                  var name = obj["author"];
                  configText = `${html} \n${css} \n${js} \n${license}|${name}`;
                } else configText = `${html} \n${css} \n${js} \n${license}`;

                fs.writeFile(`${dir}\\generateConfig.txt`, configText, function(
                  err
                ) {
                  if (err)
                    showError("Something wrong when read you option", true);
                });
              }
            } else {
              license = prompt(
                "License ( " +
                  chalk.underline(" MIT ") +
                  "|" +
                  " ISC " +
                  "|" +
                  " none " +
                  " ): "
              );
              if (license == "") license = "MIT";
              // Check if option is existed
              if (
                license.toUpperCase() != "MIT" &&
                license.toUpperCase() != "none" &&
                license.toUpperCase() != "ISC"
              )
                showError("Invalid license", true);
              else {
                let configText;
                if (license.toUpperCase() == "ISC") {
                  var name = prompt("Author: ");
                  configText =
                    `${html} \n` +
                    `${css} \n` +
                    `${js} \n` +
                    `${license.toUpperCase()}|${name}`;
                } else configText = `${html} \n${css} \n${js} \n${license}`;

                // Write to config file and create one
                fs.writeFile(
                  dir + "\\" + "generateConfig.txt",
                  configText,
                  function(err) {
                    if (err)
                      showError("Something wrong when read options", true);
                  }
                );
              }
            }
          }
        }
      }
      // Join config file and dir in path
      var filePath = path.join(dir, "generateConfig.txt");

      var dataOption = [];

      fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
        // Show error
        if (!err) {
          dataOption = data.split("\n").map(x => x.trim()); // Split and trim data from file

          if (args.remove) makeSrc(dataOption, dir, true, true);
          else makeSrc(dataOption, dir, false, true);
        } else showError("Something wrong when read options", true);
      });
    }
  }
} else if (args.tree) {
  showTree();
} else showError("Can not find this command ", true);

// *********************************************

/**
 * Show error and help if we need
 * @param {string} mess This is error message we want to show
 * @param {boolean} showHelp This check if we need to show help
 */
function showError(mess, showHelp = false) {
  console.error(chalk.red(emoji.get("x") + mess));
  if (showHelp) help();
}

/**
 * Show directory tree using genproject
 */
function showTree() {
  let dir1 = process.cwd();
  if (fs.existsSync(`${dir}\\genproject.json`)) {
    let configData = fs.readFileSync(`${dir}\\genproject.json`);
    let obj = JSON.parse(configData);
    console.log(treeify.asTree(obj, true, false));
  } else showError("It missed gensetup.json", true);
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
    }
  );
  return false;
}

/**
 * Create src folder
 * @param {array} data Save all data type to create folder source
 * @param {string} dir Store directory of source
 */
function makeSrc(data, dir, remove = false, exFile = false) {
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
    fs.writeFile(`${dir}\\.gitignore`, "node_modules", function(err) {
      if (err) {
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
    fs.writeFile(`${dir}\\README.md`, "", function(err) {
      if (err) {
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
    fs.mkdirSync(`${dirsrc}\\css`);
    objTree["src"]["css"] = {};
  }

  // Create main.css file in css folder default
  if (!checkError) {
    checkError = createFile(dirsrc, "main.css", "", "css", cssFile.none.main);

    if (!checkError) {
      objTree["src"]["css"]["main.css"] = null;
    }
  }

  // Create js folder default
  if (!checkError) {
    fs.mkdirSync(`${dirsrc}\\js`);
    objTree["src"]["js"] = {};
  }

  // Create index.js file in js folder default
  if (!checkError) {
    checkError = createFile(dirsrc, "index.js", "", "js", jsFile.none.index);

    if (!checkError) {
      objTree["src"]["js"]["index.js"] = null;
    }
  }

  // Create index.html file default
  if (!checkError) {
    fs.writeFile(`${dirsrc}\\index.html`, htmlFile.none.index, function(err) {
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
    fs.mkdirSync(`${dirsrc}\\${data[0]}`); // Create folder with data type
    objTree["src"][data[0]] = {};

    if (data[0] == "pug") {
      let pugFile = htmlFile.pug;

      checkError = createFile(dirsrc, "index.pug", "", "pug", pugFile.index);

      if (!checkError) objTree["src"]["pug"]["index.pug"] = null;
    } else if (data[0] == "haml") {
      let hamlFile = htmlFile.haml;

      checkError = createFile(dirsrc, "index.haml", "", "haml", hamlFile.index);

      if (!checkError) objTree["src"]["haml"]["index.haml"] = null;
    } else {
      let slimFile = htmlFile.slim;
      checkError = createFile(dirsrc, "index.slim", "", "slim", slimFile.index);

      if (!checkError) objTree["src"]["slim"]["index.slim"] = null;
    }
  }

  // Check if user contain css preprocessor
  if (data[1] != "none" && !checkError) {
    fs.mkdirSync(`${dirsrc}\\${data[1]}`); // Create folder with data type
    objTree["src"][data[1]] = {};

    if (data[1] == "less") {
      let lessFile = cssFile.less;
      checkError = createFile(dirsrc, "main.less", "", "less", lessFile.main);

      if (!checkError) objTree["src"]["less"]["main.less"] = null;

      fs.mkdirSync(`${dirsrc}\\less\\utilities`);
      objTree["src"]["less"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "font.less",
        "utilities\\",
        "less",
        lessFile.font
      );

      if (!checkError) objTree["src"]["less"]["utilities"]["font.less"] = null;

      checkError = createFile(
        dirsrc,
        "text.less",
        "utilities\\",
        "less",
        lessFile.text
      );

      if (!checkError) objTree["src"]["less"]["utilities"]["text.less"] = null;

      fs.mkdirSync(`${dirsrc}\\less\\layout`);
      objTree["src"]["less"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "flex.less",
        "layout\\",
        "less",
        lessFile.flex
      );

      if (!checkError) objTree["src"]["less"]["layout"]["flex.less"] = null;

      checkError = createFile(
        dirsrc,
        "header.less",
        "layout\\",
        "less",
        lessFile.header
      );

      if (!checkError) objTree["src"]["less"]["layout"]["header.less"] = null;

      checkError = createFile(
        dirsrc,
        "section.less",
        "layout\\",
        "less",
        lessFile.section
      );

      if (!checkError) objTree["src"]["less"]["layout"]["section.less"] = null;

      checkError = createFile(
        dirsrc,
        "footer.less",
        "layout\\",
        "less",
        lessFile.footer
      );

      if (!checkError) objTree["src"]["less"]["layout"]["footer.less"] = null;

      fs.mkdirSync(`${dirsrc}\\less\\components`);
      objTree["src"]["less"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "button.less",
        "components\\",
        "less",
        ""
      );

      if (!checkError)
        objTree["src"]["less"]["components"]["button.less"] = null;

      fs.mkdirSync(`${dirsrc}\\less\\base`);
      objTree["src"]["less"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "reset.less",
        "base\\",
        "less",
        lessFile.reset
      );

      if (!checkError) objTree["src"]["less"]["base"]["reset.less"] = null;

      checkError = createFile(
        dirsrc,
        "typography.less",
        "base\\",
        "less",
        lessFile.typography
      );

      if (!checkError) objTree["src"]["less"]["base"]["typography.less"] = null;
    } else if (data[1] == "sass") {
      let sassFile = cssFile.sass;

      checkError = createFile(dirsrc, "main.sass", "", "sass", sassFile.main);

      if (!checkError) objTree["src"]["sass"]["main.sass"] = null;

      fs.mkdirSync(`${dirsrc}\\sass\\utilities`);
      objTree["src"]["sass"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "_font.sass",
        "utilities\\",
        "sass",
        sassFile.font
      );

      if (!checkError) objTree["src"]["sass"]["utilities"]["_font.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_text.sass",
        "utilities\\",
        "sass",
        sassFile.text
      );

      if (!checkError) objTree["src"]["sass"]["utilities"]["_text.sass"] = null;

      fs.mkdirSync(`${dirsrc}\\sass\\layout`);
      objTree["src"]["sass"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "_flex.sass",
        "layout\\",
        "sass",
        sassFile.flex
      );

      if (!checkError) objTree["src"]["sass"]["layout"]["_flex.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_header.sass",
        "layout\\",
        "sass",
        sassFile.header
      );

      if (!checkError) objTree["src"]["sass"]["layout"]["_header.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_section.sass",
        "layout\\",
        "sass",
        sassFile.section
      );

      if (!checkError) objTree["src"]["sass"]["layout"]["_section.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_footer.sass",
        "layout\\",
        "sass",
        sassFile.footer
      );

      if (!checkError) objTree["src"]["sass"]["layout"]["_footer.sass"] = null;

      fs.mkdirSync(`${dirsrc}\\sass\\helpers`);
      objTree["src"]["sass"]["helpers"] = {};

      checkError = createFile(
        dirsrc,
        "_variables.sass",
        "helpers\\",
        "sass",
        sassFile.variables
      );

      if (!checkError)
        objTree["src"]["sass"]["helpers"]["_variables.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_mixins.sass",
        "helpers\\",
        "sass",
        sassFile.mixins
      );

      if (!checkError) objTree["src"]["sass"]["helpers"]["_mixins.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_functions.sass",
        "helpers\\",
        "sass",
        sassFile.functions
      );

      if (!checkError)
        objTree["src"]["sass"]["helpers"]["_functions.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_helpers.sass",
        "helpers\\",
        "sass",
        sassFile.helpers
      );

      if (!checkError)
        objTree["src"]["sass"]["helpers"]["_helpers.sass"] = null;

      fs.mkdirSync(`${dirsrc}\\sass\\components`);
      objTree["src"]["sass"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "_button.sass",
        "components\\",
        "sass",
        sassFile.button
      );

      if (!checkError)
        objTree["src"]["sass"]["components"]["_button.sass"] = null;

      fs.mkdirSync(`${dirsrc}\\sass\\base`);
      objTree["src"]["sass"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "_reset.sass",
        "base\\",
        "sass",
        sassFile.reset
      );

      if (!checkError) objTree["src"]["sass"]["base"]["_reset.sass"] = null;

      checkError = createFile(
        dirsrc,
        "_typography.sass",
        "base\\",
        "sass",
        sassFile.typography
      );

      if (!checkError)
        objTree["src"]["sass"]["base"]["_typography.sass"] = null;
    } else if (data[1] == "scss") {
      let scssFile = cssFile.scss;

      checkError = createFile(dirsrc, "main.scss", "", "scss", scssFile.main);

      if (!checkError) objTree["src"]["scss"]["main.scss"] = null;

      fs.mkdirSync(`${dirsrc}\\scss\\utilities`);
      objTree["src"]["scss"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "_font.scss",
        "utilities\\",
        "scss",
        scssFile.font
      );

      if (!checkError) objTree["src"]["scss"]["utilities"]["_font.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_text.scss",
        "utilities\\",
        "scss",
        scssFile.text
      );

      if (!checkError) objTree["src"]["scss"]["utilities"]["_text.scss"] = null;

      fs.mkdirSync(`${dirsrc}\\scss\\layout`);
      objTree["src"]["scss"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "_flex.scss",
        "layout\\",
        "scss",
        scssFile.flex
      );

      if (!checkError) objTree["src"]["scss"]["layout"]["_flex.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_header.scss",
        "layout\\",
        "scss",
        scssFile.header
      );

      if (!checkError) objTree["src"]["scss"]["layout"]["_header.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_section.scss",
        "layout\\",
        "scss",
        scssFile.section
      );

      if (!checkError) objTree["src"]["scss"]["layout"]["_section.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_footer.scss",
        "layout\\",
        "scss",
        scssFile.footer
      );

      if (!checkError) objTree["src"]["scss"]["layout"]["_footer.scss"] = null;

      fs.mkdirSync(`${dirsrc}\\scss\\helpers`);
      objTree["src"]["scss"]["helpers"] = {};

      checkError = createFile(
        dirsrc,
        "_variables.scss",
        "helpers\\",
        "scss",
        scssFile.variables
      );

      if (!checkError)
        objTree["src"]["scss"]["helpers"]["_variables.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_mixins.scss",
        "helpers\\",
        "scss",
        scssFile.mixins
      );

      if (!checkError) objTree["src"]["scss"]["helpers"]["_mixins.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_functions.scss",
        "helpers\\",
        "scss",
        scssFile.functions
      );

      if (!checkError)
        objTree["src"]["scss"]["helpers"]["_functions.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_helpers.scss",
        "helpers\\",
        "scss",
        scssFile.helpers
      );

      if (!checkError)
        objTree["src"]["scss"]["helpers"]["_helpers.scss"] = null;

      fs.mkdirSync(`${dirsrc}\\scss\\components`);
      objTree["src"]["scss"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "_button.scss",
        "components\\",
        "scss",
        scssFile.button
      );

      if (!checkError)
        objTree["src"]["scss"]["components"]["_button.scss"] = null;

      fs.mkdirSync(dirsrc + "\\" + "scss" + "\\" + "base");
      objTree["src"]["scss"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "_reset.scss",
        "base\\",
        "scss",
        scssFile.reset
      );

      if (!checkError) objTree["src"]["scss"]["base"]["_reset.scss"] = null;

      checkError = createFile(
        dirsrc,
        "_typography.scss",
        "base\\",
        "scss",
        scssFile.typography
      );

      if (!checkError)
        objTree["src"]["scss"]["base"]["_typography.scss"] = null;
    } else {
      let stylusFile = cssFile.stylus;

      checkError = createFile(
        dirsrc,
        "main.styl",
        "",
        "stylus",
        stylusFile.main
      );

      if (!checkError) objTree["src"]["stylus"]["main.styl"] = null;

      fs.mkdirSync(`${dirsrc}\\stylus\\utilities`);
      objTree["src"]["stylus"]["utilities"] = {};

      checkError = createFile(
        dirsrc,
        "_font.styl",
        "utilities\\",
        "stylus",
        stylusFile.font
      );

      if (!checkError)
        objTree["src"]["stylus"]["utilities"]["_font.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_text.styl",
        "utilities\\",
        "stylus",
        stylusFile.text
      );

      if (!checkError)
        objTree["src"]["stylus"]["utilities"]["_text.styl"] = null;

      fs.mkdirSync(`${dirsrc}\\stylus\\layout`);
      objTree["src"]["stylus"]["layout"] = {};

      checkError = createFile(
        dirsrc,
        "_flex.styl",
        "layout\\",
        "stylus",
        stylusFile.flex
      );

      if (!checkError) objTree["src"]["stylus"]["layout"]["_flex.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_header.styl",
        "layout\\",
        "stylus",
        stylusFile.header
      );

      if (!checkError)
        objTree["src"]["stylus"]["layout"]["_header.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_section.styl",
        "layout\\",
        "stylus",
        stylusFile.section
      );

      if (!checkError)
        objTree["src"]["stylus"]["layout"]["_section.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_footer.styl",
        "layout\\",
        "stylus",
        stylusFile.footer
      );

      if (!checkError)
        objTree["src"]["stylus"]["layout"]["_footer.styl"] = null;

      fs.mkdirSync(`${dirsrc}\\stylus\\helpers`);
      objTree["src"]["stylus"]["helpers"] = {};

      checkError = createFile(
        dirsrc,
        "_variables.styl",
        "helpers\\",
        "stylus",
        stylusFile.variables
      );

      if (!checkError)
        objTree["src"]["stylus"]["helpers"]["_variables.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_mixins.styl",
        "helpers\\",
        "stylus",
        stylusFile.mixins
      );

      if (!checkError)
        objTree["src"]["stylus"]["helpers"]["_mixins.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_functions.styl",
        "helpers\\",
        "stylus",
        stylusFile.functions
      );

      if (!checkError)
        objTree["src"]["stylus"]["helpers"]["_functions.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_helpers.styl",
        "helpers\\",
        "stylus",
        stylusFile.helpers
      );

      if (!checkError)
        objTree["src"]["stylus"]["helpers"]["_helpers.styl"] = null;

      fs.mkdirSync(`${dirsrc}\\stylus\\components`);
      objTree["src"]["stylus"]["components"] = {};

      checkError = createFile(
        dirsrc,
        "_button.styl",
        "components\\",
        "stylus",
        stylusFile.button
      );

      if (!checkError)
        objTree["src"]["stylus"]["components"]["_button.styl"] = null;

      fs.mkdirSync(`${dirsrc}\\stylus\\base`);
      objTree["src"]["stylus"]["base"] = {};

      checkError = createFile(
        dirsrc,
        "_reset.styl",
        "base\\",
        "stylus",
        stylusFile.reset
      );

      if (!checkError) objTree["src"]["stylus"]["base"]["_reset.styl"] = null;

      checkError = createFile(
        dirsrc,
        "_typography.styl",
        "base\\",
        "stylus",
        stylusFile.typography
      );

      if (!checkError)
        objTree["src"]["stylus"]["base"]["_typography.styl"] = null;
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

      if (!checkError) objTree["src"]["ts"]["index.ts"] = null;
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
      if (!checkError) objTree["src"]["coffeescript"]["index.coffee"] = null;
    }
  }

  // TODO: Create font folder for store font in future
  if (!checkError) {
    if (remove) {
      fs.mkdirSync(`${dirsrc}\\font`);
      objTree["src"]["font"] = {};
    } else {
      ncp(`${__dirname}\\font`, `${dirsrc}\\font`, function(err) {
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
  }

  // TODO: Create img folder for store img in future
  if (!checkError) {
    if (remove) {
      fs.mkdirSync(`${dirsrc}\\img`);
      objTree["src"]["img"] = null;
    } else {
      ncp(`${__dirname}\\img`, `${dirsrc}\\img`, function(err) {
        if (err) {
          return console.error(err);
        }
        objTree["src"]["img"] = {};
        objTree["src"]["img"]["header.svg"] = null;
        objTree["src"]["img"]["section.svg"] = null;
      });
    }
  }

  // TODO: Create lib folder for store lib in future
  if (!checkError) {
    if (remove) {
      fs.mkdirSync(`${dirsrc}\\lib`);
      objTree["src"]["lib"] = null;
    } else {
      ncp(`${__dirname}\\lib`, `${dirsrc}\\lib`, function(err) {
        if (err) {
          return console.error(err);
        }
        objTree["src"]["lib"] = {};
        objTree["src"]["lib"]["jquery.scrollify.js"] = null;
        objTree["src"]["lib"]["jquery-3.4.1.min.js"] = null;
      });
    }
  }

  if (!checkError) {
    objTree[".gitignore"] = null;
    objTree["gulpfile.js"] = null;
    objTree["package.json"] = null;
    objTree["README.md"] = null;
    objTree["LICENSE"] = null;
  }

  // Delete config file after create success folder
  if (exFile) fs.unlinkSync(`${dir}\\generateConfig.txt`);

  setTimeout(
    function(objTree) {
      var json = JSON.stringify(objTree);
      if (!checkError) {
        fs.writeFile(`${dir}\\genproject.json`, json, function(err) {
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
  console.log("  -h, --help               print this help");
  console.log("  -v, --version            print version");
  console.log("  -t, --tree               print directory tree");
  console.log("  init <folder_name>       create new folder with sample");
  console.log("  init <folder_name> -r    create new folder without sample");
  console.log();
}
