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

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function pvSwitch() {
    if (localStorage.getItem('oldvk_pvDark') !== '1') {
        if (oldvk.options.optionViewer)
            addClass(cur.pvBox, 'oldvk-dark');
        addClass(layerBG, 'oldvk-dark');
        localStorage.setItem('oldvk_pvDark', '1')
    } else {
        removeClass(cur.pvBox, 'oldvk-dark');
        removeClass(layerBG, 'oldvk-dark');
        localStorage.setItem('oldvk_pvDark', '0')
    }
}

const bindSF = {
    "photoview.js": function () {
        waitVar('Photoview', function () {
            if (!Photoview.createLayer.oldvk) {
                var cl = Photoview.createLayer;
                Photoview.createLayer = function () {
                    cl.apply(this, arguments);
                    var pv_switch_wrap = ce('div', {id: 'pv_switch_wrap', innerHTML: '<div id="pv_switch"></div>'});
                    pv_switch_wrap.setAttribute('onclick', 'cancelEvent(event);pvSwitch();');
                    layer.appendChild(pv_switch_wrap);
                    if (localStorage.getItem('oldvk_pvDark') == '1') {
                        if (oldvk.options.optionViewer)
                            addClass(cur.pvBox, 'oldvk-dark');
                        addClass(layerBG, 'oldvk-dark');
                    }
                    if (!oldvk.options.optionViewer) {
                        addClass(layerWrap, 'oldvk');
                        cur.pvImageWrap.insertBefore(cur.pvCounter, domFC(cur.pvImageWrap));
                        cur.pvRightColumn = ce('div', {id: 'pv_right_column', classList: 'fl_r'});
                        cur.pvPhotoWrap.appendChild(cur.pvRightColumn);
                        cur.pvPhotoDate = ce('div', {id: 'pv_bottom_info_date'});
                        cur.pvBottomLeft.appendChild(cur.pvPhotoDate);
                        cur.pvBottomLike = ce('div', {id: 'pv_bottom_info_like'});
                        cur.pvBottomLeft.appendChild(cur.pvBottomLike)
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
                        if (arguments[0] != "temp") {
                            cur.pvCounter.textContent = getLang("photos_photo_num_of_N").replace("%s", cur.pvIndex + 1).replace(/%s|\{count}/, cur.pvData[cur.pvListId].length);
                        }
                    };
                    Photoview.show.oldvk = true
                }
                if (!Photoview.doShow.oldvk) {
                    var ds = Photoview.doShow;
                    Photoview.doShow = function () {
                        ds.apply(this, arguments);
                        while (cur.pvRightColumn.lastChild) {
                            cur.pvRightColumn.removeChild(cur.pvRightColumn.lastChild);
                        }
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
                            cur.pvMoreActionsTooltip.build();
                            cur.pvBottomActions.insertBefore(ge('pv_more_act_download'), geByClass1('pv_actions_more'));
                            if (cur.pvBottomLike.firstChild)
                                cur.pvBottomLike.removeChild(cur.pvBottomLike.firstChild);
                            cur.pvBottomLike.appendChild(ge('pv_like'))
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

            }

        })
    },
    "emoji.js": function () {
        waitVar('Emoji', function () {
            Emoji.curEmojiRecent = Emoji.emojiGetRecentFromStorage();
            var emoji = Emoji.getRecentEmojiSorted().map(function (e) {
                return Emoji.getEmojiHTML(e, Emoji.codeToChr(e), true)
            });
            window.postMessage({type: "VK_EMOJI", text: {emoji: Emoji.getRecentEmojiSorted(), html: emoji}}, "*");
        })
    },
    "audioplayer.js": function () {
        waitVar('AudioPlayer', function () {

        });
    },
    "spe.js": function () {
        waitVar('SPE', function () {
            if (!SPE.init.oldvk) {
                var i = SPE.init;
                SPE.init = function () {
                    i.apply(this, arguments);
                    setStyle(geByClass1('pe_canvas'), 'marginTop', cur.pvPhoto.firstElementChild.offsetTop)
                };
                SPE.init.oldvk = true
            }
        })
    }
};

waitVar('vk', function () {
    window.postMessage({type: "VK_INFO", text: {lang: vk.lang}}, "*");
});

waitVar('StaticFiles', function () {
    var keys = Object.keys(bindSF);
    for (var i = keys.length; i--;) {
        if (StaticFiles.hasOwnProperty(keys[i]))
            bindSF[keys[i]]()
    }
});

console.time('inj');
console.time('st');

waitVar('Inj', function () {
    console.timeEnd('inj')
});


waitVar('stManager', function () {
    console.timeEnd('st');

    if (typeof vkopt !== 'undefined' && typeof Inj !== 'undefined') {
        console.log(Inj.BeforeR);
    }

    var a = stManager.add;
	stManager.add = function () {
            a.apply(this, arguments);
            var keys = Object.keys(bindSF);
            for (var i = keys.length; i--;) {
                if (arguments[0].indexOf(keys[i]) != -1)
                    bindSF[keys[i]]()
            }
    }
});

function newsMenuTabs(element) {
    if (element.id == 'ui_rmenu_news') {
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