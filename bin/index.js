#!/usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");
const ncp = require("ncp").ncp;
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const htmlPreprocessor = ["none", "haml", "pug", "slim"];
const cssPreprocessor = ["none", "sass", "scss", "postcss", "stylus", "less"];
const jsPreprocessor = ["none", "typescript", "coffeescript", "livescript"];

var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "version"],
  alias: { h: "help", v: "version" }
});

if (args.help) {
  help();
  rl.close();
} else if (args.version) {
  // ncp.limit = 16;

  // ncp("F:\\2020\\gulp_scss", process.cwd() + "\\" + args.name, function error(
  //   err
  // ) {
  //   if (err) {
  //     console.error(err.toString());
  //   }
  //   console.log("done!");
  // });
  console.log("v.1.0.0");
  rl.close();
  // console.log(__dirname + "\\" + args.name);
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
    rl.question(
      "HTML preprocessor ( " + htmlPreprocessor.join(" | ") + " ): ",
      function(html) {
        if (!htmlPreprocessor.includes(html)) {
          console.error("Invalid html preprocessor type file. ");
          rl.close();
        } else {
          rl.question(
            "CSS preprocessor ( " + cssPreprocessor.join(" | ") + " ): ",
            function(css) {
              if (!cssPreprocessor.includes(css)) {
                console.error("Invalid css preprocessor type file. ");
                rl.close();
              } else {
                rl.question(
                  "JS preprocessor ( " + jsPreprocessor.join(" | ") + " ): ",
                  function(js) {
                    if (!jsPreprocessor.includes(js)) {
                      console.error("Invalid js preprocessor type file. ");
                      rl.close();
                    } else {
                      let configText = `${html} \n` + `${css} \n` + `${js}`;
                      fs.writeFile(
                        dir + "\\" + "generateConfig.txt",
                        configText,
                        function(err) {
                          if (err) {
                            console.error(err.toString());
                          }
                          console.log("File is created successfully.");
                        }
                      );
                      rl.close();
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
    rl.close();
    var filePath = path.join(dir, "generateConfig.txt");
    fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
      if (!err) {
        console.log("received data: " + data);
      } else {
        console.log(err);
      }
    });
  }
} else {
  rl.close();
}

// *********************************************

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
