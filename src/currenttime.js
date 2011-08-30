var dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

self.setInterval(updateText, 900);

function updateText()
{
    chrome.browserAction.setBadgeText({
        text:getCurrentSecond()
    });
}

function getDayOfWeek()
{
    //return dayNames[new Date().getDay()];
    //console.log(new Date().getDay());
    //return "test1";
    return dayNames[new Date().getDay()];
}

function getCurrentMinute()
{
    return new Date().getMinutes() + "";
}

function getCurrentSecond()
{
    return new Date().getSeconds() + "";
}

