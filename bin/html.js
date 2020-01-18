var pugIndex = `<!DOCTYPE html>
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    meta(http-equiv="X-UA-Compatible" content="ie=edge")
    // build:css
    link(rel="stylesheet" href="css/main.css")
    // endbuild
    title Generate front-end project (v2.0.0)
  body
    header.flex.flex-vcenter.flex-hcenter.scroll#header
      .header.font-roboto
        .header-title.text-bold.text-center Generate front-end project #[span(class="header-version") v2.0.0]
        .header-subtitle.text-center This cli-app use to create front-end project
    section.flex.flex-vcenter.flex-hcenter.scroll#section1
      .section-install
        .section-title.font-roboto.text-medium Install
        .section-script.font-firacode $ npm install --global @nhn.dev/generate_frontend_project
    section.flex.flex-vcenter.flex-hcenter.scroll#section2
      .section-usage
        .section-title.font-roboto.text-medium Usage 
        .section-script.font-firacode $ genproject init folder-name
        .section-gif 
    section.flex.flex-vcenter.flex-hcenter.scroll#section3
      .section-tree
        .section-title.font-roboto.text-medium Tree 
        .section-script.font-firacode $ genproject --tree 
        .section-gif 
    section.flex.flex-vcenter.flex-hcenter.scroll#section4
      .section-version
        .section-title.font-roboto.text-medium Version 
        .section-script.font-firacode $ genproject --version 
        .section-gif 
    section.flex.flex-vcenter.flex-hcenter.scroll#section5 
      .section-help
        .section-title.font-roboto.text-medium Help 
        .section-script.font-firacode $ genproject --help
        .section-gif 
    footer.footer.text-center.scroll
      a( href='https://github.com/congviec18120062/generate_project') https://github.com/congviec18120062/generate_project


    script(src="lib/jquery-3.4.1.min.js")
    script(src="lib/jquery.scrollify.js")
    // build:js
    script(src="js/index.js")
    // endbuild`;

let htmlIndex = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <!-- build:css-->
    <link rel="stylesheet" href="css/main.css"/>
    <!-- endbuild-->
    <title>Generate front-end project (v2.0.0)</title>
  </head>
  <body>
    <header class="flex flex-vcenter flex-hcenter scroll" id="header">
      <div class="header font-roboto">
        <div class="header-title text-bold text-center">Generate front-end project <span class="header-version">v2.0.0</span></div>
        <div class="header-subtitle text-center">This cli-app use to create front-end project</div>
      </div>
    </header>
    <section class="flex flex-vcenter flex-hcenter scroll" id="section1">
      <div class="section-install">
        <div class="section-title font-roboto text-medium">Install</div>
        <div class="section-script font-firacode">$ npm install --global @nhn.dev/generate_frontend_project</div>
      </div>
    </section>
    <section class="flex flex-vcenter flex-hcenter scroll" id="section2">
      <div class="section-usage">
        <div class="section-title font-roboto text-medium">Usage </div>
        <div class="section-script font-firacode">$ genproject init folder-name</div>
        <div class="section-gif"> </div>
      </div>
    </section>
    <section class="flex flex-vcenter flex-hcenter scroll" id="section3">
      <div class="section-tree">
        <div class="section-title font-roboto text-medium">Tree </div>
        <div class="section-script font-firacode">$ genproject --tree </div>
        <div class="section-gif"> </div>
      </div>
    </section>
    <section class="flex flex-vcenter flex-hcenter scroll" id="section4">
      <div class="section-version">
        <div class="section-title font-roboto text-medium">Version </div>
        <div class="section-script font-firacode">$ genproject --version </div>
        <div class="section-gif"> </div>
      </div>
    </section>
    <section class="flex flex-vcenter flex-hcenter scroll" id="section5"> 
      <div class="section-help">
        <div class="section-title font-roboto text-medium">Help </div>
        <div class="section-script font-firacode">$ genproject --help</div>
        <div class="section-gif"> </div>
      </div>
    </section>
    <footer class="footer text-center scroll"><a href="https://github.com/congviec18120062/generate_project">https://github.com/congviec18120062/generate_project</a></footer>
    <script src="lib/jquery-3.4.1.min.js"></script>
    <script src="lib/jquery.scrollify.js"></script>
    <!-- build:js-->
    <script src="js/index.js"></script>
    <!-- endbuild-->
  </body>
</html>`;

let html = {
  pug: {
    index: pugIndex
  },
  none: {
    index: htmlIndex
  }
};

module.exports = html;
