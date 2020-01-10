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
  console.log("ex1 usage:");
  console.log("  node1.js --help");
  console.log();
  console.log("--help                 print this help");
  console.log("--name={FOLDERNAME}    create new folder");
  console.log();
}
