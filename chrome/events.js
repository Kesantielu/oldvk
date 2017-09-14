function listener(tabId, info, tab) {
    if (info.status = 'complete' && info.url) {
        var url = document.createElement('a');
        url.href = info.url;
        var path = url.pathname.slice(1);
        var Styles = [];
        styles.forEach(function (style) {
            var apply = path.startsWith(style.match);
            Styles.push({css: style.css, apply: apply})
        });
        browser.tabs.sendMessage(tabId, {action: 'updating', css: Styles, path: path}, null)
    }
}

browser.tabs.onUpdated.addListener(listener);

if (browser.runtime.onInstalled) {
    browser.runtime.onInstalled.addListener(function () {
        browser.storage.local.set({enabled: true})
    });
}