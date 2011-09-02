var BCB = BCB || {};

BCB.Ratings = function()
{
	var domainPattern = /http[s]?:\/\/(\w+\.)*(\w+\.\w+)/\/;
	var lastDomainStr;

	var currentTab  =  {
		id:undefined,
		url:undefined
	}

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

	function formatCompanyNameForSearch(companyName)
	{
		return companyName.replace(/\s/g, '+');
	}
	
	function getRating(companyName, callback)
	{
		var formattedCompanyName = formatCompanyNameForSearch(companyName);

		$('#result').load('http://wisconsin.bbb.org/Find-Business-Reviews/name/' + formattedCompanyName + '/ tr.result-row', function(data) {
			var link = $('#result').find('.biz-accred-status').find('a').attr('href') + ' #accedited-rating';
			$('#result').load(link, function() {
				var title = $('#result').find('img').attr('alt');
				var myRegexp = /.*\s([ABCDF][-+]?)\s*.*/;
				var match = myRegexp.exec(title);
				var rating = match[1];
//				chrome.browserAction.setBadgeText({
//					text:rating
//				});
				console.log(companyName + ": " + rating);
			});
		});		
	}

	return {
		tabSelectionChangedListener : function (tabId, selectInfo) {
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
		},
		
		tabUpdatedListener : function(tabId, changeInfo, tab) {
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
		},
		
		getCompanyRating : function(companyName) {
			getRating(companyName);
		}
	};
}();


chrome.tabs.onSelectionChanged.addListener(BCB.Ratings.tabSelectionChangedListener);

chrome.tabs.onUpdated.addListener(BCB.Ratings.tabUpdatedListener);
		

