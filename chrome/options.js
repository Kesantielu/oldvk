function flUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!window.browser)
    window.browser = window.msBrowser || window.chrome;

var checkboxes = document.querySelectorAll('input[type="checkbox"]');
var labels = document.querySelectorAll('label.option');
var options = {};

Array.prototype.forEach.call(document.querySelectorAll('[data-l10n-id]'), function (item) {
    item.textContent = browser.i18n.getMessage(item.dataset.l10nId)
});

function submitOptions() {
    [].map.call(checkboxes, function (item) {
        options['option' + flUpperCase(item.id)] = item.checked
    });
    browser.storage.local.set(options);
    var status = document.getElementById('status');
    status.textContent = browser.i18n.getMessage('saved');
    status.classList.add('hide');
    setTimeout(function () {
        status.textContent = '';
        status.classList.remove('hide')
    }, 1500)
}

[].map.call(checkboxes, function (checkbox) {
    checkbox.addEventListener('change', submitOptions)
});

browser.storage.local.get(function (items) {
    options = items;
    [].map.call(checkboxes, function (item) {
        item.checked = options['option' + flUpperCase(item.id)]
    });
});