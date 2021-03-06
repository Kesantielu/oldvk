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
    browser.runtime.onInstalled.addListener(function (details) {
        if (details.reason === 'update') {
            var uiLang = typeof chrome.i18n.getUILanguage !== 'undefined' ? chrome.i18n.getUILanguage() : "en";
            var notes = new XMLHttpRequest();
            notes.responseType = 'json';
            notes.onload = function () {
                browser.notifications.create('update-note', notes.response[uiLang])
            };
            notes.open('GET', browser.runtime.getURL('release.json'));
            notes.send();
        }
        if (details.reason === 'install') {
            browser.storage.local.set({enabled: true})
        }
    });
}
