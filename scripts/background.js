// This file is necessary for the right click action which opens a link to UWFlow.
chrome.extension.onMessage.addListener(function(message) {
	if (message.action == 'createContextMenuItem') {
		chrome.contextMenus.removeAll();
		chrome.contextMenus.create({title:'Go to Flow', contexts:['link'], targetUrlPatterns:['*://ugradcalendar.uwaterloo.ca/courses/*', '*://ugradcalendar.uwaterloo.ca/courses*Number=*'], onclick:function(info) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: 'openPage', url:info.linkUrl});
			});
		}});
	}
});
