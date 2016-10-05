var styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var id = sender.tab.id;

    function listener(details) {
        console.log(details);
        if (details.tabId == id) {
            var url = document.createElement('a');
            url.href = details.url;
            var path = url.pathname.slice(1);
            var Styles = [];
            styles.forEach(function (style) {
                var apply = !!path.startsWith(style.match);
                Styles.push({css: style.css, apply: apply})
            });
            chrome.tabs.sendMessage(id, {action: 'updating', css: Styles}, null)
        }
    }

    if (request.action == 'activating') {
        chrome.webNavigation.onHistoryStateUpdated.addListener(listener, {url: [{hostEquals: 'vk.com'}]});
    }
});

chrome.runtime.onInstalled.addListener(function () {
   chrome.storage.local.set({enabled:true})
});