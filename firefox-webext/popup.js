window.onload = function () {
    document.title = chrome.i18n.getMessage("appName");
    document.getElementById("title").innerHTML = chrome.i18n.getMessage("appName");
    document.getElementById("version").innerHTML = chrome.i18n.getMessage("styleVersion");
    document.getElementById("version_number").innerHTML = "0.50";
    document.getElementById("developing").innerHTML = chrome.i18n.getMessage("developing");
    document.getElementById("support").innerHTML = chrome.i18n.getMessage("support");
    chrome.storage.local.get("enabled",function (item) {
        console.log(item);
        document.getElementById("enabled").checked = item.enabled;
        if (!item.enabled) {
            document.getElementById("title-wrap").classList.add("disabled");
        }
    });
    document.getElementById("enabled").onchange = function () {
        chrome.storage.local.set({enabled:this.checked});
        if (this.checked) document.getElementById("title-wrap").classList.remove("disabled");
        else document.getElementById("title-wrap").classList.add("disabled")
    }
};