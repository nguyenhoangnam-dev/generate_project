#!/usr/bin/env node

"use strict";

// Join path of process.cwd() and fie
const path = require("path");
// Create file, delete file, create folder, write to file
const fs = require("fs");
// Get input from terminal
const prompt = require("syncprompt");

const chalk = require("chalk");

// const ora = require("ora");
const emoji = require("node-emoji");

const treeify = require("treeify");

// Store all kind of preprocessor able to use
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
  console.log("v.1.0.0");
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
    let html = prompt(
      "HTML preprocessor ( " + htmlPreprocessor.join(" | ") + " ): "
    );
    // Check if option is exist
    if (!htmlPreprocessor.includes(html)) {
      // Show error
      showError("Invalid html preprocessor type file.", true);
    } else {
      // Store css preprocessor option if html option existed
      var css = prompt(
        "CSS preprocessor ( " + cssPreprocessor.join(" | ") + " ): "
      );

      // Check if option is existed
      if (!cssPreprocessor.includes(css)) {
        // Show error
        showError("Invalid css preprocessor type file.", true);
      } else {
        // Store js preprocessor option if css option in existed
        var js = prompt(
          "JS preprocessor ( " + jsPreprocessor.join(" | ") + " ): "
        );

        // Check if option is existed
        if (!jsPreprocessor.includes(js)) {
          // show error
          // console.error(
          //   chalk.red(emoji.get("x"), " Invalid js preprocessor type file. ")

          // );
          showError("Invalid js preprocessor type file", true);
        } else {
          // Content of config file
          let configText = `${html} \n` + `${css} \n` + `${js}`;

          // Write to config file and create one
          fs.writeFile(dir + "\\" + "generateConfig.txt", configText, function(
            err
          ) {
            // Show error
            if (err) {
              // console.error(chalk.red(emoji.get("x"), err.toString()));
              showError(err.toString(), true);
            }
          });
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
        // Show error
        showError(err.toString(), true);
      }
    });
  }
} else if (args.tree) {
  // Show tree of file
  showTree();
} else {
  showError("Can not find this command ", true);
  // showError(chalk.red(emoji.get("x") + "Can not find this command "), true);
}

// *********************************************

/**
 * Show error and help if we need
 * @param {string} mess This is error message we want to show
 * @param {boolean} showHelp This check if we need to show help
 */
function showError(mess, showHelp = false) {
  // Show error
  console.error(chalk.red(emoji.get("x") + mess));
  if (showHelp) {
    // Show help screen
    help();
  }
}

/**
 * Show directory tree using gensetup
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
    fs.writeFile(dir + "\\" + "gulpfile.js", "", function(err) {
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
    fs.writeFile(dir + "\\" + "LICENSE", "", function(err) {
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
          console.log();
          console.log();
          let dirArr = dir.split("\\");
          let folderName = dirArr[dirArr.length - 1];
          console.log(chalk.green("Let go to directory:    cd " + folderName));
          console.log(chalk.green("Show folder and file:   gensetup -t"));
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
  console.log("  $ gensetup [options]");
  console.log();
  console.log("Options:");
  console.log("-h, --help            print this help");
  console.log("-v, --version         print version");
  console.log("-t, --tree            print directory tree");
  console.log("init [folder name]    create new folder");
  console.log();
}
