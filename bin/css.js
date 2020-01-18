let scssMain = `@import "helpers/variables";

@import "base/reset";
@import "base/typography";

@import "helpers/functions";
@import "helpers/helpers";
@import "helpers/mixins";

@import "utilities/text";
@import "utilities/font";

@import "layout/flex";
@import "layout/grid";
@import "layout/header";
@import "layout/section";
@import "layout/footer";
`;

let scssText = `.text {
  &-center {
    text-align: center;
  }

  &-upper {
    text-transform: uppercase;
  }

  &-italic {
    font-style: italic;
  }

  &-bold {
    font-weight: 700;
  }

  &-medium {
    font-weight: 500;
  }

  &-regular {
    font-weight: 400;
  }
}
`;

let scssFont = `.font {
  &-firacode {
    font-family: "Fira Code";
  }

  &-roboto {
    font-family: "Roboto";
  }
}
`;

let scssHeader = `header {
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}

.header {
  &-title {
    font: {
      size: 60px;
    }
    padding: {
      left: 80px;
      bottom: 20px;
    }
  }

  &-subtitle {
    font: {
      size: 30px;
    }
  }

  &-version {
    font: {
      size: 25px;
    }
  }
}
`;

let scssSection = `section {
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}

.section {
  &-install,
  &-usage,
  &-tree,
  &-version,
  &-help {
    width: 900px;
    height: 200px;
    padding: {
      top: 40px;
      bottom: 40px;
      left: 40px;
      right: 40px;
    }
  }
  &-title {
    font: {
      size: 40px;
    }
    border-bottom: 1px solid $color-black;
    padding: {
      bottom: 40px;
    }
    margin: {
      bottom: 30px;
    }
  }

  &-script {
    font: {
      size: 25px;
    }
    padding: {
      top: 20px;
      bottom: 20px;
      left: 20px;
    }
    background-color: $color-gray;
  }
}
`;

let scssFooter = `footer {
  height: 50px;
  background-color: $color-black;
}

.footer {
  a {
    color: $color-white;

    font-size: 40px;
    line-height: 50px;
  }
}
`;

let scssVariable = `$color-white: #ffffff;
$color-black: #000000;
$color-gray: #f7f7f7;
`;

let scssTypography = `@font-face {
  font-family: "Firacode";
  font-weight: 500;
  font-style: normal;
  src: url("../font/FiraCode-Medium.ttf");
}

@font-face {
  font-family: "Roboto";
  font-weight: 700;
  font-style: normal;
  src: url("../font/Roboto-Bold.ttf");
}

@font-face {
  font-family: "Roboto";
  font-weight: 500;
  font-style: normal;
  src: url("../font/Roboto-Medium.ttf");
}

@font-face {
  font-family: "Roboto";
  font-weight: 400;
  font-style: normal;
  src: url("../font/Roboto-Regular.ttf");
}
`;

let scssReset = `html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font: {
    family: "Roboto";
    weight: regular;
  }
  color: $color-black;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-font-smoothing: antialiased;
  position: relative;
}

a {
  text-decoration: none;
}
`;

let cssMain = `html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "Roboto";
  font-weight: regular;
  color: #000000;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-font-smoothing: antialiased;
  position: relative;
}

a {
  text-decoration: none;
}

@font-face {
  font-family: "Firacode";
  font-weight: 500;
  font-style: normal;
  src: url("../font/FiraCode-Medium.ttf");
}

@font-face {
  font-family: "Roboto";
  font-weight: 700;
  font-style: normal;
  src: url("../font/Roboto-Bold.ttf");
}

@font-face {
  font-family: "Roboto";
  font-weight: 500;
  font-style: normal;
  src: url("../font/Roboto-Medium.ttf");
}

@font-face {
  font-family: "Roboto";
  font-weight: 400;
  font-style: normal;
  src: url("../font/Roboto-Regular.ttf");
}

.text-center {
  text-align: center;
}

.text-upper {
  text-transform: uppercase;
}

.text-italic {
  font-style: italic;
}

.text-bold {
  font-weight: 700;
}

.text-medium {
  font-weight: 500;
}

.text-regular {
  font-weight: 400;
}

.font-firacode {
  font-family: "Fira Code";
}

.font-roboto {
  font-family: "Roboto";
}

.flex {
  display: flex;
}

.flex-vcenter {
  justify-content: center;
}

.flex-hcenter {
  align-items: center;
}

header {
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}

.header-title {
  font-size: 60px;
  padding-left: 80px;
  padding-bottom: 20px;
}

.header-subtitle {
  font-size: 30px;
}

.header-version {
  font-size: 25px;
}

section {
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
}

.section-install, .section-usage, .section-tree, .section-version, .section-help {
  width: 900px;
  height: 200px;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 40px;
  padding-right: 40px;
}

.section-title {
  font-size: 40px;
  border-bottom: 1px solid #000000;
  padding-bottom: 40px;
  margin-bottom: 30px;
}

.section-script {
  font-size: 25px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  background-color: #f7f7f7;
}

footer {
  height: 50px;
  background-color: #000000;
}

.footer a {
  color: #ffffff;
  font-size: 40px;
  line-height: 50px;
}

`;

let scssFlex = `.flex {
  display: flex;
  &-vcenter {
    justify-content: center;
  }

  &-hcenter {
    align-items: center;
  }
}
`;

let css = {
  scss: {
    reset: scssReset,
    typography: scssTypography,
    variables: scssVariable,
    flex: scssFlex,
    header: scssHeader,
    section: scssSection,
    footer: scssFooter,
    font: scssFont,
    text: scssText,
    main: scssMain
  },
  none: {
    main: cssMain
  }
};

module.exports = css;
