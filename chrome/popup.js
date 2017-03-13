var isFirefox = typeof InstallTrigger !== 'undefined';

var isWebExt = typeof chrome !== 'undefined' && typeof chrome.extension !== 'undefined';

window.onload = isWebExt ? function () {
        document.title = chrome.i18n.getMessage("appName");
        document.getElementById("title").textContent = chrome.i18n.getMessage("appName");
        document.getElementById("version").textContent = chrome.i18n.getMessage("styleVersion");
        document.getElementById("version_number").textContent = isFirefox ? "0.53.7" : chrome.app.getDetails().version;
        document.getElementById("developing").textContent = chrome.i18n.getMessage("developing");
        document.getElementById("support").textContent = chrome.i18n.getMessage("support");
        chrome.storage.local.get("enabled", function (item) {
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