function save() {
    chrome.storage.local.set({
        optionCover: document.getElementById('cover').checked,
        optionViewer: document.getElementById('viewer').checked,
        optionFont: document.getElementById('font').checked,
        optionAudio: document.getElementById('audio').checked
    });
    document.getElementById('status').textContent = chrome.i18n.getMessage('saved');
    document.getElementById('status').classList.add('hide');
    setTimeout(function () {
        document.getElementById('status').textContent = '';
        document.getElementById('status').classList.remove('hide')
    }, 1500)

}

function restore() {
    chrome.storage.local.get({
        optionCover: false,
        optionViewer: false,
        optionFont: false,
        optionAudio: false
    }, function (items) {
        document.getElementById('cover').checked = items.optionCover;
        document.getElementById('viewer').checked = items.optionViewer;
        document.getElementById('font').checked = items.optionFont;
        document.getElementById('audio').checked = items.optionAudio;
    })
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('save').textContent = chrome.i18n.getMessage('save');
document.getElementById('cover_label').innerHTML += chrome.i18n.getMessage('option_cover');
document.getElementById('viewer_label').innerHTML += chrome.i18n.getMessage('option_viewer');
document.getElementById('font_label').innerHTML += chrome.i18n.getMessage('option_font');
document.getElementById('audio_label').innerHTML += chrome.i18n.getMessage('option_audio');