#!/usr/bin/env node

"use strict";

// Join path of process.cwd() and fie
const path = require("path");
// Create file, delete file, create folder, write to file
const fs = require("fs");
// Get input from terminal
const prompt = require("prompt-sync")();

// Store all kind of preprocessor able to use
const htmlPreprocessor = ["none", "haml", "pug", "slim"];
const cssPreprocessor = ["none", "sass", "scss", "stylus", "less"];
const jsPreprocessor = ["none", "typescript", "coffeescript"];

// Store all config of argument of cli-app
var args = require("minimist")(process.argv.slice(2), {
  // Use --
  boolean: ["help", "version"],
  // Use -
  alias: { h: "help", v: "version" }
});

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
  let dir = process.cwd();

  // Check second argument
  if (args._[1]) {
    // Check if dirname is existed
    if (!fs.existsSync(dir + "\\" + args._[1])) {
      // Change dir to new directory
      dir = dir + "\\" + args._[1];
    } else {
      // This directory is existed
      overwrite = true;
      console.error("This file name is exist !");
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
    var html = prompt(
      "HTML preprocessor ( " + htmlPreprocessor.join(" | ") + " ): "
    );

    // Check if option is exist
    if (!htmlPreprocessor.includes(html)) {
      // Show error
      console.error("Invalid html preprocessor type file. ");
    } else {
      // Store css preprocessor option if html option existed
      var css = prompt(
        "CSS preprocessor ( " + cssPreprocessor.join(" | ") + " ): "
      );

      // Check if option is existed
      if (!cssPreprocessor.includes(css)) {
        // Show error
        console.error("Invalid css preprocessor type file. ");
      } else {
        // Store js preprocessor option if css option in existed
        var js = prompt(
          "JS preprocessor ( " + jsPreprocessor.join(" | ") + " ): "
        );

        // Check if option is existed
        if (!jsPreprocessor.includes(js)) {
          // show error
          console.error("Invalid js preprocessor type file. ");
        } else {
          // Content of config file
          let configText = `${html} \n` + `${css} \n` + `${js}`;

          // Write to config file and create one
          fs.writeFile(dir + "\\" + "generateConfig.txt", configText, function(
            err
          ) {
            // Show error
            if (err) {
              console.error(err.toString());
            }
            console.log("File is created successfully.");
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
        console.log(err);
      }
    });
  }
} else {
}

// *********************************************

/**
 * Create src folder
 * @param {array} data Save all data type to create folder source
 * @param {string} dir Store directory of source
 */
function makeSrc(data, dir) {
  // Store directory of src folder
  let dirsrc = path.join(dir, "src");

  // Create source folder
  fs.mkdirSync(dirsrc);

  // Default folder and file
  // Create css folder default
  fs.mkdirSync(dirsrc + "\\" + "css");
  // Create main.css file in css folder default
  fs.writeFile(dirsrc + "\\" + "css" + "\\" + "main.css", "", function(err) {
    // Show error
    if (err) {
      console.error(err.toString());
    }
    console.log("File main.css is created successfully.");
  });

  // Create js folder default
  fs.mkdirSync(dirsrc + "\\" + "js");
  // Create index.js file in js folder default
  fs.writeFile(dirsrc + "\\" + "js" + "\\" + "index.js", "", function(err) {
    // Show error
    if (err) {
      console.error(err.toString());
    }
    console.log("File index.js is created successfully.");
  });

  // Create index.html file default
  fs.writeFile(dirsrc + "\\" + "index.html", "", function(err) {
    if (err) {
      console.error(err.toString());
    }
    console.log("File index.html is created successfully.");
  });

  // Check if user contain html preprocessor
  if (data[0] != "none") {
    // Create folder with data type
    fs.mkdirSync(dirsrc + "\\" + data[0]);
    // Create file with data type at the end
    fs.writeFile(
      dirsrc + "\\" + data[0] + "\\" + "index." + data[0],
      "",
      function(err) {
        if (err) {
          // Show error
          console.error(err.toString());
        }
        console.log(`File index.${data[0]} is created successfully.`);
      }
    );
  }

  // Check if user contain css preprocessor
  if (data[1] != "none") {
    // Create folder with data type
    fs.mkdirSync(dirsrc + "\\" + data[1]);
    // Create file with data type at the end
    fs.writeFile(
      dirsrc + "\\" + data[1] + "\\" + "main." + data[1],
      "",
      function(err) {
        if (err) {
          // Show error
          console.error(err.toString());
        }
        console.log(`File main.${data[1]} is created successfully.`);
      }
    );
  }

  // Check if user contain js preprocessor
  if (data[2] != "none") {
    // Check if user use typescript
    if (data[2] == "typescript") {
      // Create ts folder instead of typescript
      fs.mkdirSync(dirsrc + "\\" + "ts");
      // Create index.ts file in ts folder
      fs.writeFile(dirsrc + "\\" + "ts" + "\\" + `index.ts`, "", function(err) {
        if (err) {
          // Show error
          console.error(err.toString());
        }
        console.log(`File main.ts is created successfully.`);
      });
    } else {
      // Create coffee folder instead of coffeescript
      fs.mkdirSync(dirsrc + "\\" + data[2]);
      // Create index.coffee file in coffeescript folder
      fs.writeFile(
        dirsrc + "\\" + data[2] + "\\" + `index.coffee`,
        "",
        function(err) {
          if (err) {
            // Show error
            console.error(err.toString());
          }
          console.log(`File main.coffee is created successfully.`);
        }
      );
    }
  }

  // TODO: Create font folder for store font in future
  fs.mkdirSync(dirsrc + "\\" + "font");
  // TODO: Create img folder for store img in future
  fs.mkdirSync(dirsrc + "\\" + "img");
  // TODO: Create lib folder for store lib in future
  fs.mkdirSync(dirsrc + "\\" + "lib");

  // TODO: Create .gitignore file to ignore git add node_modules in future
  fs.writeFile(dir + "\\" + ".gitignore", "node_modules", function(err) {
    if (err) {
      // Show error
      console.error(err.toString());
    }
    console.log("File .gitignore is created successfully.");
  });

  // TODO: Create README.md file to show in github in future
  fs.writeFile(dir + "\\" + "README.md", "", function(err) {
    if (err) {
      // Show error if can not create file
      console.error(err.toString());
    }
    console.log("File README.md is created successfully.");
  });

  // TODO: Create LICENSE file to show license of open source project in github in future
  fs.writeFile(dir + "\\" + "LICENSE", "", function(err) {
    if (err) {
      console.error(err.toString());
    }
    console.log("File LICENSE is created successfully.");
  });

  // Delete config file after create success folder
  fs.unlinkSync(dir + "\\" + "generateConfig.txt");
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
  console.log("init [folder name]    create new folder");
  console.log();
}
