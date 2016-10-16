var styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    function listener(tabid, info, tab) {
        if (info.status == 'complete') {
            var url = document.createElement('a');
            url.href = info.url;
            var path = url.pathname.slice(1);
            var Styles = [];
            styles.forEach(function (style) {
                var apply = !!path.startsWith(style.match);
                Styles.push({css: style.css, apply: apply})
            });
            chrome.tabs.sendMessage(tabid, {action: 'updating', css: Styles}, null)
        }
    }

    if (request.action == 'activating') {
        chrome.tabs.onUpdated.addListener(listener);
    }
});