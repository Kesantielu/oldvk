function flUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!window.browser)
    window.browser = window.msBrowser || window.chrome;

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const labels = document.querySelectorAll('label.option');
const layout = document.getElementById('layout');
const status_ = document.getElementById('status');
let options = {};

[].forEach.call(document.querySelectorAll('[data-l10n-id]'), item =>
    item.textContent = browser.i18n.getMessage(item.dataset.l10nId)
);

function setStatus(text, error) {
    status_.textContent = text;
    status_.classList.remove('hide');
    if (error)
        status_.classList.add('error')
    else
        setTimeout(() => status_.classList.add('hide'), 20)
}

function submitOptions() {
    [].map.call(checkboxes, function (item) {
        options['option' + flUpperCase(item.id)] = item.checked
    });
    browser.storage.local.set(options);
    setStatus(browser.i18n.getMessage('saved'));
}

[].map.call(checkboxes, checkbox => checkbox.addEventListener('change', submitOptions));

layout.addEventListener('change', function () {
    browser.storage.local.set({layout: layout.value});
    setStatus(layout.value + 'px');
    browser.tabs.query({active: true, url: '*://vk.com/*'}, function (tabs) {
        tabs.forEach(function (tab) {
            browser.tabs.sendMessage(tab.id, {action: 'layout', value: layout.value}, result => {
                if (chrome.runtime.lastError) {
                    console.warn('Layout: ' + chrome.runtime.lastError.message);
                    setStatus(browser.i18n.getMessage('reload'), true);
                }
            })
        })
    })
});

browser.storage.local.get(items => {
    options = items;
    [].map.call(checkboxes, item => item.checked = options['option' + flUpperCase(item.id)]);
    layout.value = items.layout ? items.layout : layout.min;
});