chrome.extension.onMessage.addListener(function(message) {
	if (message.action == 'createContextMenuItem') {
		chrome.contextMenus.removeAll();
		chrome.contextMenus.create({title:'Go to Flow', contexts:['link'], targetUrlPatterns:["*://ugradcalendar.uwaterloo.ca/courses/*"], onclick:function(info) {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: "openPage", link:info.linkUrl});
			});
		}});
	}
});
