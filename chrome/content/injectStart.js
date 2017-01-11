(function vkwait() {
    if (typeof vk !== "undefined") {
        window.postMessage({type: "VK_INFO", text: {lang: vk.lang}}, "*");
    } else {
        setTimeout(function () {
            vkwait();
        }, 4)
    }
})();

(function emojiwait() {
    if (typeof Emoji !== "undefined") {
        Emoji.curEmojiRecent = Emoji.emojiGetRecentFromStorage();
        var emoji = Emoji.getRecentEmojiSorted().map(function (e) {
            return Emoji.getEmojiHTML(e, Emoji.codeToChr(e), true)
        });
        window.postMessage({type: "VK_EMOJI", text: {emoji: Emoji.getRecentEmojiSorted(), html: emoji}}, "*");
    } else {
        setTimeout(function () {
            emojiwait()
        }, 4)
    }
})();

function newsMenuTabs(element) {
    if (element.id == 'ui_rmenu_news') {
        document.getElementById('feed_rmenu').classList.remove('unshown');
        var selected = document.querySelector('#ui_rmenu_news_list .ui_rmenu_item_sel');
        if (selected) selected.classList.remove('ui_rmenu_item_sel')
    }
    else if (element.classList.contains('ui_tab')) document.getElementById('feed_rmenu').classList.add('unshown');
    else {
        selected = document.querySelector('#oldvk-news-tabs .ui_rmenu_item_sel');
        if (selected) selected.classList.remove('ui_rmenu_item_sel')
    }
}