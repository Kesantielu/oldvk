if (chrome.runtime.getManifest().manifest_version === 3)
    importScripts('lib/lib_sw.js');

function listener(tabId, info, tab) {
    if (info.status === isFirefox ? 'complete' : 'loading' && info.url) {
        const url = new URL(info.url);
        if (url.hostname === 'vk.com' || url.hostname.endsWith('.vk.com')) {
            const path = url.pathname.slice(1);
            const Styles = {};
            styles.forEach(function (style) {
                const apply = path.startsWith(style.match);
                Styles[style.css] = Styles[style.css] || apply
            });
            browser.tabs.sendMessage(tabId, {action: 'updating', css: Styles, path: path}, null)
                .catch(e => console.log())
        }
        if (url.href.endsWith('vk.com/al_feed.php')) {
            browser.tabs.update(tabId, {url: 'https://vk.com/feed'})
                .catch(e => console.log())
        } // Для переадресации после авторизации с id.vk.com
    }
}

browser.tabs.onUpdated.addListener(listener);

if (browser.runtime.onInstalled) {
    browser.runtime.onInstalled.addListener(details => {
        if (details.reason === 'update') {
            const uiLang = typeof browser.i18n.getUILanguage !== 'undefined' ? browser.i18n.getUILanguage() : 'en';
            fetch(browser.runtime.getURL('release.json'))
                .then(response => response.json())
                .then(json => browser.notifications.create('update-note', json[uiLang]))
                .catch(e => console.log(e))
        }
        if (details.reason === 'install') {
            browser.storage.local.set({enabled: true})
        }
    });
}

chrome.management.getAll()
    .then(result => console.log(result.map(element => {
        if (element.enabled) return element.id + ': ' + element.name
    })
        .filter(item => {
            if (item !== 'undefined') return item
        })));