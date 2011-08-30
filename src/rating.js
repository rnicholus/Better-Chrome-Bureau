        var currentTab  =  {
            id:undefined,
            url:undefined
        }

        chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
            console.log('old tabId: ' + currentTab.id);
            currentTab.id = tabId;
            console.log('new tab id: ' + currentTab.id);
        });

        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            if (tabId == currentTab.id && changeInfo.status == 'loading') {
                currentTab.url = changeInfo.url;
                console.log('new url: ' + currentTab.url);
            }
        });


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
