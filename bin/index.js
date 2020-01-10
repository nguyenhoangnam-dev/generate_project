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
  boolean: ["help"],
  string: ["name"]
});

if (args.help) {
  help();

  rl.question(
    "HTML preprocessor: ( " + htmlPreprocessor.join("| ") + ")",
    function(name) {
      rl.question("Where do you live ? ", function(country) {
        fs.writeFile("newfile.txt", "abc", function(err) {
          if (err) {
            console.error(err.toString());
          }
          console.log("File is created successfully.");
        });
        rl.close();
      });
    }
  );
} else if (args.name) {
  ncp.limit = 16;

  ncp("F:\\2020\\gulp_scss", process.cwd() + "\\" + args.name, function error(
    err
  ) {
    if (err) {
      console.error(err.toString());
    }
    console.log("done!");
  });

  // console.log(__dirname + "\\" + args.name);
}

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
