var isFirefox = typeof InstallTrigger !== 'undefined';

window.onload = function () {
    document.title = chrome.i18n.getMessage("appName");
    document.getElementById("title").textContent = chrome.i18n.getMessage("appName");
    document.getElementById("version").textContent = chrome.i18n.getMessage("styleVersion");
    document.getElementById("version_number").textContent = isFirefox ? "0.52.2" : chrome.app.getDetails().version;
    document.getElementById("developing").textContent = chrome.i18n.getMessage("developing");
    document.getElementById("support").textContent = chrome.i18n.getMessage("support");
    chrome.storage.local.get("enabled", function (item) {
        console.log(item);
        document.getElementById("enabled").checked = item.enabled;
        if (!item.enabled) {
            document.getElementById("title-wrap").classList.add("disabled");
        }
    });
    document.getElementById("enabled").title = chrome.i18n.getMessage("enabled");
    document.getElementById("enabled").onchange = function () {
        chrome.storage.local.set({enabled: this.checked});
        if (this.checked) document.getElementById("title-wrap").classList.remove("disabled");
        else document.getElementById("title-wrap").classList.add("disabled")
    }
};