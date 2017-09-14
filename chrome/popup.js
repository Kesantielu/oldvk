if (!window.browser)
    window.browser = window.msBrowser || window.chrome;

var isFirefox = typeof InstallTrigger !== 'undefined';

var isWebExt = typeof browser !== 'undefined' && typeof browser.extension !== 'undefined';

window.onload = isWebExt ? function () {
    document.title = browser.i18n.getMessage("appName");
    document.getElementById("title").textContent = browser.i18n.getMessage("appName");
    document.getElementById("version").textContent = browser.i18n.getMessage("styleVersion");
    document.getElementById("version_number").textContent = browser.runtime.getManifest().version;
    document.getElementById("developing").textContent = browser.i18n.getMessage("developing");
    document.getElementById("support").textContent = browser.i18n.getMessage("support");
    browser.storage.local.get("enabled", function (item) {
        document.getElementById("enabled").checked = item.enabled;
        if (!item.enabled) {
            document.getElementById("title-wrap").classList.add("disabled");
        }
    });
    document.getElementById("enabled").title = browser.i18n.getMessage("enabled");
    document.getElementById("enabled").onchange = function () {
        browser.storage.local.set({enabled: this.checked});
        if (this.checked) document.getElementById("title-wrap").classList.remove("disabled");
        else document.getElementById("title-wrap").classList.add("disabled")
    }
} : function () {
    document.getElementById("version_number").innerHTML = self.options.version;
    self.port.on('enabled', function (e) {
        document.getElementById("enabled").checked = e;
        if (!e) {
            document.getElementById("title-wrap").classList.add("disabled");
        }
    });
    document.getElementById("enabled").onchange = function (e) {
        self.port.emit('enabled', e.target.checked);
        if (this.checked) document.getElementById("title-wrap").classList.remove("disabled");
        else document.getElementById("title-wrap").classList.add("disabled")
    }
};