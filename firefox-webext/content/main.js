var wide;

function checkWide() {
    if (wide != (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0)) {
        wide = !wide;
        var thumbs;
        if (wide) {
            document.getElementById('wide_column').classList.add('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'absolute';

            thumbs = Array.prototype.slice.call(document.getElementsByClassName('oldvk-resized'));
            Array.prototype.forEach.call(thumbs, function(element){
                Zoom.plus(element);
                Array.prototype.forEach.call(element.childNodes,function (node) {
                    Zoom.plus(node)
                });
                element.classList.remove('oldvk-resized')
            });

            thumbs = Array.prototype.slice.call(document.getElementsByClassName('oldvk-resized-gif'));
            Array.prototype.forEach.call(thumbs, function(element){
                Zoom.plus_d(element.getElementsByClassName('page_doc_photo_href')[0]);
                Zoom.plus(element.getElementsByClassName('page_doc_photo')[0]);
                Zoom.plus(element.getElementsByClassName('page_doc_photo_href')[0]);
                element.classList.remove('oldvk-resized-gif');
            })
        } else {
            document.getElementById('wide_column').classList.remove('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'relative';

            thumbs = document.getElementsByClassName('page_post_sized_thumbs');

            Array.prototype.forEach.call(thumbs, function(element){
                if ((element.getBoundingClientRect().top + document.body.scrollTop) <= topStop) {
                    Zoom.minus(element);
                    Array.prototype.forEach.call(element.childNodes,function (node) {
                        Zoom.minus(node)
                    });
                    element.classList.add('oldvk-resized')
                }
            });

            thumbs = document.getElementsByClassName('page_gif_large');

            Array.prototype.forEach.call(thumbs, function(element){
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
injectEnd.setAttribute('type', 'text/javascript');
injectEnd.innerHTML = 'updateNarrow=function(){};updateLeftMenu=function(){};TopNotifier.tnCount="oldvk-notify";TopNotifier.tnLink="oldvk-notify-wrap";if(getAudioPlayer()._currentAudio)removeClass(ge("oldvk_top_play"),"oldvk-hide");window.addEventListener("message",function(m){if(m.data.split(":")[0]=="q_staudio_v10_pl"&&getAudioPlayer()._currentAudio)removeClass(ge("oldvk_top_play"),"oldvk-hide");if(getAudioPlayer()._isPlaying)addClass(ge("oldvk_top_play"),"active");else removeClass(ge("oldvk_top_play"),"active")});var sfi=setFavIcon;setFavIcon=function(){console.log(arguments);if(arguments[0].search(/fav_logo\.ico/i) != -1) {arguments[0]="/images/favicon.ico"}sfi.apply(this,arguments)}';

chrome.storage.local.get('enabled', function (item) {
    if (item.enabled) {
        console.log('main.js');
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