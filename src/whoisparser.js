var BCB = BCB || {};

BCB.Whoisparser = function() {
	var blockedResultMessage = "Too many requests!";
	var whoisUrl = "http://allwhois.com/";
	var commonWhoisDataPattern = /.*Registrant:\n(.*)\n(.*)\n.*/;
	var organisationNamePattern = /.*Organisation Name\.+\s*(.+)\n.*/;
	var registrantOrganizationPattern = /Registrant Organization:(.+)/;
	var registrarPattern = /Registrar:(.+)\n/;
	
	
	function extractCompanyName (searchResponseText) {
		var match = commonWhoisDataPattern.exec(searchResponseText);
		if (match)
		{
			var secondLine = match[2];
			if (secondLine.length == 0 || /\d+/.exec(secondLine)) {
				var companyName = match[1];
			}
			else
			{
				companyName = secondLine;
			}
		}
		else
		{
			match = organisationNamePattern.exec(searchResponseText);
			if (match)
			{
				companyName = match[1];
			}
			else
			{
				match = registrantOrganizationPattern.exec(searchResponseText);
				if (match)
				{
					companyName = match[1];
				}
			}
		}
		
		if (companyName)
		{
			companyName = companyName.trim()
				.replace(/\(.+\)/g, '');
		}
			
		return companyName;
		
	};
	
	return {
		getCompanyName : function(domainStr, callback) {
			$.post(whoisUrl, {dn: domainStr}, function(responseData) {
					var searchResponseText = $(responseData).find("textarea[name=areafield]").text();
					if (searchResponseText != blockedResultMessage)
					{
						var companyName = extractCompanyName(searchResponseText);
						callback(companyName);
					}
					else
					{
						console.log('retrying...');
						BCB.Whoisparser.getCompanyName(domainStr, callback);
					}
			});
		}
	};
}(); 