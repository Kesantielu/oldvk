let oldvk = {};
oldvk.options = JSON.parse(document.getElementsByName('oldvk')[0].textContent);

console.log('injectStart', performance.now());

if (oldvk.options.fox) {
    (function (history) {
        const pushState = history.pushState;
        history.pushState = function (state) {
            window.postMessage({type: "PUSH_URL", text: arguments[2].slice(1)}, "*");
            return pushState.apply(history, arguments);
        }
    })(window.history);
}

const nothing = () => {
};

function waitVar(variable, callback) {              // Альтернативный вариант наблюдения за появлением переменных
    if (typeof window[variable] !== "undefined")
        callback();
    else setTimeout(() => waitVar(variable, callback), 0)
}

function watchVarOld(variable, callback) {             // Наблюдение за появлением нужных переменных
    if (typeof window[variable] === 'undefined') {  // и привязка к ним функций однократно
        Reflect.defineProperty(window, variable, {
            get: function () {
                return window['_oldvk_' + variable] // Иначе вызовет зацикливание 
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

function watchVar(variable, callback) {         // Наблюдение за появлением нужных переменных         
    if (typeof window[variable] !== 'undefined') {   // и привязка к ним функций постоянно
        callback(window[variable]);
        if (typeof window['_oldvk_' + variable] === 'undefined') // Иначе можно потерять наблюдение,
            window['_oldvk_' + variable] = window[variable];    //  если вспомогательная переменная уже определена
    }

    Reflect.defineProperty(window, variable, {
        get: function () {
            return window['_oldvk_' + variable]
        },
        set: function (value) {
            window['_oldvk_' + variable] = value;
            if (callback)
                callback(window['_oldvk_' + variable]);
        }, enumerable: true
    })
}

function monkey(variable, prop, before, after) {    // Monkey Patching. (Переменная; ее свойство; 
    if (variable === window && window.hasOwnProperty('_oldvk_' + prop)) // Иначе вызовет зацикливание 
        prop = '_oldvk_' + prop;
    if (!variable[prop].oldvk) {                    // функция, исполняемая до вызова оригинальной;
        const tmp = variable[prop];                 // функция, исполняемая после вызова оригинальной)
        variable[prop] = function () {
            let args = arguments;
            if (before)
                args = before(arguments) || args;   // Функция может модифицировать аргументы
            let r = tmp.apply(this, args);
            if (after)
                r = after(r, arguments) || r;       // Функция может модифицировать вывод оригинальной функции
            return r
        }
    }
    variable[prop].oldvk = true
}


function watchProp(obj, prop, callback) {  // Функция мониторинга установки свойств объекта (WIP)                            
    if (!obj.oldvkList) {                  // Возвращает Proxy, который нужно присвоить исходному объекту
        obj.oldvkList = {};
        if (typeof prop === 'object')      // Свойства можно задавать объектом в формате {property: callback, ...}
            obj.oldvkList = prop
        else
            obj.oldvkList[prop] = callback;
        return new Proxy(obj, {
            set(target, key, val) {
                if (obj.oldvkList.hasOwnProperty(key)) {
                    obj.oldvkList[key](val);
                }
                return Reflect.set(obj, key, val);
                ;
            },
            deleteProperty(target, key) {
                return Reflect.deleteProperty(obj, key);
            }
        })
    } else {                                // Если объект уже проксифицирован, то просто добавляем свойства в список вызова
        if (typeof prop === 'object')
            obj.oldvkList = Object.assign(obj.oldvkList, prop)
        else
            obj.oldvkList[prop] = callback;
        return obj;
    }
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
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
            cur.pvBox.classList.add('oldvk-dark');
        layerBG.classList.add('oldvk-dark');
        localStorage.setItem('oldvk_pvDark', '1');
        window.postMessage({type: "SAVE_OPTION", opt: {oldvk_pvDark: 1}}, "*");
    } else {
        cur.pvBox.classList.remove('oldvk-dark');
        layerBG.classList.remove('oldvk-dark');
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
        Photoview.updatePhotoTagsContainerDimensions();
    }

    if (!cur.pvCurData)
        return;

    if (localStorage.getItem('oldvk_pvLarge') !== '1')
        return r();

    const nw = cur.pvCurData.width,
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

    const ratio = Math.min((cw - 54) / nw, (ch - 105) / nh, 1);
    cur.pvCont.style.setProperty('width', ratio * nw + 50 + 'px', 'important');
    Photoview.updatePhotoTagsContainerDimensions();
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
    console.log('vk', performance.now());
    window.postMessage({type: "VK_INFO", text: {lang: vk.lang}}, "*");
    if (vk.id === 0)
        document.head.classList.add('oldvk-not-logged');
});

/*watchVar('cur', function (cur) {
    _oldvk_cur = watchProp(cur,'lang', function(lang) {
        window.postMessage({type: "CUR_LANG", lang: lang}, "*");
    });
});*/

watchVar('Photoview', function (Photoview) {

    monkey(Photoview, 'createLayer', null, () => {
        const pv_switch_wrap = ce('div', {id: 'pv_switch_wrap', innerHTML: '<div id="pv_switch"></div>'});
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
            Photoview.getPhotoSize = _getPhotoSize
        }
    });

    if (!oldvk.options.optionViewer) {
        //Photoview.updateVerticalPosition = nothing;
        //Photoview.updatePhotoDimensions = nothing;

        monkey(Photoview, 'updatePhotoDimensions', null, () => {
            _pvResize()
        });

        //monkey(Photoview, 'updatePhotoTagsContainerDimensions', () => {console.log(this)});

        monkey(Photoview, 'show', null, (r, args) => {
            if (args[0] !== "temp")
                cur.pvCounter.textContent = getLang("photos_photo_num_of_N").replace("%s", cur.pvIndex + 1).replace(/%s|{count}/, cur.pvData[cur.pvListId].length);
        });

        monkey(Photoview, 'doShow', null, () => {
            if (cur.pvCanvas)
                return;
            if (geByClass1('pv_author_block', cur.pvRightColumn))
                cur.pvRightColumn.removeChild(geByClass1('pv_author_block', cur.pvRightColumn));
            if (geByClass1('pv_author_block')) {
                cur.pvRightColumn.appendChild(geByClass1('pv_author_block'));
                insertAfter(ge('pv_author_name'), cur.pvAlbumName);
                const date_wrap = ce('div', {innerHTML: cur.pvCurPhoto.date});
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
                cur.pvBottomLike.appendChild(document.querySelector('.pv_narrow_column_wrap .like_wrap'))
            }

            if (localStorage.getItem('oldvk_pvLarge') === '1') {
                addEventListener('resize', _pvResize);
                _pvResize()
            }
        });

        monkey(Photoview, 'afterShow', null, () => {
            const h = cur.pvPhoto.firstElementChild.style.getPropertyValue('max-height');
            cur.pvTagFrame.firstElementChild.style.setProperty('max-height', h, 'important');
            Photoview.updatePhotoTagsContainerDimensions();
        });

        monkey(Photoview, 'hide', () => {
            removeEventListener('resize', _pvResize)
        })
    }
});

watchVar('Emoji', function (Emoji) {
    Emoji.curEmojiRecent = Emoji.emojiGetRecentFromStorage();
    const emoji = Emoji.getRecentEmojiSorted().map(
        e => Emoji.getEmojiHTML(e, Emoji.codeToChr(e), true)
    );
    window.postMessage({type: "VK_EMOJI", text: {emoji: Emoji.getRecentEmojiSorted(), html: emoji}}, "*");
});

watchVar('TopNotifierCur', function (TopNotifierCur) {
    TopNotifierCur.count = 'oldvk-notify';
    TopNotifierCur.link = 'oldvk-notify-wrap';
});

watchVar('SPE', function (SPE) {
    monkey(SPE, 'init', null, () => {
        setStyle(geByClass1('pe_canvas'), 'marginTop', cur.pvPhoto.firstElementChild.offsetTop)
    })
});

watchVar('onLoginDone', function () {
    if (typeof _oldvk_onLoginDone !== 'undefined') {
        monkey(window, 'onLoginDone', null, () => {
            removeClass(document.head, 'oldvk-not-logged');
            window.postMessage({type: "RELOAD_VK_TOP"}, "*");
        })
    }
});

watchVar('AudioUtils', function (AudioUtils) {
    monkey(AudioUtils, 'getAudioFromEl', null, r => {
        if (r.hasOwnProperty('withInlinePlayer'))
            r.withInlinePlayer = true;
        return r
    })
});

watchVar('IM', function (IM) {
    //monkey(IM,'init', e => console.log(e[0]))

    cur = watchProp(cur, 'peer', function (peer) {
        console.log(peer);
    });
});

/*console.log(window['initReactApplication'], performance.now());

watchVar('initReactApplication', function(app) {
    //console.log('inside iRA', performance.now() );
    monkey(window,'initReactApplication', args => {console.log('iRA',args, performance.now())})
});*/

watchVar('__leftMenu', function (__leftMenu) {
    __leftMenu.handleUpdateRequest = nothing;
    // TODO: Покопать дальше, функция срабатывает недостаточно рано
});

watchVar('ap', function (ap) {
    if (ap.top && ap.top._updateTitle) {
        ap.top._updateTitle = function (t) {
            if (!t) return;
            t = AudioUtils.asObject(t);
            const title = document.createElement('div');
            const performer = document.createElement('div');
            performer.classList.add('oldvk-performer');
            title.classList.add('oldvk-title');
            const wrap = geByClass1('top_audio_player_title');
            if (wrap) {
                wrap.textContent = '';
                performer.textContent = decodeHtml(t.performer);
                title.textContent = decodeHtml(t.title);
                wrap.appendChild(performer);
                wrap.appendChild(title);
                title.style.transitionDuration = title.clientWidth / 170 * 2 + 's';
                performer.style.transitionDuration = performer.clientWidth / 170 * 2 + 's';
                if (title.clientWidth <= 170)
                    title.classList.add('oldvk-no-scroll');
                if (performer.clientWidth <= 170)
                    performer.classList.add('oldvk-no-scroll')
            }
        }
    }
    if (ap.top) {
        ap.on(ap.top, "start", function () {
            removeClass(ge("oldvk_top_play"), "oldvk-hide");
            addClass(ge("oldvk_top_play"), "active");
        });
        ap.on(ap.top, "pause", function () {
            removeClass(ge("oldvk_top_play"), "active")
        })
    }
});

/*var jsObserver = new MutationObserver(function (ms) {
 ms.forEach(function (m) {
 m.addedNodes.forEach(function (n) {
 if (n.nodeName == 'SCRIPT') {
 var js = n.src.match(/[^/\\&\?]+\.js(?=([\?&].*$|$))/);
 if (js && bindSF.hasOwnProperty(js[0]))
 bindSF[js[0]]()
 }})});
 });

 jsObserver.observe(document.head, {childList: true});*/

function newsMenuTabs(element) {
    let selected;
    if (element.id === 'ui_rmenu_news') {
        document.getElementById('feed_rmenu').classList.remove('unshown');
        document.getElementById('submit_post_box').classList.remove('unshown');
        selected = document.querySelector('#ui_rmenu_news_list .ui_rmenu_item_sel');
        if (selected) selected.classList.remove('ui_rmenu_item_sel')
    } else if (element.classList.contains('ui_tab')) {
        document.getElementById('feed_rmenu').classList.add('unshown');
        document.getElementById('submit_post_box').classList.add('unshown')
    } else {
        selected = document.querySelector('#oldvk-news-tabs .ui_rmenu_item_sel');
        if (selected) selected.classList.remove('ui_rmenu_item_sel')
    }
}

function switchRightMenu(item) { // Переключение выделенного пункта меню ui_rmenu
    item.parentElement.childNodes.forEach(node => {
        if (node.classList.contains('ui_rmenu_item'))
            node.classList.remove('ui_rmenu_item_sel')
    });
    item.classList.add('ui_rmenu_item_sel');
}