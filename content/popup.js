const enableCheckbox = document.getElementById('enabled');

function updateStyle() {
    enableCheckbox.checked ? document.body.classList.add('enabled') : document.body.classList.remove('enabled');
}

function changeEnabled() {
    isWebExt ? browser.storage.local.set({enabled: this.checked}) : self.port.emit('enabled', this.target.checked);
    updateStyle();
}

document.getElementById('version_number').textContent =
    isWebExt ? browser.runtime.getManifest().version : self.options.version;

if (isWebExt) {
    localize();
    browser.storage.local.get('enabled', ({enabled}) => {
        enableCheckbox.title = browser.i18n.getMessage('enable');
        enableCheckbox.checked = enabled;
        document.getElementById('options').href = browser.runtime.getURL('content/options.html');
    });
} else {
    self.port.on('enabled', e => enableCheckbox.checked = e);
    document.getElementById('options').onclick = () => self.port.emit('openPrefs');
}
enableCheckbox.onchange = changeEnabled;
updateStyle();
