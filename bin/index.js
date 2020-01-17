#!/usr/bin/env node

"use strict";

// Join path of process.cwd() and fie
const path = require("path");

// Create file, delete file, create folder, write to file
const fs = require("fs");

// Get input from terminal
const prompt = require("syncprompt");

// This color text
const chalk = require("chalk");

// This show emoji
const emoji = require("node-emoji");

// This turn object to tree
const treeify = require("treeify");

// Store all kind of preprocessor able to use
const htmlOption = [chalk.underline("none"), "haml", "pug", "slim"];
const cssOption = [chalk.underline("none"), "sass", "scss", "stylus", "less"];
const jsOption = [chalk.underline("none"), "typescript", "coffeescript"];

const htmlPreprocessor = ["none", "haml", "pug", "slim"];
const cssPreprocessor = ["none", "sass", "scss", "stylus", "less"];
const jsPreprocessor = ["none", "typescript", "coffeescript"];

// Store all config of argument of cli-app
var args = require("minimist")(process.argv.slice(2), {
  // Use --
  boolean: ["help", "version", "tree"],
  // Use -
  alias: { h: "help", v: "version", t: "tree" }
});

var dir = process.cwd();

// Check user argument
if (args.help) {
  // Show help screen
  help();
} else if (args.version) {
  // Show version of app
  console.log("v.1.1.0");
} else if (args._[0] == "init") {
  /**
   * Check other argument not using --, -
   * Check init is first argument
   */

  // Check if dirname is existed
  let overwrite = false;

  // Get current project directory

  // Check second argument
  if (args._[1]) {
    // Check if dirname is existed
    if (!fs.existsSync(dir + "\\" + args._[1])) {
      // Change dir to new directory
      dir = dir + "\\" + args._[1];
    } else {
      // This directory is existed
      overwrite = true;
      console.error(
        chalk.yellow(emoji.get("no_entry"), "This file name is exist !")
      );
    }

    // Check if dirname is existed
    if (!overwrite) {
      // Create new project folder
      fs.mkdirSync(dir);
    }
  }

  // Check if dirname is existed
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
                    showError("Something wrong when read you option", true);
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
        showError("Something wrong when read you option", true);
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

/**
 * Create src folder
 * @param {array} data Save all data type to create folder source
 * @param {string} dir Store directory of source
 */
function makeSrc(data, dir) {
  let objTree = {};
  let checkError = false;

  // Store directory of src folder
  let dirsrc = path.join(dir, "src");
  let current = process.cwd();

  // Create source folder
  fs.mkdirSync(dirsrc);
  objTree["src"] = {};

  // TODO: Create .gitignore file to ignore git add node_modules in future
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
    if (!fs.existsSync(process.cwd() + "\\" + "package.json")) {
      let license;
      if (data[3] == "MIT") {
        license = "MIT";
      } else {
        license = "ISC";
      }
      let projectNameObj = process.cwd().split("\\");
      let projectName = projectNameObj[projectNameObj.length - 1];
      let samplePacakage = `{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": ""
  "license": "${license}",
  "devDependencies": {
    "@babel/core": "^7.8.3",
    "@babel/preset-env": "^7.8.3",
    "browser-sync": "^2.26.7",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-imagemin": "^7.0.0",
  }
}`;

      fs.writeFile(dir + "\\" + "package.json", samplePacakage, function(err) {
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

  // TODO: Create gulpfile.js file to show in github in future
  if (!checkError) {
    let gulpData = `const gulp = require('gulp');
const { series, parallel, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const image = require('gulp-imagemin');
const htmlReplace = require('gulp-html-replace');
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
        htmlFunction = `function htmlPreprocessor() {
  return src('./src/pug/*.pug')
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(dest('./src'))
    .pipe(browserSync.stream());
}`;
        htmlWatch = `gulp.watch('./src/pug/*.pug', htmlPreprocessor);`;
        break;
      case "haml":
        htmlPackage = `const haml = require('gulp-haml');`;
        htmlFunction = `function htmlPreprocessor() {
  return src('./src/haml/*.haml')
    .pipe(
      haml()
    )
    .pipe(dest('./src'))
    .pipe(browserSync.stream());
}`;
        htmlWatch = `gulp.watch('./src/haml/*.haml', htmlPreprocessor);`;
        break;
      case "slim":
        break;
      default:
        break;
    }
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
    fs.writeFile(dirsrc + "\\" + "css" + "\\" + "main.css", "", function(err) {
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
    });
  }

  // Create js folder default
  if (!checkError) {
    fs.mkdirSync(dirsrc + "\\" + "js");
    objTree["src"]["js"] = {};
  }

  // Create index.js file in js folder default
  if (!checkError) {
    fs.writeFile(dirsrc + "\\" + "js" + "\\" + "index.js", "", function(err) {
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
    });
  }

  // Create index.html file default
  if (!checkError) {
    fs.writeFile(dirsrc + "\\" + "index.html", "", function(err) {
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
    fs.writeFile(
      dirsrc + "\\" + data[0] + "\\" + "index." + data[0],
      "",
      function(err) {
        if (err) {
          // Show error
          showError(err.toString(), true);
          checkError = true;
        }
        console.log(
          chalk.green(
            emoji.get("heavy_check_mark"),
            ` File index.${data[0]} is created successfully.`
          )
        );
        objTree["src"][data[0]][`index.${data[0]}`] = null;
      }
    );
  }

  // Check if user contain css preprocessor
  if (data[1] != "none" && !checkError) {
    // Create folder with data type
    fs.mkdirSync(dirsrc + "\\" + data[1]);
    objTree["src"][data[1]] = {};
    // Create file with data type at the end
    fs.writeFile(
      dirsrc + "\\" + data[1] + "\\" + "main." + data[1],
      "",
      function(err) {
        if (err) {
          // Show error
          showError(err.toString(), true);
          checkError = true;
        }
        console.log(
          chalk.green(
            emoji.get("heavy_check_mark"),
            ` File main.${data[1]} is created successfully.`
          )
        );
        objTree["src"][data[1]][`main.${data[1]}`] = null;
      }
    );
  }

  // Check if user contain js preprocessor
  if (data[2] != "none" && !checkError) {
    // Check if user use typescript
    if (data[2] == "typescript") {
      // Create ts folder instead of typescript
      fs.mkdirSync(dirsrc + "\\" + "ts");
      objTree["src"]["ts"] = {};
      // Create index.ts file in ts folder
      fs.writeFile(dirsrc + "\\" + "ts" + "\\" + `index.ts`, "", function(err) {
        if (err) {
          // Show error
          showError(err.toString(), true);
          checkError = true;
        }
        console.log(
          chalk.green(
            emoji.get("heavy_check_mark"),
            ` File main.ts is created successfully.`
          )
        );
        objTree["src"]["ts"]["main.ts"] = null;
      });
    } else {
      // Create coffee folder instead of coffeescript
      fs.mkdirSync(dirsrc + "\\" + data[2]);
      objTree["src"][data[2]] = {};
      // Create index.coffee file in coffeescript folder
      fs.writeFile(
        dirsrc + "\\" + data[2] + "\\" + `index.coffee`,
        "",
        function(err) {
          if (err) {
            // Show error
            showError(err.toString(), true);
          }
          console.log(
            chalk.green(
              emoji.get("heavy_check_mark"),
              ` File main.coffee is created successfully.`
            )
          );
          objTree["src"][data[2]]["main.coffee"] = null;
        }
      );
    }
  }

  // TODO: Create font folder for store font in future
  if (!checkError) {
    fs.mkdirSync(dirsrc + "\\" + "font");
    objTree["src"]["font"] = null;
  }

  // TODO: Create img folder for store img in future
  if (!checkError) {
    fs.mkdirSync(dirsrc + "\\" + "img");
    objTree["src"]["img"] = null;
  }

  // TODO: Create lib folder for store lib in future
  if (!checkError) {
    fs.mkdirSync(dirsrc + "\\" + "lib");
    objTree["src"]["lib"] = null;
  }

  if (!checkError) {
    objTree[".gitignore"] = null;
    objTree["gulpfile.js"] = null;
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
          console.log(chalk.green("Show folder and file:   gensetup -t"));
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
