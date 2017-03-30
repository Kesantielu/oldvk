var isFirefox = typeof InstallTrigger !== 'undefined';

var isWebExt = typeof chrome !== 'undefined' && typeof chrome.extension !== 'undefined';

var options = isWebExt ? {optionCover: false, optionViewer: false} : self.options;

if (isFirefox && !isWebExt) {
    self.port.on('options', function (o) {
        Object.assign(options, o);
        console.log(options)
    })
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.lastIndexOf(searchString, position) === position;
        }
    });
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector
}

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target, firstSource) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

function wait(condition, callback) {
    if (typeof condition() !== "undefined") {
        callback()
    } else {
        setTimeout(function () {
            wait(condition, callback);
        }, 0)
    }
}

var KPP = {
    _list: [],
    _actions: [],
    _addedTag: function (observer, mutations, tag, callback, once) {
        for (var i = 0, l = mutations.length; i < l; i++) {
            for (var j = 0, m = mutations[i].addedNodes.length; j < m; j++) {
                if (mutations[i].addedNodes[j].tagName === tag ) {
                    callback();
                    if (once) observer.disconnect();
                }
            }
        }
    },
    _police: new MutationObserver(function (mutations) {
        for (var i = 0, l = mutations.length; i < l; i++) {
            for (var j = 0, m = mutations[i].addedNodes.length; j < m; j++) {
                if (mutations[i].addedNodes[j].nodeType === 1) {
                    for (var k = KPP._list.length; k--;) {
                        if (mutations[i].addedNodes[j].matches(KPP._list[k])) { // Обрабатывает только существующие элементы до DOMContentLoaded
                            if (!mutations[i].addedNodes[j].KPPPassed) {
                                KPP._actions[k](mutations[i].addedNodes[j]);
                                mutations[i].addedNodes[j].KPPPassed = true;
                            }
                        } else {
                            var n = mutations[i].addedNodes[j].querySelectorAll(KPP._list[k]);
                            for (var o = 0, p = n.length; o < p; o++) {
                                if (!n[o].KPPPassed) {
                                    KPP._actions[k](n[o]);
                                    n[o].KPPPassed = true;
                                }
                            }
                        }
                        //if (n.length > 0) break
                    }
                }
            }
        }
    }),
    head: function (callback) {
        if (!document.head) {
            var observer = new MutationObserver(function (mutations, observer) {
                KPP._addedTag(observer, mutations, 'HEAD', callback, true)
            });
            observer.observe(document.documentElement, {childList: true});
        } else callback();
    },
    body: function (callback) {
        if (!document.body) {
            var observer = new MutationObserver(function (mutations, observer) {
                KPP._addedTag(observer, mutations, 'BODY', callback, true)
            });
            observer.observe(document.documentElement, {childList: true});
        } else callback();
    },
    add: function (selector, callback) {
        var q = document.querySelectorAll(selector);
        if (q.length > 0) {
            for (var i = q.length; i--;) {
                callback(q[i]);
            }
        }
        KPP._list.push(selector);
        KPP._actions.push(callback);
        KPP._police.observe(document.documentElement, {childList: true, subtree: true})
    },
    remove: function (selector) {
        var s = KPP._list.indexOf(selector);
        if (s !== -1) {
            KPP._list.splice(s, 1);
            KPP._actions.splice(s, 1);
            if (KPP._list.length < 1)
                KPP._police.disconnect();
            return true
        }
        return false
    },
    stop: function (full) {
        KPP._police.disconnect();
        if (full) {
            KPP._list = [];
            KPP._actions = [];
        }
    }
};

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

var topStop = 3000;

function checkWide() {
    if (!document.getElementById('narrow_column')) return;
    if (wide !== (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0)) {
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
    var wideApplicable = (contentID === "profile" || contentID === "group" || contentID === "public");
    wide = (document.getElementById('narrow_column') && wideApplicable) ? (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0) : true;
    if (wide && wideApplicable) {
        console.timeEnd('B');
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

function initResize() {

    KPP.add('.page_post_sized_thumbs', function (e) {
        var element = e;
        resizing(element, function () {
            Zoom.minus(element);
            Array.prototype.forEach.call(element.childNodes, function (node) {
                Zoom.minus(node)
            });
            element.classList.add('oldvk-resized');
        })
    });

    KPP.add('.page_gif_large', function (e) {
        var element = e;
        resizing(element, function () {
            Zoom.minus_d(element.getElementsByClassName('page_doc_photo_href')[0]);
            Zoom.minus(element.getElementsByClassName('page_doc_photo')[0]);
            Zoom.minus(element.getElementsByClassName('page_doc_photo_href')[0]);
            element.classList.add('oldvk-resized-gif');
        });
    })

}

function resizing(element, f) {
    wide = null;
    var contentID = document.getElementById('content').firstElementChild.id;
    var wideApplicable = (contentID === "profile" || contentID === "group" || contentID === "public");
    if (!wideApplicable || element.classList.contains('oldvk-resized')) return;
    var nc = document.getElementById('narrow_column');
    if (wide === null) wide = (nc && wideApplicable) ? (nc.getBoundingClientRect().bottom < 0) : true;
    if (!wide && wideApplicable && ((element.getBoundingClientRect().top + document.body.scrollTop) <= topStop)) {
        f();
    }
}

var Zoom = {
    factor: 0.66,
    factorFixed: 0.77,
    plus: function (element) {
        element.style.width = parseFloat(element.style.width) / Zoom.factor + 'px';
        element.style.height = parseFloat(element.style.height) / Zoom.factor + 'px';
    },
    minus: function (element) {
        element.style.width = parseFloat(element.style.width) * Zoom.factor + 'px';
        element.style.height = parseFloat(element.style.height) * Zoom.factor + 'px';
    },
    plus_d: function (element) {
        element.dataset.width = element.dataset.width / Zoom.factor;
        element.dataset.height = element.dataset.height / Zoom.factor
    },
    minus_d: function (element) {
        element.dataset.width = element.dataset.width * Zoom.factor;
        element.dataset.height = element.dataset.height * Zoom.factor
    }
};

const langMap = {0: 'ru', 1: 'uk', 2: 'be-tarask', 3: 'en-us', 97: 'kk', 114: 'be', 100: 'ru-petr1708', 777: 'ru-ussr'};

const i18n = {
    answers: {
        0: 'Ответы',
        1: 'Відповіді',
        2: 'Адказы',
        3: 'Feedback',
        97: 'Жауаптарым',
        114: 'Адказы',
        100: 'Отвѣты',
        777: 'Сводки'
    },
    edit: {
        0: 'ред.',
        1: 'ред.',
        2: 'рэд.',
        3: 'edit',
        97: 'өзгерту',
        114: 'рэд.',
        100: 'изм.',
        777: 'корр.'
    },
    people: {
        0: 'люди',
        1: 'люди',
        2: 'людзі',
        3: 'people',
        97: 'адамдар',
        114: 'людзі',
        100: 'персоны',
        777: 'граждане'
    },
    communities: {
        0: 'сообщества',
        1: 'спільноти',
        2: 'суполкі',
        3: 'communities',
        97: 'бірлестіктер',
        114: 'суполкі',
        100: 'общества',
        777: 'клубы'
    },
    music: {
        0: 'музыка',
        1: 'музика',
        2: 'музыка',
        3: 'music',
        97: 'музыка',
        114: 'музыка',
        100: 'патефонъ',
        777: 'патефон'
    },
    games: {
        0: 'игры',
        1: 'ігри',
        2: 'гульні',
        3: 'games',
        97: 'ойындар',
        114: 'гульні',
        100: 'потѣхи',
        777: 'отдых'
    },
    all_friends: {
        0: 'Все друзья',
        1: 'Усі друзі',
        2: 'Усе сябры',
        3: 'All friends',
        97: 'Барлық достар',
        114: 'Усе сябры',
        100: 'Всѣ знакомцы',
        777: 'Все товарищи'
    },
    settings: {
        0: 'Настройки',
        1: 'Налаштування',
        2: 'Налады',
        3: 'Settings',
        97: 'Баптаулар',
        114: 'Налады',
        100: 'Настройки',
        777: 'Настройки'
    },
    apps: {
        0: 'Приложения',
        1: 'Додатки',
        2: 'Праґрамы',
        3: 'Apps',
        97: 'Қосымшалар',
        114: 'Дадаткі',
        100: 'Аппликацiи',
        777: 'Досуг и отдых'
    }
};