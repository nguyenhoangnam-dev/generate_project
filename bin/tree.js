const tree = require("directory-tree");
const path = require("path");
const treeify = require("treeify");

let iteratorObj = function(obj) {
  let sample = [];
  if (obj.constructor != Array) {
    sample.push(obj.name);
  }

  for (let prop in obj) {
    let value = obj[prop];
    if (typeof value === "object") {
      sample.push(iteratorObj(value));
    }
  }
  return sample;
};

let arrToObj = function(arr, blackList) {
  let obj = {};
  if (arr.length == 0) {
    return null;
  } else if (arr.length == 1) {
    if (typeof arr[0] == "string") {
      obj[arr[0]] = null;
    } else {
      obj = Object.assign(obj, arrToObj(arr[0], blackList));
    }
  } else if (arr.length == 2) {
    if (typeof arr[0] == "string") {
      if (arr[0] == blackList) {
        obj[arr[0]] = {};
      } else {
        obj[arr[0]] = arrToObj(arr[1], blackList);
      }
    } else {
      obj = Object.assign(
        {},
        arrToObj(arr[0], blackList),
        arrToObj(arr[1], blackList)
      );
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      obj = Object.assign(obj, arrToObj(arr[i], blackList));
    }
  }
  return obj;
};

let showTree = function(dir, folder = false, blackList = "node_modules") {
  if (folder) {
    dir = path.join(process.cwd(), dir);
  }
  let obj = tree(dir);
  let arr = iteratorObj(obj);
  let obj1 = arrToObj(arr, blackList);
  console.log(treeify.asTree(obj1, true, false));
};

module.exports = showTree;
