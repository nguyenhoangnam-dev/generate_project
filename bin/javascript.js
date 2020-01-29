let jsIndex = `$(document).ready(function() {
  $(function() {
    $.scrollify({
      section: ".scroll",
      setHeights: true
    });
  });

  let height = $(window).height();
  let width = $(window).width();

  var urlHeader = "../img/header.svg?r=" + Math.random();
  var urlSection;
  $("#header").css("background-image", \`url(\${urlHeader})\`);

  $("body").scroll(function(e) {
    if ($(window).scrollTop() == $("#section5").offset().top) {
      if (!$("#section5").hasClass("pass")) {
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section5").css("background-image", \`url(\${urlSection})\`);
        $("#section5").addClass("pass");
      }
    } else if ($(window).scrollTop() == $("#section4").offset().top) {
      if (!$("#section4").hasClass("pass")) {
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section4").css("background-image", \`url(\${urlSection})\`);
        $("#section4").addClass("pass");
      }
    } else if ($(window).scrollTop() == $("#section3").offset().top) {
      if (!$("#section3").hasClass("pass")) {
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section3").css("background-image", \`url(\${urlSection})\`);
        $("#section3").addClass("pass");
      }
    } else if ($(window).scrollTop() == $("#section2").offset().top) {
      if (!$("#section2").hasClass("pass")) {
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section2").css("background-image", \`url(\${urlSection})\`);
        $("#section2").addClass("pass");
      }
    } else if ($(window).scrollTop() == $("#section1").offset().top) {
      if (!$("#section1").hasClass("pass")) {
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section1").css("background-image", \`url(\${urlSection})\`);
        $("#section1").addClass("pass");
      }
    }
  });
});
`;

let coffeeIndex = `$(document).ready ->
  $ ->
    $.scrollify(
      section: ".scroll",
      setHeights: true
    );
    return

  urlHeader = "../img/header.svg?r=" + Math.random();
  $("#header").css("background-image", "url(#{urlHeader})");

  $("body").scroll (e) -> 
    if $(window).scrollTop() == $("#section5").offset().top 
      if !$("#section5").hasClass("pass") 
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section5").css("background-image", "url(#{urlSection})");
        $("#section5").addClass("pass");
        return
      
    else if $(window).scrollTop() == $("#section4").offset().top 
      if (!$("#section4").hasClass("pass")) 
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section4").css("background-image", "url(#{urlSection})");
        $("#section4").addClass("pass");
        return
      
    else if $(window).scrollTop() == $("#section3").offset().top 
      if (!$("#section3").hasClass("pass")) 
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section3").css("background-image", "url(#{urlSection})");
        $("#section3").addClass("pass");
        return
      
    else if $(window).scrollTop() == $("#section2").offset().top 
      if (!$("#section2").hasClass("pass")) 
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section2").css("background-image", "url(#{urlSection})");
        $("#section2").addClass("pass");
        return
      
    else if $(window).scrollTop() == $("#section1").offset().top 
      if (!$("#section1").hasClass("pass")) 
        urlSection = "../img/section.svg?r=" + Math.random();
        $("#section1").css("background-image", "url(#{urlSection})");
        $("#section1").addClass("pass");
        return
  
  return
`;

let js = {
  none: {
    index: jsIndex
  },
  typescript: {
    index: jsIndex
  },
  coffeescript: {
    index: coffeeIndex
  }
};

module.exports = js;
