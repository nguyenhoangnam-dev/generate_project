#!/usr/bin/env node

"use strict";

const path = require("path");
const ncp = require("ncp").ncp;

var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help"],
  string: ["name"]
});

if (args.help) {
  help();
} else if (args.name) {
  ncp.limit = 16;

  ncp("F:\\2020\\gulp_scss", process.cwd() + "\\" + args.name, function error(
    err
  ) {
    if (err) {
      return console.error(err);
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
