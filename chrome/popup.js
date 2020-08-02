if (!window.browser)
    window.browser = window.msBrowser || window.chrome;

var isFirefox = typeof InstallTrigger !== 'undefined';

var isWebExt = typeof browser !== 'undefined' && typeof browser.extension !== 'undefined';

window.onload = isWebExt ? function () {
    document.title = browser.i18n.getMessage("appName");
    document.getElementById("version_number").textContent = browser.runtime.getManifest().version;
    Array.prototype.forEach.call(document.querySelectorAll('[data-l10n-id]'), function (item) {
        item.textContent = browser.i18n.getMessage(item.dataset.l10nId)
    });
    browser.storage.local.get("enabled", function (item) {
        document.getElementById("enabled").checked = item.enabled;
        if (!item.enabled)
            document.getElementById("title-wrap").classList.add("disabled");
    });
    document.getElementById("enabled").title = browser.i18n.getMessage("enable");
    document.getElementById("enabled").onchange = function () {
        browser.storage.local.set({enabled: this.checked});
        if (this.checked)
            document.getElementById("title-wrap").classList.remove("disabled");
        else
            document.getElementById("title-wrap").classList.add("disabled")
    };
    document.getElementById("options").href = chrome.runtime.getURL('options.html');
} : function () {
    document.getElementById("version_number").textContent = self.options.version;
    self.port.on('enabled', function (e) {
        document.getElementById("enabled").checked = e;
        if (!e)
            document.getElementById("title-wrap").classList.add("disabled");
    });
    document.getElementById("enabled").onchange = function (e) {
        self.port.emit('enabled', e.target.checked);
        if (this.checked)
            document.getElementById("title-wrap").classList.remove("disabled");
        else
            document.getElementById("title-wrap").classList.add("disabled")
    };
    document.getElementById("options").addEventListener("click", function () {
        self.port.emit("openPrefs");
    })

};