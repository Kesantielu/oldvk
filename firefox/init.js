const {ToggleButton} = require('sdk/ui/button/toggle');
const {PageMod} = require('sdk/page-mod');
var prefs = require('sdk/simple-prefs').prefs;
var opts = require('sdk/simple-storage').storage;
const {Panel} = require('sdk/panel');
var _ = require('sdk/l10n').get;
const Prefs = require('sdk/preferences/service');
const {getMostRecentBrowserWindow} = require('sdk/window/utils');
var self = require('sdk/self');

if (Prefs.has('dom.promise.enabled'))
    Prefs.set('dom.promise.enabled', true);

var button = ToggleButton({
    id: 'oldvk-button',
    label: _('appName'),
    icon: {
        "16": './oldvk-16.png',
        "32": './oldvk-32.png'
    },
    onChange: handleChange
});

var panel = Panel({
    width: 220,
    height: 140,
    contentURL: './popup.html',
    contentScriptFile: './popup.js',
    contentScriptOptions: {version: self.version},
    onHide: handleHide
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        })
    }
}

function handleHide() {
    button.state('window', {checked: false});
}

panel.port.on('enabled', function (e) {
    enableExt(e)
});

panel.port.emit('enabled', prefs['enabled']);

var vkPage;
var vkPage1;

function enableExt(state) {
    prefs['enabled'] = state;
    if (state) {
        vkPage = PageMod(options);
        vkPage1 = PageMod(options1);
    }
    else {
        if (vkPage) vkPage.destroy();
        vkPage = null;
        if (vkPage1) vkPage1.destroy();
        vkPage1 = null;
    }
}

var options = {
    include: '*.vk.com',
    contentScriptFile: ['./lib.js', './mainStart.js'],
    contentScriptWhen: 'start',
    contentStyleFile: ['./main.css', './local.css', './fox.css'],
    contentScriptOptions: {
        inject: self.data.url('injectStart.js'),
        optionCover: prefs.optionCover,
        optionViewer: prefs.optionViewer,
        optionFont: prefs.optionFont,
        optionAudio: prefs.optionAudio
    },
    onAttach: function (page) {
        page.port.emit('options', Object.assign(prefs, opts));
        page.port.on('local', function (o) {
            for (var opt in o)
                if (o.hasOwnProperty(opt))
                    opts[opt] = o[opt]
        });
    },
    exclude: /^.*vk\.com\/(notifier\.php|al_.*\.php|dev\/|apps\?act=manage|upload_fails\.php|ads_rotate\.php|share\.php|adscreate$|adscreate\?|wkview\.php|bugs$|bugs\?|q_frame\.php|.*upload\.php|login\.php|about|jobs|.*\.svg|widget_.*\.php).*$/
};

var options1 = {
    include: '*.vk.com',
    contentScriptFile: ['./lib.js', './mainEnd.js'],
    contentScriptWhen: 'ready',
    contentScriptOptions: {inject: self.data.url('injectEnd.js')},
    onAttach: function (page) {
        page.port.emit('options', Object.assign(prefs, opts));
    },
    exclude: /^.*vk\.com\/(notifier\.php|al_.*\.php|dev\/|apps\?act=manage|upload_fails\.php|ads_rotate\.php|share\.php|adscreate$|adscreate\?|wkview\.php|bugs$|bugs\?|q_frame\.php|.*upload\.php|login\.php|about|jobs|.*\.svg|widget_.*\.php).*$/
};

if (prefs['enabled']) {
    vkPage = PageMod(options);
    vkPage1 = PageMod(options1);
}

panel.port.on('openPrefs', function () {
    getMostRecentBrowserWindow().BrowserOpenAddonsMgr('addons://detail/' + self.id + '/preferences');
});