function listener(tabId, info, tab) {
    if (info.status === isFirefox ? 'complete' : 'loading' && info.url) {
        var url = document.createElement('a');
        url.href = info.url;
        if (url.hostname === 'vk.com' || url.hostname.endsWith('.vk.com')) {
            var path = url.pathname.slice(1);
            var Styles = {};
            styles.forEach(function (style) {
                var apply = path.startsWith(style.match);
                Styles[style.css] = Styles[style.css] || apply
            });
            browser.tabs.sendMessage(tabId, {action: 'updating', css: Styles, path: path}, null)
        }
    }
}

browser.tabs.onUpdated.addListener(listener);

if (browser.runtime.onInstalled) {
    browser.runtime.onInstalled.addListener(function () {
        browser.storage.local.set({enabled: true})
    });
}