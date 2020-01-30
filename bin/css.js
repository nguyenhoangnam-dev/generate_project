let scssMain = `@import "helpers/variables";

@import "base/reset";
@import "base/typography";

@import "helpers/functions";
@import "helpers/helpers";
@import "helpers/mixins";

@import "utilities/text";
@import "utilities/font";

@import "layout/flex";
@import "layout/header";
@import "layout/section";
@import "layout/footer";`;

let sassMain = `@import helpers/variables;

@import base/reset
@import base/typography

@import helpers/functions
@import helpers/helpers
@import helpers/mixins

@import utilities/text
@import utilities/font

@import layout/flex
@import layout/header
@import layout/section
@import layout/footer`;

let lessMain = `@import "base/reset";
@import "base/typography";

@import "utilities/text";
@import "utilities/font";

@import "layout/flex";
@import "layout/header";
@import "layout/section";
@import "layout/footer";`;

let stylusMain = `@import "helpers/variables"

@import "base/reset"
@import "base/typography"

@import "helpers/functions"
@import "helpers/helpers"
@import "helpers/mixins"

@import "utilities/text"
@import "utilities/font"

@import "layout/flex"
@import "layout/header"
@import "layout/section"
@import "layout/footer"`;

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
}`;

let sassText = `.text 
  &-center 
    text-align: center
  
  &-upper 
    text-transform: uppercase
  
  &-italic 
    font-style: italic
  
  &-bold 
    font-weight: 700
  
  &-medium 
    font-weight: 500

  &-regular 
    font-weight: 400`;

let lessText = `.text {
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
}`;

let stylusText = `.text-center 
  text-align: center

.text-upper 
  text-transform: uppercase

.text-italic 
  font-style: italic

.text-bold 
  font-weight: 700

.text-medium 
  font-weight: 500

.text-regular 
  font-weight: 400`;

let scssFont = `.font {
  &-firacode {
    font-family: "Fira Code";
  }

  &-roboto {
    font-family: "Roboto";
  }
}`;

let sassFont = `.font 
  &-firacode 
    font-family: "Fira Code"
  
  &-roboto 
    font-family: "Roboto"`;

let lessFont = `.font {
  &-firacode {
    font-family: "Fira Code";
  }

  &-roboto {
    font-family: "Roboto";
  }
}`;

let stylusFont = `.font-firacode 
  font-family: "Fira Code";

.font-roboto
  font-family: "Roboto"`;

let scssHeader = `header {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.header {
  &-title {
    font: {
      size: 4vw;
    }
    padding: {
      left: 80px;
      bottom: 20px;
    }
  }

  &-subtitle {
    font: {
      size: 2vw;
    }
  }

  &-version {
    font: {
      size: 2.5vw;
    }
  }
}`;

let sassHeader = `header 
  height: 100vh
  background-size: cover
  background-repeat: no-repeat

.header 
  &-title 
    font: 
      size: 4vw
        
    padding: 
      left: 80px
      bottom: 20px

  &-subtitle 
    font: 
      size: 2vw

  &-version 
    font: 
      size: 2.5vw`;

let lessHeader = `header {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.header {
  &-title {
    font-size: 4vw;
    padding-left: 80px;
    padding-bottom: 20px;
  }

  &-subtitle {
    font-size: 2vw;
  }

  &-version {
    font-size: 2.5vw;
  }
}`;

let stylusHeader = `header 
  height: 100vh
  background-size: cover
  background-repeat: no-repeat

.header-title 
  font-size: 4vw
  padding-left: 80px
  padding-bottom: 20px

.header-subtitle 
  font-size: 2vw

.header-version 
  font-size: 2.5vw
`;

let scssSection = `section {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.section {
  width: 50vw;
  height: 35vh;
  padding: {
    top: 40px;
    bottom: 40px;
    left: 40px;
    right: 40px;
  }

  &-title {
    font: {
      size: 2.8vw;
    }
    border-bottom: 1px solid $color-black;
    padding: {
      bottom: 2vw;
    }
    margin: {
      bottom: 2.5vw;
    }
  }

  &-script {
    font: {
      size: 1.8vw;
    }
    padding: {
      top: 20px;
      bottom: 20px;
      left: 20px;
    }
    background-color: $color-gray;
  }
}`;

let sassSection = `section 
  height: 100vh
  background-size: cover
  background-repeat: no-repeat

.section  
  width: 50vw
  height: 35vh
  padding: 
    top: 40px
    bottom: 40px
    left: 40px
    right: 40px
  
  &-title 
    font: 
      size: 2.8vw
    border-bottom: 1px solid $color-black
    padding: 
      bottom: 2vw
    margin: 
      bottom: 2.5vw
    
  &-script 
    font: 
      size: 1.8vw
    padding: 
      top: 20px
      bottom: 20px
      left: 20px
    background-color: $color-gray`;

let lessSection = `@color-black: #000000;
@color-gray: #f7f7f7;

section {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.section {
  width: 50vw;
  height: 35vh;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 40px;
  padding-right: 40px;
  
  &-title {
    font-size: 2.8vw;
    border-bottom: 1px solid @color-black;
    padding-bottom: 2vw;
    margin-bottom: 2.5vw;
  }

  &-script {
    font-size: 1.8vw;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    background-color: @color-gray;
  }
}`;

let stylusSection = `section 
  height: 100vh
  background-size: cover
  background-repeat: no-repeat

.section
  width: 50vw
  height: 35vh
  padding-top: 40px
  padding-bottom: 40px
  padding-left: 40px
  padding-right: 40px

.section-title 
  font-size: 2.8vw
  border-bottom: 1px solid color-black
  padding-bottom: 2vw
  margin-bottom: 2.5vw

.section-script 
  font-size: 1.8vw
  padding-top: 20px
  padding-bottom: 20px
  padding-left: 20px
  background-color: color-gray`;

let scssFooter = `footer {
  height: 100vh;
  background-color: $color-black;
}

.footer {
  a {
    color: $color-white;
    font-size: 3vw;
    line-height: 100vh;
  }
}`;

let sassFooter = `footer 
  height: 100vh
  background-color: $color-black

.footer 
  a 
    color: $color-white
    font-size: 3vw
    line-height: 100vh`;

let lessFooter = `@color-white: #ffffff;
@color-black: #000000;

footer {
  height: 100vh;
  background-color: @color-black;
}

.footer {
  a {
    color: @color-white;
    font-size: 3vw;
    line-height: 100vh;
  }
}`;

let stylusFooter = `footer
  height: 50px
  background-color: color-black

.footer 
  a 
    color: $color-white
    font-size: 40px
    line-height: 50px`;

let scssVariable = `$color-white: #ffffff;
$color-black: #000000;
$color-gray: #f7f7f7;
`;

let sassVariable = `$color-white: #ffffff
$color-black: #000000
$color-gray: #f7f7f7
`;

let stylusVariable = `color-white= #ffffff
color-black= #000000
color-gray= #f7f7f7`;

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
}`;

let sassTypography = `@font-face 
  font-family: "Firacode"
  font-weight: 500
  font-style: normal
  src: url("../font/FiraCode-Medium.ttf")

@font-face 
  font-family: "Roboto"
  font-weight: 700
  font-style: normal
  src: url("../font/Roboto-Bold.ttf")

@font-face 
  font-family: "Roboto"
  font-weight: 500
  font-style: normal
  src: url("../font/Roboto-Medium.ttf")

@font-face 
  font-family: "Roboto"
  font-weight: 400
  font-style: normal
  src: url("../font/Roboto-Regular.ttf")`;

let lessTypography = `@font-face {
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
}`;

let stylusTypography = `@font-face 
  font-family: "Firacode"
  font-weight: 500
  font-style: normal
  src: url("../font/FiraCode-Medium.ttf")

@font-face 
  font-family: "Roboto"
  font-weight: 700
  font-style: normal
  src: url("../font/Roboto-Bold.ttf")

@font-face 
  font-family: "Roboto"
  font-weight: 500
  font-style: normal
  src: url("../font/Roboto-Medium.ttf")

@font-face 
  font-family: "Roboto"
  font-weight: 400
  font-style: normal
  src: url("../font/Roboto-Regular.ttf")`;

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
}`;

let sassReset = `html,
body 
  margin: 0
  padding: 0
  width: 100%
  height: 100%
  font: 
    family: "Roboto"
    weight: regular
  
  color: $color-black
  overflow-x: hidden
  -webkit-tap-highlight-color: transparent
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
  -webkit-font-smoothing: antialiased
  position: relative

a 
  text-decoration: none`;

let lessReset = `@color-black: #000000;

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: "Roboto";
  font-weight: regular;
  color: @color-black;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-font-smoothing: antialiased;
  position: relative;
}

a {
  text-decoration: none;
}`;

let stylusReset = `html,
body 
  margin: 0
  padding: 0
  width: 100%
  height: 100%
  font-family: "Roboto"
  font-weight: regular
  color: color-black
  overflow-x: hidden
  -webkit-tap-highlight-color: transparent
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
  -webkit-font-smoothing: antialiased
  position: relative

a 
  text-decoration: none`;

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

.flex-column {
  flex-direction: column;
}

header {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.header-title {
  font-size: 4vw;
  padding-left: 80px;
  padding-bottom: 20px;
}

.header-subtitle {
  font-size: 2vw;
}

.header-version {
  font-size: 2.5vw;
}

section {
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
}

.section {
  width: 50vw;
  height: 35vh;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 40px;
  padding-right: 40px;
}

.section-title {
  font-size: 2.8vw;
  border-bottom: 1px solid #000000;
  padding-bottom: 2vw;
  margin-bottom: 2.5vw;
}

.section-script {
  font-size: 1.8vw;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  background-color: #f7f7f7;
}

footer {
  height: 100vh;
  background-color: #000000;
}

.footer a {
  color: #ffffff;
  font-size: 3vw;
  line-height: 100vh;
}`;

let scssFlex = `.flex {
  display: flex;
  &-vcenter {
    justify-content: center;
  }

  &-hcenter {
    align-items: center;
  }

  &-column {
    flex-direction: column;
  }
}`;

let sassFlex = `.flex 
  display: flex
  &-vcenter 
    justify-content: center
  
  &-hcenter 
    align-items: center

  &-column 
    flex-direction: column
  `;

let lessFlex = `.flex {
  display: flex;
  &-vcenter {
    justify-content: center;
  }

  &-hcenter {
    align-items: center;
  }

  &-column {
    flex-direction: column;
  }
}`;

let stylusFlex = `.flex 
  display: flex

.flex-vcenter 
  justify-content: center

.flex-hcenter 
  align-items: center

.flex-column 
  flex-direction: column`;

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
  },
  sass: {
    reset: sassReset,
    typography: sassTypography,
    variables: sassVariable,
    flex: sassFlex,
    header: sassHeader,
    section: sassSection,
    footer: sassFooter,
    font: sassFont,
    text: sassText,
    main: sassMain
  },
  less: {
    reset: lessReset,
    typography: lessTypography,
    flex: lessFlex,
    header: lessHeader,
    section: lessSection,
    footer: lessFooter,
    font: lessFont,
    text: lessText,
    main: lessMain
  },
  stylus: {
    reset: stylusReset,
    typography: stylusTypography,
    variables: stylusVariable,
    flex: stylusFlex,
    header: stylusHeader,
    section: stylusSection,
    footer: stylusFooter,
    font: stylusFont,
    text: stylusText,
    main: stylusMain
  }
};

module.exports = css;
