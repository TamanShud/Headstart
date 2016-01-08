var headstart = null;
var namespace = "headstart";

Headstart = function(host, path, tag, files, options) {
  
  var vis_directory = "vis/";
  
  var lib_directory = "lib/";

  var lib_sources = [
     {source: "browser_detect.js"}
       ,{source: "jquery-1.8.1.min.js"}
       ,{source: "state-machine.js"}
       ,{source: "d3.v3.js", important: true}
   ];

  var divs = [
     "main",
     "subdiscipline_title",
     "vis_row",
     "headstart-chart",
     "papers_list_container",
     "paper_frame"
   ];

  var script_sources = [
    {source: "intro.js"}
     ,{source: "popup.js"}
     ,{source: "bubbles.js"}
     ,{source: "papers.js"}
     ,{source: "list.js"}
     ,{source: "headstart.js", final: true}
   ]

  // this is the starting point for the visualisation
  addDiv = function(id, append_tag) {
    var current_div = document.createElement('div');
    current_div.id = id;

    if (id =="vis_row") {
      cont = document.createElement('div');
      cont.id = "container";
      cont.className = "container-fluid";
      //cont.style.marginLeft = "auto";
      cont.style.marginRight = "auto";
      document.getElementById(append_tag).appendChild(cont)

      current_div.className = "row";
      return document.getElementById("container").appendChild(current_div);
    }

    if (id=="headstart-chart") {
      current_div.className = "col-md-7 col-xs-12";
      return document.getElementById("vis_row").appendChild(current_div);
    }

    if (id=="papers_list_container") {
      current_div.className = "col-md-5 col-xs-12";
      return document.getElementById("vis_row").appendChild(current_div);
    }

    return document.getElementById(append_tag).appendChild(current_div);
  }

  addScript = function(source, tag, async) {
    var current_script = document.createElement('script');
    current_script.type = 'text/javascript';
    current_script.src = source;
    current_script.async = async;
    return document.getElementsByTagName(tag)[0].appendChild(current_script);
  }

  addCss = function(source, tag) {
    var current_css = document.createElement('link');
    current_css.type = 'text/css';
    current_css.rel = 'stylesheet';
    current_css.href = source;
    return document.getElementsByTagName(tag)[0].appendChild(current_css);
  }
  
  document.getElementById(tag).className = namespace;
  
  addCss('http://' + host + path + vis_directory + 'style.css', 'head');

  lib_sources.forEach(function(script_source, i) {
    var current_script = addScript('http://' + host + path + vis_directory + lib_directory + script_source.source, 'head', false);

    if (typeof script_source.important !== 'undefined') {
      current_script.onload = function() {
        divs.forEach(function(name) {
          addDiv(name, tag);
        })

        script_sources.forEach(function(script_source) {
          var source = 'http://' + host + path + vis_directory + script_source.source;
          var this_script = addScript(source, 'head', false);

          if (typeof script_source.final !== 'undefined') {
              this_script.onload = function() {
                  headstart = new HeadstartFSM(
                         host
                         , path
                         , tag
                         , files
                         , options
                   );

                   headstart.start();
               }
          }
        })
      }
    }

  })
  
}

function initVar(variable, default_value) {
  return typeof variable !== 'undefined' ? variable : default_value;
}

// ------------------------------------------------------------
// functions which are not being called at the moment, but might
// mausrad -> zoomen
function redraw() {
  chart.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
}

function redraw_drag(x, y, dx, dy) {
  console.log("redraw_drag");
  chart.attr("transform",
          "translate(" + dx + ", " + dy + ")");
}