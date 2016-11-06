function save() {
    chrome.storage.local.set({
        optionCover: document.getElementById('cover').checked
    });
    document.getElementById('status').innerHTML = chrome.i18n.getMessage('saved');
    document.getElementById('status').classList.add('hide');
    setTimeout(function () {
        document.getElementById('status').innerHTML = '';
        document.getElementById('status').classList.remove('hide')
    }, 1500)

}

function restore() {
    chrome.storage.local.get({
        optionCover: false
    }, function (items) {
        document.getElementById('cover').checked = items.optionCover;
    })
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('save').innerHTML = chrome.i18n.getMessage('save');
document.getElementById('cover_label').innerHTML += chrome.i18n.getMessage('option_cover');