/* UWFlow+
 * https://github.com/DSouzaM/UWFlow-Plus
 * Created by Matt D'Souza
 * Using resources from UWFlow (http://uwflow.com)s
 */

var courseObjs = []; //keeps track of courses to avoid repeated ajax calls
var courseObj = {}; // Current AJAX request
var lastClicked = {};

$(document).ready(function(){	
	chrome.extension.sendMessage({'action':'createContextMenuItem'}); // Sends message to background.js which creates right click menu option for courses
	$('body').after('<div id=\"frame\" class=\"loading\"></div>'); 
	$('#frame').load(chrome.extension.getURL("html/hoverwindow.html")); // Appends hover frame to bottom of document
	var courseObj;

	$('body').html($('body').html().replace(/\b[A-Z]{2,}\s*[0-9]{1,3}L?\b(?!.[0-9])(?=[^>]*(<|$))/g, "<span class=\"flow-link\">$&</span>"));

	$('body .flow-link').hover(mouseOver, mouseOut); // Applies hover action to all courses	

	document.addEventListener("mousedown", function(event){
		if ($(event.target).hasClass('flow-link')) {
			lastClicked = $(event.target);
			chrome.extension.sendMessage({'action':'createContextMenuItem'});
		} else {
			chrome.extension.sendMessage({'action':'deleteContextMenuItem'});
		}
	}, true); 

});

function mouseOver(){
	$('#frame').css('display','block');
	$('#frame').removeClass('info');
	$('#frame').addClass('loading');

	$(this).mousemove(function(event) { // Allows hover frame to follow cursor 
		$('#frame').css('left',event.pageX+'px');
		$('#frame').css('top',event.pageY+'px');
	});

	var courseCode = $(this).text().replace(' ','').toLowerCase();

	if ($.grep(courseObjs,function(e) {return e.id == courseCode}).length == 0) { // Searches if information on the course has been fetched and stored already
		courseObj = $.ajax({jsonp: false, dataType: 'json', url: getAPIURL(courseCode)})
		courseObj.done(function(flowInfo) {
			courseObjs.push(flowInfo);
			loadContent(courseCode);
		});

		courseObj.error(errorContent);
	} else {
		loadContent(courseCode);
	}
}

function mouseOut(){
	$('#frame').css('display','none');
	$('#frame > table').css('display', 'none');
	if ($.active > 0)
			courseObj.abort(); // Terminates any ongoing AJAX request 
}

chrome.extension.onMessage.addListener(function(message) { // Receives reply message from background page in order to create contextMenu
	if (message.action=='openPage'){
		var courseCode = lastClicked.text().replace(' ','').toLowerCase();
		window.open(getUWFlowURL(courseCode));
	}
});

function getAPIURL(courseCode) { // Returns URL to the course info through the UWFlow API
	return 'https://uwflow.com/api/v1/courses/' + courseCode; 
}

function getUWFlowURL(courseCode){ // Returns URL to the course info through regular UWFlow
	return 'https://uwflow.com/course/' + courseCode; 		
}

function loadContent(courseCode){ // Loads information into hovering frame
	var data = $.grep(courseObjs,function(e) {return e.id == courseCode})[0];
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
	$('#frame > table').css('display', 'block');
}

function errorContent(error){
	$('#frame').removeClass('loading');
	$('#frame').addClass('info');
	$('#code').html("Error");
	$('#course-name').html("Data can't be loaded");
	$('#description').html(error);
	$('#frame > table').css('display', 'none');
}
