  $(document).ready(function() {
    $(".searchbox").val("");
    $(".searchbox").on("keypress", function(e) {
      if (e.keyCode == 13) { //enter key starts search
        doSearch();
      }
    });
    $(".search-button").on("click",
     function(e) {
      doSearch();   //button click starts search
    });

    $(".searchbox").on("input paste propertychange", function(e) {
      if ($(".searchbox").val().length > 1) {
        getSuggest();
      }
    });

    function getSuggest() {
      $.ajax({
        url: "https://de.wikipedia.org/w/api.php",
        jsonp: "callback",
        dataType: 'jsonp',
        data: {
          action: "query",
          list: "prefixsearch",
          pssearch: $(".searchbox").val(),
          pslimit: "10",
          format: "json"
        },
        xhrFields: {
          withCredentials: true
        },
        success: updateSuggest,
        error: function(err) {
          console.log(err);
        }
      });
    }

    function updateSuggest(data) {
      var autocomp = [];
      $.each(data.query.prefixsearch, function(index, obj) {

        autocomp.push(obj.title);
      });

      $(".searchbox").autocomplete({
        select: doSearch,
        source: autocomp
      });

      $(".searchbox").autocomplete("search");
    }

    function doSearch(str) {
      $.ajax({
        url: "https://de.wikipedia.org/w/api.php",
        jsonp: "callback",
        dataType: 'jsonp',
        data: {
          action: "query",
          list: "search",
          srsearch: $(".searchbox").val(),
          srinfo: "suggestion",
          srlimit: "10",
          format: "json"
        },
        xhrFields: {
          withCredentials: true
        },
        success: displayResult
      });
    }

    function displayResult(data) {
      $("#results").html("");
      $.each(data.query.search, function(index, obj) {
        var outstring = "";
        outstring += "<li><a href='https://de.wikipedia.org/wiki/" + obj.title.replace(" ", "_") + "'>";
        outstring += "<h2>" + obj.title + "</h2>";
        outstring += "<div class='snippet'>" + obj.snippet + "..." + "</div>";
        outstring += "</a></li>";
        $("#results").append(outstring);
      });
      $("#results li").on("mouseenter", function() {
        $(this).addClass("hovered");
      });
      $("#results li").on("mouseleave", function() {
        $(this).removeClass("hovered");
      });
    }
  });