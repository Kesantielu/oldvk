function flUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!window.browser)
    window.browser = window.msBrowser || window.chrome;

var checkboxes = document.querySelectorAll('input[type="checkbox"]');
var options = {};

document.getElementById('options').addEventListener('submit', function (e) {
    e.preventDefault();
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
});

browser.storage.local.get(function (items) {
    options = items;
    [].map.call(checkboxes, function (item) {
        item.checked = options['option' + flUpperCase(item.id)]
    });
});

document.getElementById('save').textContent = browser.i18n.getMessage('save');
var labels = document.querySelectorAll('label.option');
[].map.call(labels, function (label) {
    label.textContent = browser.i18n.getMessage('option_' + label.getAttribute('for'))
});