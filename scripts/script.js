/* UWFlow+
 * https://github.com/DSouzaM/UWFlow-Plus
 * Created by Matt D'Souza
 * Using resources from UWFlow (http://uwflow.com)s
 */

var courseObjs = []; //keeps track of courses to avoid repeated ajax calls

$(document).ready(function(){	
	chrome.extension.sendMessage({'action':'createContextMenuItem'}); // Sends message to background.js which creates right click menu option for courses
	$('body').after('<div id=\"frame\" class=\"loading\"></div>'); 
	$('#frame').load(chrome.extension.getURL("html/hoverwindow.html")); // Appends hover frame to bottom of document
	var courseObj;
	$('a').hover(function(event) { // Applies hover action to all valid courses
		if(!isValidCourseURL(this.href))
			return;
		$('#frame').css('display','block');
		$('#frame').removeClass('info');
		$('#frame').addClass('loading');
		$(this).mousemove(function(event) { // Allows hover frame to follow cursor 
			$('#frame').css('left',event.pageX+'px');
			$('#frame').css('top',event.pageY+'px');
		});
		var code = getCourseCode($(this).attr('href'));
		if ($.grep(courseObjs,function(e) {return e.code.replace(' ','').toLowerCase() == code}).length == 0) { // Searches if information on the course has been fetched and stored already
			var url = $(this).attr('href');
			courseObj = $.ajax({jsonp: false, dataType: 'json', url: getAPIURL(url)})
			courseObj.done(function(flowInfo) {
				courseObjs.push(flowInfo);
				loadContent(code);
			});
		} else {
			loadContent(code);
		}

	}, function() {
		$('#frame').css('display','none');
		if ($.active > 0)
			courseObj.abort(); // Terminates any ongoing AJAX request 
	});		
});

chrome.extension.onMessage.addListener(function(message) { // Receives reply message from background page in order to create contextMenu
	if (message.action=='openPage'){
		window.open(getUWFlowURL(message.url));
	}
});
function isValidCourseURL(url) { // Verifies whether a URL directs to a valid course
	return url.includes('ugradcalendar.uwaterloo.ca/courses/') || (url.includes('ugradcalendar.uwaterloo.ca/courses') && url.includes('Code') && url.includes('Number'));
}

function getCourseCode(url){ // Returns the course code indicated by a URL 
	if (url.indexOf('aspx') > 0) {
		var beginOfCode = url.indexOf('Code=')+5;
		var endOfCode = url.indexOf('&',beginOfCode);
		var beginOfNumber = url.indexOf('Number=')+7;
		var endOfNumber = url.indexOf('&',beginOfNumber);
		return ((endOfCode > 0 ? url.substring(beginOfCode,endOfCode) : url.substring(beginOfCode)) + (endOfNumber > 0 ? url.substring(beginOfNumber,endOfNumber) : url.substring(beginOfNumber))).toLowerCase(); //determines code & number regardless of position in URL
	} else {
		return url.substring(url.indexOf('/courses/')+9).replace('/','').toLowerCase();
	}	
}

function getAPIURL(url) { // Returns URL to the course info through the UWFlow API
	return 'https://uwflow.com/api/v1/courses/' + getCourseCode(url); 
}
function getUWFlowURL(url){ // Returns URL to the course info through regular UWFlow
	return 'https://uwflow.com/course/' + getCourseCode(url); 		
}

function loadContent(code){ // Loads information into hovering frame
	var data = $.grep(courseObjs,function(e) {return e.code.replace(' ','').toLowerCase() == code})[0];
	$('#frame').removeClass('loading');
	$('#frame').addClass('info');
	$('#code').html(data.code);
	$('#course-name').html(data.name);
	$('#description').html(data.description);
	$('#useful-bar').css('width',(data.ratings[0].rating*100)+'%');
	$('#useful').html(Math.round(data.ratings[0].rating*100)+'%');
	$('#easy-bar').css('width',(data.ratings[1].rating*100)+'%');
	$('#easy').html(Math.round(data.ratings[1].rating*100)+'%');
	$('#overall').html(Math.round(data.overall.rating*100)+'%');
}