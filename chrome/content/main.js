var wide;

function checkWide() {
    if (!document.getElementById('narrow_column')) return;
    if (wide != (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0)) {
        wide = !wide;
        if (wide) {
            document.getElementById('wide_column').classList.add('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'absolute';
        } else {
            document.getElementById('wide_column').classList.remove('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'relative';
        }
    }
}

function initWide() {
    var contentID = document.getElementById('content').firstElementChild.id;
    var wideApplicable = (contentID == "profile" || contentID == "group" || contentID == "public");
    wide = (document.getElementById('narrow_column') && wideApplicable) ? (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0) : true;
    if (wide && wideApplicable) {
        document.getElementById('wide_column').classList.add('wide');
        document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'absolute';
    }
    if (wideApplicable) {
        window.addEventListener('scroll', checkWide);
        window.addEventListener('resize', checkWide);
        window.addEventListener('mousedown', checkWide);
        window.addEventListener('load', checkWide)
    } else {
        window.removeEventListener('scroll', checkWide);
        window.removeEventListener('resize', checkWide);
        window.removeEventListener('mousedown', checkWide);
        window.removeEventListener('load', checkWide)
    }
}

var injectEnd = document.createElement('script');
injectEnd.type = 'text/javascript';
injectEnd.src = chrome.extension.getURL('content/injectEnd.js');

chrome.storage.local.get('enabled', function (item) {
    if (item.enabled) {
        document.body.appendChild(injectEnd);

        initWide();

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.action == 'updating') {
                initWide();
            }
        });

        var leftMenuObserver = new MutationObserver(function (m) {
            LocalizedContent.updateMenu();
        });
        leftMenuObserver.observe(document.querySelector('#side_bar_inner ol'), {childList: true});
    }
});