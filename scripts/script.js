var courseObjs = []; //keeps track of courses to avoid repeated ajax calls
var d = new Date();
$(document).ready(function(){	
	chrome.extension.sendMessage({'action':'createContextMenuItem'}); //adds right click option to course links
	$('body').after('<div id=\"frame\" class=\"loading\"></div>'); //appends a div after body
	$('#frame').load(chrome.extension.getURL("html/hoverwindow.html")); //loads html of hover template into div
	var $flowRequest;
	$('a').hover(function(event) {
		if(!this.href.includes('ugradcalendar.uwaterloo.ca/courses/'))
			return;
		$('#frame').css('display','block');
		$('#frame').removeClass('info');
		$('#frame').addClass('loading');
		$(this).mousemove(function(event) { // makes div follow cursor 
			$('#frame').css('left',event.pageX+'px');
			$('#frame').css('top',event.pageY+'px');
		});
		var code = getCourseCode($(this).attr('href'));


		if ($.grep(courseObjs,function(e) {return e.code == code}).length == 0) { // performs ajax request if information not found
			var link = $(this).attr('href');
			$flowRequest = $.ajax({jsonp: false, dataType: 'html', url: getUWFlowLink(link)})
			$flowRequest.done(function(flowInfo) {
				$('<div />').append(flowInfo).find('script').each(function() { // appends each script element to a div to make it DOM-accessible
					var $text = $(this).text();
					var begin = $text.indexOf('window.pageData.courseObj = {'); // finds beginning of JSON object declaration
					if (begin > 0) {
						var end = $text.indexOf('\};', begin); // finds end of JSON object declaration
						var flowData = JSON.parse($text.substring(begin+28, end)+ '}'); // parses data between						
						var newCourseObj = {code:flowData.code, name:flowData.name, description:flowData.description, usefulness:flowData.ratings[0].rating, easiness:flowData.ratings[1].rating, overall:flowData.overall.rating};
						courseObjs.push(newCourseObj); 
					}
				});
				loadContent(code);
			});
		} else {
			loadContent(code);
		}

	}, function() {
		$('#frame').css('display','none');
		if ($.active > 0)
			$flowRequest.abort(); // terminates any ongoing request 
	});		
});

chrome.extension.onMessage.addListener(function(message) { //receives message from background page in order to create contextMenu
	if (message.action=='openPage'){
		window.open(getUWFlowLink(message.link));
	}
});

function getCourseCode(link){
	return link.substring(link.indexOf('/courses/')+9).replace('/',' ');
}
function getUWFlowLink(link){
	return 'https://uwflow.com/course/' + link.substring(link.indexOf('/courses/')+9).replace('/','').toLowerCase();
}



function loadContent(code){
	var data = $.grep(courseObjs,function(e) {return e.code == code})[0];
	$('#frame').removeClass('loading');
	$('#frame').addClass('info');
	$('#code').html(data.code);
	$('#course-name').html(data.name);
	$('#description').html(data.description);
	$('#useful-bar').css('width',(data.usefulness*100)+'%');
	$('#useful').html(Math.round(data.usefulness*100)+'%');
	$('#easy-bar').css('width',(data.easiness*100)+'%');
	$('#easy').html(Math.round(data.easiness*100)+'%');
	$('#overall').html(Math.round(data.overall*100)+'%');
}