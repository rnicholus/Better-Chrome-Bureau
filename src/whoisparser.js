var BCB = BCB || {};

BCB.Whoisparser = function() {
	var whoisUrl = "http://allwhois.com/";
	var commonWhoisDataPattern = /.*Registrant:\n(.*)\n(.*)\n.*/;
	var organisationNamePattern = /.*Organisation Name\.+\s*(.+)\n.*/;
	
	var extractCompanyName = function(searchResponseText) {
		var match = commonWhoisDataPattern.exec(searchResponseText);
		if (match)
		{
			var secondLine = match[2].trim();
			if (secondLine.length == 0 || /\d+/.exec(secondLine)) {
				return match[1].trim();
			}
			return secondLine;
		}
		match = organisationNamePattern.exec(searchResponseText);
		if (match)
		{
			return match[1].trim();
		}
	};
	
	return {
		getCompanyName : function(domainStr, callback) {
			$.post(whoisUrl, {dn: domainStr}, function(responseData) {
					var searchResponseText = $(responseData).find("textarea[name=areafield]").text();
					var companyName = extractCompanyName(searchResponseText);
					callback(companyName);
			});
		}
	};
}(); 