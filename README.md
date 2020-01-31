# Generate front-end project (3.0.0)

> This cli-app use to create front-end project base on preprocessor option and use gulp to run their

## Installation

You need: [Node.js](https://nodejs.org) installed on your matching.

To install

```bash
$ npm i -g @nhn.dev/generate_frontend_project
```

## Usage

After installing, execute the CLI

```bash
$ genproject init folder_name
```

This will show some preprocessor that app can create, underline is default option

![genproject](https://raw.githubusercontent.com/congviec18120062/store_data/master/genproject/genproject.jpg)

Then `$ cd` to your new directory and run `genproject --tree` to see all new file and folder (optional)

Run `npm install` or `yarn install` to install all packages for gulp

After install successfully, run `gulp watch` to see sample website. Finally, run `gulp` to minify and map css code to docs folder

If sample project run successfully you will see something like this:

![genproject sample](https://github.com/congviec18120062/store_data/blob/master/genproject/genproject_sample_demo.gif?raw=true)

**Options**

Create project without sample project

```bash
$ genproject init folder_name -r
```

Show tree when create project finish

```bash
$ genproject init folder_name -t
```

## Other

**Show help**

For a list of all the commands available in the CLI

```bash
$ genproject --help
```

![help](https://raw.githubusercontent.com/congviec18120062/store_data/master/genproject/genproject_help.jpg)

**Show version**

For current version of CLI app

```bash
$ genproject --version
```

**Show directory tree**

It show directory tree except node_modules folder

```bash
$ genproject --tree
```

![tree](https://raw.githubusercontent.com/congviec18120062/store_data/master/genproject/genproject_tree.jpg)
