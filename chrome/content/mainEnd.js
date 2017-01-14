var wide;

function checkWide() {
    if (!document.getElementById('narrow_column')) return;
    if (wide != (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0)) {
        wide = !wide;
        var thumbs;
        if (wide) {
            document.getElementById('wide_column').classList.add('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'absolute';

            if (isFirefox) {
                thumbs = [].slice.call(document.getElementsByClassName('oldvk-resized'));
                thumbs.forEach(function (element) {
                    Zoom.plus(element);
                    Array.prototype.forEach.call(element.childNodes, function (node) {
                        Zoom.plus(node)
                    });
                    element.classList.remove('oldvk-resized')
                });
                thumbs = [].slice.call(document.getElementsByClassName('oldvk-resized-gif'));
                thumbs.forEach(function (element) {
                    Zoom.plus_d(element.getElementsByClassName('page_doc_photo_href')[0]);
                    Zoom.plus(element.getElementsByClassName('page_doc_photo')[0]);
                    Zoom.plus(element.getElementsByClassName('page_doc_photo_href')[0]);
                    element.classList.remove('oldvk-resized-gif');
                })
            }

        } else {
            document.getElementById('wide_column').classList.remove('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'relative';

            if (isFirefox) {
                thumbs = [].slice.call(document.getElementsByClassName('page_post_sized_thumbs'));
                thumbs.forEach(function (element) {
                    if ((element.getBoundingClientRect().top + document.body.scrollTop) <= topStop) {
                        Zoom.minus(element);
                        [].forEach.call(element.childNodes, function (node) {
                            Zoom.minus(node)
                        });
                        element.classList.add('oldvk-resized')
                    }
                });
                thumbs = Array.prototype.slice.call(document.getElementsByClassName('page_gif_large'));
                thumbs.forEach(function (element) {
                    if ((element.getBoundingClientRect().top + document.body.scrollTop) <= topStop) {
                        Zoom.minus_d(element.getElementsByClassName('page_doc_photo_href')[0]);
                        Zoom.minus(element.getElementsByClassName('page_doc_photo')[0]);
                        Zoom.minus(element.getElementsByClassName('page_doc_photo_href')[0]);
                        element.classList.add('oldvk-resized-gif');
                    }
                })
            }
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
                setTimeout(function () {
                    initWide()
                }, 500); // TODO: Найти лучшее решение
            }
        });

        var leftMenuObserver = new MutationObserver(function (m) {
            LocalizedContent.updateMenu();
        });
        leftMenuObserver.observe(document.querySelector('#side_bar_inner ol'), {childList: true});
    }
});