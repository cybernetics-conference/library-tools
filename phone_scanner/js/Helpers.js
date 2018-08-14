Helpers = {};

Helpers.download_csv = function(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

Helpers.export_table_to_csv = function(html, filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
	
    for (var i = 0; i < rows.length; i++) {
			var row = [], cols = rows[i].querySelectorAll("td, th");
		
      for (var j = 0; j < cols.length; j++)  {
				var rowtext = "\"" +  cols[j].innerText.replace(/"/g, '""') + "\"";
				row.push(rowtext);
			}

        
		csv.push(row.join(","));		
	}

    // Download CSV
    Helpers.download_csv(csv.join("\n"), filename);
}


/* EXAMPLE USAGE
document.querySelector("button").addEventListener("click", function () {
  var html = document.querySelector("table").outerHTML;
	export_table_to_csv(html, "table.csv");
});
*/


Helpers.downloadCollectionDataWithCors = function(cb) {
  var corsproxyurl = "https://cors-anywhere.herokuapp.com/";
  //var libthingurl = "http://www.librarything.com/catalog_bottom.php?view=CyberneticsCon&collection=" + collectionid + "&printable=1";
  var libthingurl = "http://www.librarything.com/catalog_bottom.php?view=CyberneticsCon&printable=1";
  var geturl = corsproxyurl + libthingurl;
  $.get(geturl, function(d) {
      var allbooks = {};
      var dom_nodes = $($.parseHTML(d));
      var books = dom_nodes.find("tr.cat_catrow");
      books.each(function(i, d) {
          var thisbook = {};
          thisbook.url = "https://www.librarything.com" + $(d).find('.lt-title').attr('href');
          thisbook.title = $(d).find('.lt-title').html();
          if(thisbook.title) {	thisbook.title = thisbook.title.replace(/&nbsp;/gi,''); }
          thisbook.author = $(d).find('.lt-author').html();
          if(thisbook.author) {	thisbook.author = thisbook.author.replace(/&nbsp;/gi,''); }
          var tags = [];
          $(d).find('.lt-tag').each(function(i, e) { tags.push($(e).html()); })
          thisbook.tags = tags.join(", ")
          thisbook.fromwhere = $(d).find(':nth-child(9) > div > div').html()
          if(thisbook.fromwhere) {	thisbook.fromwhere = thisbook.fromwhere.replace(/&nbsp;/gi,''); }
          thisbook.publication = $(d).find('.lt-publication').html()
          if(thisbook.publication) {	thisbook.publication = thisbook.publication.replace(/&nbsp;/gi,''); }
          thisbook.bookid =  $(d).attr('id').split("_")[1];

          allbooks[thisbook.bookid] = thisbook;
      });
      cb(allbooks)
  })

}
 
