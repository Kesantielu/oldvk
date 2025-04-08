if (typeof importScripts !== 'undefined')
    importScripts('../lib/lib.js');

let urlPatterns = function () {
    const manifest = chrome.runtime.getManifest();
    if (manifest.content_scripts?.length > 0) {
        urlPatterns = manifest.content_scripts[0].matches.map(
            pattern => {
                return new RegExp(pattern
                    .replace(/\./g, "\\.")
                    .replace(/\*/g, ".*")
                    .replace(/\//g, "\\/"), 'i');
            }
        );
        console.log("Отслеживаемые шаблоны URL:", urlPatterns);
        return urlPatterns;
    }
}

function matchesUrlPattern(url) {
    // Преобразуем wildcard шаблоны в регулярные выражения
    for (const pattern of urlPatterns)
        if (pattern.test(url))
            return true;
    return false;
}

browser.tabs.onUpdated.addListener((tabId, info) => {
    console.log('tabs.onUpdated', tabId, info);
    if ((info.status === "loading" || info.status === "complete") && info.url) {
        if (matchesUrlPattern(info.url)) {
            console.log(`URL изменен в ${tabId}: ${info.url}`);
            browser.tabs.sendMessage(tabId, {
                action: "updating",
                url: info.url
            });
        }
    }
});

browser.runtime.onMessage.addListener(message => {
    if (message.action === "content_detected_url_change") {
        console.log(`[Service Worker] Content script detected URL change: ${message.url}`);
    }
});