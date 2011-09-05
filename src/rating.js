var BCB = BCB || {};

BCB.Ratings = function()
{
	var domainPattern = /http[s]?:\/\/(\w+\.)*(\w+\.\w+)/\/;
	var lastDomainStr;
	var cachedRatings = {};
	var rating = {
		company:undefined,
		rating:undefined
	}
	var currentTab  =  {
		id:undefined,
		url:undefined
	}

	function addRatingToCache(domainStr, company, rating)
	{
		//TODO limit size of cache
		cachedRatings[domainStr] = {company: company, rating: rating};
		updateRating(rating, company);
	}
	
	function getRatingFromCache(domainStr)
	{
		return cachedRatings[domainStr];
	}
	
	function getDomain(urlStr)
	{
		var match = domainPattern.exec(urlStr);
		if (match)
		{
			return match[2];
		}
	}

	function formatCompanyNameForSearch(companyName)
	{
		return companyName.replace(/\s/g, '+')
			.replace(/[.!]/g, '');
	}
	
	function updateTitleAsWaiting(domainStr)
	{
		chrome.browserAction.setTitle({
			title:"looking up rating for " + domainStr
		});
	}
	
	function updateRating(ratingStr, companyNameStr)
	{
		chrome.browserAction.setBadgeText({
			text:ratingStr
		});
		chrome.browserAction.setTitle({
			title:companyNameStr
		});
	}
	
	
	function processDomain(domainStr)
	{
		updateTitleAsWaiting(domainStr)
		
		var cachedRating = getRatingFromCache(domainStr);
		if (cachedRating)
		{
			updateRating(cachedRating.rating, cachedRating.company);
		}
		else
		{
			BCB.Whoisparser.getCompanyName(domainStr, function(companyName) {
				displayRating(domainStr, companyName)
			});
		}		
	}
	
	function displayRating(domainStr, companyName, callback)
	{
		if (companyName)
		{
			var formattedCompanyName = formatCompanyNameForSearch(companyName);
			
			var searchResultsPage = $("<div/>");
			$(searchResultsPage).load('http://wisconsin.bbb.org/Find-Business-Reviews/name/' + formattedCompanyName + '/ tr.result-row', function(data) {
				var link = $(searchResultsPage).find('.biz-accred-status').find('a').attr('href') + ' #accedited-rating';
				var ratingPage = $("<div/>");
				$(ratingPage).load(link, function() {
					var title = $(ratingPage).find('img').attr('alt');
					var myRegexp = /.*\s([ABCDF][-+]?)\s*.*/;
					var match = myRegexp.exec(title);
					if (match)
					{
						var rating = match[1];
					}
					else
					{
						match = /.*(NR) Rating.*/.exec(title);
						if (match)
						{
							rating = match[1];
						}
						else
						{
							rating = '?';
						}
					}
					
					addRatingToCache(domainStr, companyName, rating);
					console.log(formattedCompanyName + ": " + rating);				
				});
			});		
		}
		else
		{
			updateRating('?', "unknown company");
		}
	}
	
	return {
		tabSelectionChangedListener : function(tabId, selectInfo) {
			if (tabId != currentTab.id)
			{
				currentTab.id = tabId;
				chrome.tabs.get(currentTab.id, function (tab) {
					var domainStr = getDomain(tab.url);
					processDomain(domainStr);
				});
			}
		},
		
		tabUpdatedListener : function(tabId, changeInfo, tab) {
			if (tabId == currentTab.id && changeInfo.status == 'loading') {
				currentTab.url = changeInfo.url;
				var domainStr = getDomain(currentTab.url);
				processDomain(domainStr);
			}
		}
	}
	
}();


chrome.tabs.onSelectionChanged.addListener(BCB.Ratings.tabSelectionChangedListener);

chrome.tabs.onUpdated.addListener(BCB.Ratings.tabUpdatedListener);
