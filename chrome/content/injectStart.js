if (oldvk.fox) {
    (function (history) {
        var pushState = history.pushState;
        history.pushState = function (state) {
            window.postMessage({type: "PUSH_URL", text: arguments[2].slice(1)}, "*");
            return pushState.apply(history, arguments);
        }
    })(window.history);
}

var nothing = function () {
};

function waitVar(variable, callback) {
    if (typeof window[variable] !== "undefined")
        callback();
    else setTimeout(function () {
        waitVar(variable, callback)
    }, 0)
}

function watchVar(variable, callback) {
    if (typeof window[variable] === 'undefined') {
        Object.defineProperty(window, variable, {
            get: function () {
                return window['_oldvk_' + variable]
            },
            set: function (value) {
                window['_oldvk_' + variable] = value;
                if (callback)
                    callback(window['_oldvk_' + variable]);
            }, enumerable: true
        })
    } else {
        callback(window[variable]);
    }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function _getPhotoSize() {
    if (localStorage.getItem('oldvk_pvLarge') !== '1')
        return 'x';

    switch (cur.pvVeryBig) {
        case 3:
            return "w";
            break;
        case 2:
        case 1:
            return "z";
            break;
        default:
            return "y"
    }
}


function pvSwitch() {
    if (localStorage.getItem('oldvk_pvDark') !== '1') {
        if (oldvk.options.optionViewer)
            addClass(cur.pvBox, 'oldvk-dark');
        addClass(layerBG, 'oldvk-dark');
        localStorage.setItem('oldvk_pvDark', '1');
        window.postMessage({type: "SAVE_OPTION", opt: {oldvk_pvDark: 1}}, "*");
    } else {
        removeClass(cur.pvBox, 'oldvk-dark');
        removeClass(layerBG, 'oldvk-dark');
        localStorage.setItem('oldvk_pvDark', '0');
        window.postMessage({type: "SAVE_OPTION", opt: {oldvk_pvDark: 0}}, "*");
    }
}

function _pvResize() {
    function r() {
        cur.pvCont.style.removeProperty('width');
        if (cur.pvPhoto.firstElementChild) {
            cur.pvPhoto.firstElementChild.style.removeProperty('max-height');
            cur.pvPhoto.firstElementChild.style.removeProperty('max-width');

        }
        if (cur.pvTagFrame.firstElementChild) {
            cur.pvTagFrame.firstElementChild.style.removeProperty('max-height');
            cur.pvTagFrame.firstElementChild.style.removeProperty('max-width');
        }
    }

    if (localStorage.getItem('oldvk_pvLarge') !== '1')
        return r();

    var nw = cur.pvCurData.width,
        nh = cur.pvCurData.height,
        cw = Math.min(Math.max(document.documentElement.clientWidth, 800), 1334),
        ch = Math.max(document.documentElement.clientHeight, 600);

    if (cur.pvPhoto.firstElementChild) {
        cur.pvPhoto.firstElementChild.style.setProperty('max-height', ch - 105 + 'px', 'important');
        cur.pvPhoto.firstElementChild.style.setProperty('max-width', cw - 54 + 'px', 'important');
    }
    if (cur.pvTagFrame.firstElementChild) {
        cur.pvTagFrame.firstElementChild.style.setProperty('max-height', ch - 105 + 'px', 'important');
        cur.pvTagFrame.firstElementChild.style.setProperty('max-width', cw - 54 + 'px', 'important');
    }

    var ratio = Math.min((cw - 54) / nw, (ch - 105) / nh, 1);
    cur.pvCont.style.setProperty('width', ratio * nw + 50 + 'px', 'important')

}

function pvSwitchSize() {
    if (localStorage.getItem('oldvk_pvLarge') !== '1') {
        addClass(ge('pv_ss_btn'), 'minus');
        addClass(cur.pvCont, 'big');
        addEventListener('resize', _pvResize);
        localStorage.setItem('oldvk_pvLarge', '1');
        window.postMessage({type: "SAVE_OPTION", opt: {oldvk_pvLarge: 1}}, "*");
        Photoview.show(false, cur.pvIndex);
    } else {
        removeClass(ge('pv_ss_btn'), 'minus');
        removeClass(cur.pvCont, 'big');
        removeEventListener('resize', _pvResize);
        localStorage.setItem('oldvk_pvLarge', '0');
        window.postMessage({type: "SAVE_OPTION", opt: {oldvk_pvLarge: 0}}, "*");
    }
    _pvResize()
}

watchVar('vk', function (vk) {
    window.postMessage({type: "VK_INFO", text: {lang: vk.lang}}, "*");
    if (vk.id === 0)
        document.head.classList.add('oldvk-not-logged');
});

watchVar('Photoview', function (Photoview) {
    if (!Photoview.createLayer.oldvk) {
        var cl = Photoview.createLayer;
        Photoview.createLayer = function () {
            cl.apply(this, arguments);
            var pv_switch_wrap = ce('div', {id: 'pv_switch_wrap', innerHTML: '<div id="pv_switch"></div>'});
            pv_switch_wrap.setAttribute('onclick', 'cancelEvent(event);pvSwitch();');
            layer.appendChild(pv_switch_wrap);
            if (localStorage.getItem('oldvk_pvDark') === '1') {
                if (oldvk.options.optionViewer)
                    addClass(cur.pvBox, 'oldvk-dark');
                addClass(layerBG, 'oldvk-dark');
            }
            if (!oldvk.options.optionViewer && cur.module !== 'marketplace') {
                addClass(layerWrap, 'oldvk');
                cur.pvImageWrap.insertBefore(cur.pvCounter, domFC(cur.pvImageWrap));
                cur.pvRightColumn = ce('div', {id: 'pv_right_column'});
                if (cur.pvNarrowColumnWrap)
                    cur.pvNarrowColumnWrap.appendChild(cur.pvRightColumn);
                cur.pvPhotoDate = ce('div', {id: 'pv_bottom_info_date'});
                cur.pvBottomLeft.appendChild(cur.pvPhotoDate);
                cur.pvBottomLike = ce('div', {id: 'pv_bottom_info_like'});
                cur.pvBottomLeft.appendChild(cur.pvBottomLike);
                if (document.documentElement.clientWidth >= 800 && cur.pvFSWrap) {
                    var pv_ss_btn = ce('div', {className: 'pv_fs_btn'});
                    pv_ss_btn.setAttribute('onclick', 'cancelEvent(event);');
                    pv_ss_btn.setAttribute('onmousedown', 'cancelEvent(event);cur.__mdEvent=event;pvSwitchSize();');
                    pv_ss_btn.appendChild(ce('div', {id: 'pv_ss_btn'}));
                    if (localStorage.getItem('oldvk_pvLarge') === '1') {
                        addClass(pv_ss_btn.firstElementChild, 'minus');
                        addClass(cur.pvCont, 'big');
                    }
                    cur.pvFSWrap.appendChild(pv_ss_btn);
                }
                Photoview.getPhotoSize = _getPhotoSize;
            }

        };
        Photoview.createLayer.oldvk = true;
    }
    if (!oldvk.options.optionViewer) {
        Photoview.updateVerticalPosition = nothing;
        Photoview.updatePhotoDimensions = nothing;
        if (!Photoview.show.oldvk) {
            var s = Photoview.show;
            Photoview.show = function () {
                s.apply(this, arguments);
                if (arguments[0] !== "temp") {
                    cur.pvCounter.textContent = getLang("photos_photo_num_of_N").replace("%s", cur.pvIndex + 1).replace(/%s|{count}/, cur.pvData[cur.pvListId].length);
                }
            };
            Photoview.show.oldvk = true
        }

        if (!Photoview.doShow.oldvk) {
            var ds = Photoview.doShow;
            Photoview.doShow = function () {
                ds.apply(this, arguments);
                if (cur.pvCanvas)
                    return;
                if (geByClass1('pv_author_block', cur.pvRightColumn))
                    cur.pvRightColumn.removeChild(geByClass1('pv_author_block', cur.pvRightColumn));
                if (geByClass1('pv_author_block')) {
                    cur.pvRightColumn.appendChild(geByClass1('pv_author_block'));
                    insertAfter(ge('pv_author_name'), cur.pvAlbumName);
                    var date_wrap = ce('div', {innerHTML: cur.pvCurPhoto.date});
                    date_wrap.firstChild.textContent = getLang('photos_added') + ' ' + date_wrap.firstChild.textContent;
                    if (cur.pvPhotoDate.firstChild)
                        cur.pvPhotoDate.removeChild(cur.pvPhotoDate.firstChild);
                    cur.pvPhotoDate.appendChild(date_wrap.firstChild);
                    cur.pvRightColumn.appendChild(cur.pvBottomActions);
                    cur.pvMoreActionsTooltip._opts.offset[1] = 12;
                    cur.pvMoreActionsTooltip._ttel = null;
                    cur.pvMoreActionsTooltip.build();
                    cur.pvBottomActions.insertBefore(ge('pv_more_act_download'), geByClass1('pv_actions_more'));

                    if (cur.pvBottomLike.firstChild)
                        cur.pvBottomLike.removeChild(cur.pvBottomLike.firstChild);
                    cur.pvBottomLike.appendChild(ge('pv_like'))
                }

                if (localStorage.getItem('oldvk_pvLarge') === '1') {
                    addEventListener('resize', _pvResize);
                    _pvResize()
                }
            };
            Photoview.doShow.oldvk = true
        }

        if (!Photoview.showTag.oldvk) {
            var st = Photoview.showTag;
            Photoview.showTag = function () {
                cur.pvPhWidth = cur.pvPhoto.firstElementChild.clientWidth;
                cur.pvPhHeight = cur.pvPhoto.firstElementChild.clientHeight;
                Photoview.updateTagFrameDimensions();
                st.apply(this, arguments);
                var p = cur.pvPhoto.firstElementChild.offsetTop + cur.pvTagInfo.clientHeight;
                var t = parseFloat(getComputedStyle(cur.pvCounter).marginTop) + cur.pvCounter.offsetHeight + p;
                setStyle(cur.pvTagFrame, 'top', t);
                setStyle(cur.pvTagPerson, 'top', t);
                setStyle(cur.pvTagFaded, 'top', p);
            };
            Photoview.showTag.oldvk = true
        }

        if (!Photoview.afterShow.oldvk) {
            var as = Photoview.afterShow;
            Photoview.afterShow = function () {
                as.apply(this, arguments);
                var h = cur.pvPhoto.firstElementChild.style.getPropertyValue('max-height');
                cur.pvTagFrame.firstElementChild.style.setProperty('max-height', h, 'important');
            };
            Photoview.afterShow.oldvk = true
        }

        if (!Photoview.hide.oldvk) {
            var h = Photoview.hide;
            Photoview.hide = function () {
                removeEventListener('resize', _pvResize);
                h.apply(this, arguments);
            };
            Photoview.hide.oldvk = true
        }
    }
});

watchVar('Emoji', function (Emoji) {
    Emoji.curEmojiRecent = Emoji.emojiGetRecentFromStorage();
    var emoji = Emoji.getRecentEmojiSorted().map(function (e) {
        return Emoji.getEmojiHTML(e, Emoji.codeToChr(e), true)
    });
    window.postMessage({type: "VK_EMOJI", text: {emoji: Emoji.getRecentEmojiSorted(), html: emoji}}, "*");
});

watchVar('TopNotifierCur', function (TopNotifierCur) {
    TopNotifierCur.count = "oldvk-notify";
    TopNotifierCur.link = "oldvk-notify-wrap";
});

watchVar('SPE', function (SPE) {
    if (!SPE.init.oldvk) {
        var i = SPE.init;
        SPE.init = function () {
            i.apply(this, arguments);
            setStyle(geByClass1('pe_canvas'), 'marginTop', cur.pvPhoto.firstElementChild.offsetTop)
        };
        SPE.init.oldvk = true
    }
});

watchVar('onLoginDone', function () {
    if (typeof _oldvk_onLoginDone !== 'undefined' && !_oldvk_onLoginDone.oldvk) {
        var o = _oldvk_onLoginDone;
        _oldvk_onLoginDone = function () {
            o.apply(this, arguments);
            removeClass(document.head, 'oldvk-not-logged');
            window.postMessage({type: "RELOAD_VK_TOP"}, "*");
        };
        _oldvk_onLoginDone.oldvk = true
    }

});

watchVar('AudioUtils', function (AudioUtils) {
    if (!AudioUtils.getAudioFromEl.oldvk) {
        var g = AudioUtils.getAudioFromEl;
        AudioUtils.getAudioFromEl = function () {
            var r = g.apply(this, arguments);
            if (r.hasOwnProperty('withInlinePlayer'))
                r.withInlinePlayer = true;
            return r
        };
        AudioUtils.getAudioFromEl.oldvk = true
    }
});

watchVar('__leftMenu', function (__leftMenu) {
    __leftMenu.handleUpdateRequest = nothing;
    // TODO: Покопать дальше, функция срабатывает недостаточно рано
});

function _bind(variable, func, before, after) { // TODO: Переписать функции с учетом этого
    if (!variable[func].oldvk) {
        var tmp = variable[func];
        variable[func] = function () {
            var args = arguments;
            if (before)
                args = before(arguments);
            var r = tmp.apply(this, args);
            if (after)
                r = after(r);
            return r
        }
    }
    variable[func].oldvk = true
}

/*var jsObserver = new MutationObserver(function (ms) {
 ms.forEach(function (m) {
 m.addedNodes.forEach(function (n) {
 if (n.nodeName == 'SCRIPT') {
 var js = n.src.match(/[^/\\&\?]+\.js(?=([\?&].*$|$))/);
 if (js && bindSF.hasOwnProperty(js[0]))
 bindSF[js[0]]()
 }
 })
 });
 });

 jsObserver.observe(document.head, {childList: true});*/

function newsMenuTabs(element) {
    if (element.id === 'ui_rmenu_news') {
        document.getElementById('feed_rmenu').classList.remove('unshown');
        document.getElementById('submit_post_box').classList.remove('unshown');
        var selected = document.querySelector('#ui_rmenu_news_list .ui_rmenu_item_sel');
        if (selected) selected.classList.remove('ui_rmenu_item_sel')
    }
    else if (element.classList.contains('ui_tab')) {
        document.getElementById('feed_rmenu').classList.add('unshown');
        document.getElementById('submit_post_box').classList.add('unshown')
    }
    else {
        selected = document.querySelector('#oldvk-news-tabs .ui_rmenu_item_sel');
        if (selected) selected.classList.remove('ui_rmenu_item_sel')
    }
}