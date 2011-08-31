var domainPattern = /http[s]?:\/\/(\w+\.)*(\w+\.\w+)/\/;
var lastDomainStr;


var currentTab  =  {
	id:undefined,
    url:undefined
}

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	if (tabId != currentTab.id)
	{
		currentTab.id = tabId;
		chrome.tabs.get(currentTab.id, function (tab) {
			var domainStr = getDomain(tab.url);
			if (domainStr && domainStr != lastDomainStr)
			{
				console.log("new tab w/ new domain: " + domainStr);
				console.log(getDomainAsSearchContext(domainStr));
				lastDomainStr = domainStr;
			}
		});
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tabId == currentTab.id && changeInfo.status == 'loading') {
		currentTab.url = changeInfo.url;
		var domainStr = getDomain(currentTab.url);
		if (domainStr && domainStr != lastDomainStr)
		{
			console.log('new domain: ' + domainStr);
			console.log(getDomainAsSearchContext(domainStr));
			lastDomainStr = domainStr;
		}
	}
});
		
function getDomain(urlStr)
{
	var match = domainPattern.exec(urlStr);
	if (match)
	{
		return match[2];
	}
}

function getDomainAsSearchContext(domainStr)
{
	return domainStr.replace('\.', '_');
}

function getCompanyName(domainStr)
{
	//TODO, using allwhois.com
}


<!--$('#result').load('http://wisconsin.bbb.org/Find-Business-Reviews/url/koss_com/ tr.result-row', function(data) {-->
	<!--var link = $('#result').find('.biz-accred-status').find('a').attr('href') + ' #accedited-rating';-->
	<!--$('#result').load(link, function() {-->
		<!--var title = $('#result').find('img').attr('title');-->
		<!--var myRegexp = /BBB.*\s(.+)\sRating/;-->
		<!--var match = myRegexp.exec(title);-->
		<!--var rating = match[1];-->
		<!--chrome.browserAction.setBadgeText({-->
			<!--text:rating-->
		<!--});-->
	<!--});-->
<!--});-->
