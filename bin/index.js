#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");
const ncp = require("ncp").ncp;
const prompt = require("prompt-sync")();

const htmlPreprocessor = ["none", "haml", "pug", "slim"];
const cssPreprocessor = ["none", "sass", "scss", "stylus", "less"];
const jsPreprocessor = ["none", "typescript", "coffeescript"];

var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "version"],
  alias: { h: "help", v: "version" }
});

if (args.help) {
  help();
} else if (args.version) {
  console.log("v.1.0.0");
} else if (args._[0] == "init") {
  let overwrite = false;
  let dir = process.cwd();
  if (args._[1]) {
    if (!fs.existsSync(dir + "\\" + args._[1])) {
      dir = dir + "\\" + args._[1];
    } else {
      overwrite = true;
      console.error("This file name is exist !");
    }
    if (!overwrite) {
      fs.mkdirSync(dir);
    }
  }

  if (!overwrite) {
    var html = prompt(
      "HTML preprocessor ( " + htmlPreprocessor.join(" | ") + " ): "
    );
    if (!htmlPreprocessor.includes(html)) {
      console.error("Invalid html preprocessor type file. ");
    } else {
      var css = prompt(
        "CSS preprocessor ( " + cssPreprocessor.join(" | ") + " ): "
      );
      if (!cssPreprocessor.includes(css)) {
        console.error("Invalid css preprocessor type file. ");
      } else {
        var js = prompt(
          "JS preprocessor ( " + jsPreprocessor.join(" | ") + " ): "
        );
        if (!jsPreprocessor.includes(js)) {
          console.error("Invalid js preprocessor type file. ");
        } else {
          let configText = `${html} \n` + `${css} \n` + `${js}`;
          fs.writeFile(dir + "\\" + "generateConfig.txt", configText, function(
            err
          ) {
            if (err) {
              console.error(err.toString());
            }
            console.log("File is created successfully.");
          });
        }
      }
    }
    var filePath = path.join(dir, "generateConfig.txt");
    var dataOption = [];
    fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
      if (!err) {
        dataOption = data.split("\n").map(x => x.trim());
        makeSrc(dataOption, dir);
      } else {
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
 */
function makeSrc(data, dir) {
  let dirsrc = path.join(dir, "src");
  fs.mkdirSync(dirsrc);

  fs.mkdirSync(dirsrc + "\\" + "css");
  fs.writeFile(dirsrc + "\\" + "css" + "\\" + "main.css", "", function(err) {
    if (err) {
      console.error(err.toString());
    }
    console.log("File main.css is created successfully.");
  });
  fs.mkdirSync(dirsrc + "\\" + "js");
  fs.writeFile(dirsrc + "\\" + "js" + "\\" + "index.js", "", function(err) {
    if (err) {
      console.error(err.toString());
    }
    console.log("File index.js is created successfully.");
  });
  fs.writeFile(dirsrc + "\\" + "index.html", "", function(err) {
    if (err) {
      console.error(err.toString());
    }
    console.log("File index.html is created successfully.");
  });

  if (data[0] != "none") {
    fs.mkdirSync(dirsrc + "\\" + data[0]);
    fs.writeFile(
      dirsrc + "\\" + data[0] + "\\" + "index." + data[0],
      "",
      function(err) {
        if (err) {
          console.error(err.toString());
        }
        console.log(`File index.${data[0]} is created successfully.`);
      }
    );
  }

  if (data[1] != "none") {
    fs.mkdirSync(dirsrc + "\\" + data[1]);
    fs.writeFile(
      dirsrc + "\\" + data[1] + "\\" + "main." + data[1],
      "",
      function(err) {
        if (err) {
          console.error(err.toString());
        }
        console.log(`File main.${data[1]} is created successfully.`);
      }
    );
  }

  if (data[2] != "none") {
    if (data[2] == "typescript") {
      fs.mkdirSync(dirsrc + "\\" + "ts");
      fs.writeFile(dirsrc + "\\" + "ts" + "\\" + `index.ts`, "", function(err) {
        if (err) {
          console.error(err.toString());
        }
        console.log(`File main.ts is created successfully.`);
      });
    } else {
      fs.mkdirSync(dirsrc + "\\" + data[2]);
      fs.writeFile(
        dirsrc + "\\" + data[2] + "\\" + `index.coffee`,
        "",
        function(err) {
          if (err) {
            console.error(err.toString());
          }
          console.log(`File main.coffee is created successfully.`);
        }
      );
    }
  }
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
