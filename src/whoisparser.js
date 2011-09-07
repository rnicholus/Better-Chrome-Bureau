var BCB = BCB || {};

BCB.Whoisparser = function() {
	var blockedResultMessage = "Too many requests!";
	var whoisUrl = "http://allwhois.com/";
	//var commonWhoisDataPattern = /.*Registrant:\n(.*)\n(.*)\n.*/;
	var commonWhoisPattern = /.*Registrant:\n(.*)\n(.+)\n/;
	var commonWhoisPatternNoAddressSecondLine = /.*Registrant:\n(.*)\n(\D+?)\n/;
	var commonWhoisPatternFirstLine = /.*Registrant:\n(.*)\n/;
	var organisationNamePattern = /.*Organisation Name\.+\s*(.+)\n.*/;
	var registrantOrganizationPattern = /Registrant Organization:(.+)/;
	var registrarPattern = /Registrar:(.+)\n/;
	
	
	function extractCompanyName (searchResponseText) {
		var match;
		
		if (match = commonWhoisPatternNoAddressSecondLine.exec(searchResponseText) && commonWhoisPattern.exec(searchResponseText))
		{
			companyName = match[2];
		}
		else if (match = commonWhoisPatternFirstLine.exec(searchResponseText))
		{
			companyName = match[1];
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