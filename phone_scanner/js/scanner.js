CyScanner = {};

CyScanner.prevRawScans = [];

CyScanner.getTypeAndID = function(s) {
  // returns Type and ID, otherwise return empty string
  // this may have to change for different formats

	console.log(s);
	console.log(typeof(s));
  var bookreg = /.*library.cybernetics.social\/checkout\/(\d+)/;
  if(s.match(bookreg)) {
    return { type: "book", id: s.match(bookreg)[1] };
  }

  var dwebreg = /DECENTRALIZEDWEB\.NET\/QR\/2018\.HTML\?BADGE=(\d+)/
  if(s.match(dwebreg)) {
    return { type: "dweb18badge", id: s.match(dwebreg)[1] };
  }

  // else
  return "";
}

CyScanner.isNewScan = function(rawScans) {
	// we have a new scan IF:

  // we used to have one item and now we have a different one item
	// we used to have one item and now we have two items
  // we used to have two items and now we have a different one item 
  // we used to have two items and now we have different two items

	// WE DON'T HAVE A NEW SCAN IF:

	// we used to have two items and now we have one item, one of which was part of those two items
 // we used to have one item, and then we have the same item
 // we used to have two items, and then we have the same two items

 // This is because the scanning library will flicker between recognizing two QR codes simultaneously or not
 // if we don't handle this then holding two QR codes in front of the camera could be misunderstood as constantly having one new item, two new items, etc, etc

	var sortedRawScans = rawScans.slice().sort()

	if (JSON.stringify(sortedRawScans) === JSON.stringify(CyScanner.prevRawScans)) {
		// they're the same items
		return false;
	}

	if(sortedRawScans.length == 1) {
		if(CyScanner.prevRawScans.includes(sortedRawScans[0])) {
			return false; 
		}
	}

	// must be true now

	CyScanner.prevRawScans = sortedRawScans;
	return true;

}


CyScanner.processRawScans = function(rawScans, cb) {
  // rawScans is an array containing one or more strings

	if(CyScanner.isNewScan(rawScans)) {
		var processedScans = rawScans.map(CyScanner.getTypeAndID)
		cb(processedScans);
	}
}



CyScanner.init = function(divid, cb) {

  CyScanner.scanner = new Instascan.Scanner({
    video: document.getElementById(divid)
  });

  Instascan.Camera.getCameras().then(function(cameras) {
    if (cameras.length > 0) {
      CyScanner.scanner.start(cameras[0]);
      CyScanner.scanner.addListener('scan', function(response) {
        CyScanner.processRawScans(response, cb)
      });
    } else {
      console.error('No cameras found.');
    }
  }).catch(function(e) {
    console.error(e);
  });

}


$(document).ready(function() {


  CyScanner.init('scannervid', function(scans) {
		console.log(scans);
//    CyScanner.processRawScans(content)
  });

});


