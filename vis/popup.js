// StateMachine for Popup UI element in Headstart
// Filename: popup.js
var popup = StateMachine.create({
    
    events: [
        { name: "start", from:  "none",    to: "hidden"  },
        { name: "show",  from:  "hidden",  to: "visible" },
        { name: "hide",  from:  "visible", to: "hidden"  }
    ],

    callbacks: {
        onbeforestart: function( event, from, to ) {
            this.paper_frame = d3.select( "#paper_frame" );
            this.width = 781;
            this.height = 460;
            this.drawPopUp();

            var button = this.drawHideButton( paper_frame_inner );
            button.on("click", function (d) {
              popup.hide();
            });

            this.drawPreviewArea( paper_frame_inner );
            
            if(main_canvas.show_infolink) {
                this.drawInfoLinkWithTitle( "What's this?" );
            }
            
            if(main_canvas.show_timeline) {
              this.drawTimeLineLink();
            }
            
            if(main_canvas.show_dropdown) {
              this.drawDropdown();
            }
            
            this.initClickListenersForNav();
            
        },
        
        onstart: function ( event, from, to ) {
            if(main_canvas.show_intro) {
                popup.show();
            }
        },

        onshow: function( event, from, to ) {
          popup.paper_frame
                  .style ( "display", "block" )
                            
          popup.paper_frame.select( "#preview" )
                           .append( "div" )
                           .attr  ( "id", "intro" )
                           .html(intro_html);
         
         main_canvas.recordAction("none", "show_popup", main_canvas.user_id, "none", null);
        },

        onhide: function( event, from, to ) {
          popup.paper_frame.select("#preview").node().scrollTop = 0;
          popup.paper_frame.style("display", "none");
          var node = popup.paper_frame.select("#preview").node();
          while (node.hasChildNodes()) {
              node.removeChild(node.lastChild);
          }
          
          main_canvas.recordAction("none", "hide_popup", main_canvas.user_id, "none", null);
        }
    }
});

popup.initClickListenersForNav = function() {
  $("#infolink").on("click", function () {
    popup.show();
  });

  $("#timelineview").on("click", function() {
    if ($("#timelineview a").html() == "TimeLineView") {
      main_canvas.totimeline();
    }
  });
}

// The paper frame is the main popup element.
popup.drawPopUp = function() {

  var width = $("#" + main_canvas.tag).width();
  var height = $("#" + main_canvas.tag).height();
  
  var position = $("#" + main_canvas.tag).position();

    popup.paper_frame
         .style( "position", "absolute" )
         .style( "top", position.top + "px" )
         .style( "left", position.left + "px" )
         .style( "width",  width + "px" )
         .style( "height", height + "px" )
         .style( "display", "none");

    toFront(popup.paper_frame.node());

    paper_frame_inner = popup.paper_frame.append("div")
    .attr ( "id", "paper_frame_inner" )
    .style( "width",  popup.width  + "px" )
    .style( "height", popup.height + "px" )
    .style( "margin-top", function (d) {
      return main_canvas.max_chart_size/2 - popup.height/2 + "px";
    });
}

// Draw a "close" button for the popup and position it
// in top right corner of paper_frame.
popup.drawHideButton = function() {
    var button = paper_frame_inner.append( "div" )
                 .attr  ( "id", "paper_frame_bar" )
                 .style ( "width",  popup.width + "px" )
                 .style ( "height", main_canvas.preview_top_height + "px" )
                 .append( "img" )
                 .attr  ( "src", main_canvas.images_path + "close.png" )
                 .attr  ( "id", "close-button" )

    return button;
}

// Draws the area for the description text of the headstart project.
popup.drawPreviewArea = function( paper_frame_inner ) {

    paper_frame_inner.append("div").attr( "id", "shadow-top" );

    paper_frame_inner.append("div")
        .attr ( "id", "preview" )
        .attr ( "width",  popup.width + "px" )
        .attr ( "height", main_canvas.preview_page_height + "px" )
        .style( "height", main_canvas.preview_page_height + "px" );

    paper_frame_inner.append("div").attr( "id","shadow-bottom" );
}

popup.drawTimeLineLink = function() {
  var link = ' <span id="timelineview"><a href="#">TimeLineView</a></span>';
  $("#info").append(link);

  return $("#timelineview");
}

popup.drawDropdown = function() {
  var dropdown = '<select id="datasets"></select>';
  
  $("#info").append(" Select dataset: ");
  $("#info").append(dropdown);

  $.each(main_canvas.bubbles, function (index, entry) {
    var current_item = '<option value="' + entry.file +'">' + entry.title + '</option>';
    $("#datasets").append(current_item);
  })
  
  //$("#datasets " + main_canvas.current_file_number + ":selected").text();
  $("#datasets").val(main_canvas.bubbles[main_canvas.current_file_number].file);
  
  $("#datasets").change(function() {

    var selected_file_number = datasets.selectedIndex + 1;  
    if(selected_file_number != main_canvas.current_file_number) {
      main_canvas.tofile(selected_file_number);
    }
  })
}

popup.drawNormalViewLink = function() {
  // remove event handler
  $("#timelineview").off("click");
  
  // refreshes page
  var link = ' <a href="javascript:window.location.reload()">Normal View</a>';
  $("#timelineview").html(link);
}

// Create title: "Whats this?"
popup.drawInfoLinkWithTitle = function( title ) {

  var text_style = "font-size: 10pt;";
  var link_style = "font-size:8pt; color: rgb(167, 8, 5)";

  var whatsthis = ' <span id="info" style="' + text_style +
                  '">(<a href="#" id="infolink" style="'   + link_style +
                  '">' + title + '</a>)</span></h2>';

  var info = d3.select( "#subdiscipline_title h1" )
               .html(main_canvas.subdiscipline_title + whatsthis);
}

/*popup.loadAndAppendImage =  function( image_src, page_number ) {

    if (list.testImage(image_src)) {
        this.paper_frame.select("#preview")
           .append("div")
            .attr("id", "preview_page_index")
            .style("width", main_canvas.preview_image_width + "px")
            .style("height", "20px")
            .html("Page " + page_number)

        this.paper_frame.select("#preview")
           .append("img")
            .attr("id", "preview_page")
            .attr("class", "lazy")
            .attr("src", image_src)
            .style("height", main_canvas.preview_image_height + "px")
            .style("width", main_canvas.preview_image_width + "px")

    } else {
        return false;
    }
    
    return true;
    
}*/
