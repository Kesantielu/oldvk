if (!window.browser)
    window.browser = window.msBrowser || window.chrome;

var isFirefox = typeof InstallTrigger !== 'undefined';

var isWebExt = typeof browser !== 'undefined' && typeof browser.extension !== 'undefined';

var options = isWebExt ? {optionCover: false, optionViewer: false} : self.options;

if (isFirefox && !isWebExt) {
    self.port.on('options', function (o) {
        Object.assign(options, o);
    })
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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
                if (mutations[i].addedNodes[j].tagName === tag) {
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

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

if (!Object.isEmpty) {
    Object.defineProperty(Object, 'isEmpty', {
        configurable: true,
        value: function (obj) {
            if (obj === undefined || obj === null || obj.constructor !== Object) {
                throw new TypeError('Is not object');
            } else
                return Object.keys(obj).length === 0
        }
    });
}

var topStop = 4000;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var styles = [
    {css: 'audios', match: 'audio'},
    {css: 'friends', match: 'friends'},
    {css: 'market', match: 'market'},
    {css: 'support', match: 'support'},
    {css: 'audios', match: 'artist'},
    {css: 'audios', match: 'music'},
    {css: 'audios', match: 'podcasts'}
];

var langMap = {0: 'ru', 1: 'uk', 2: 'be-tarask', 3: 'en-us', 97: 'kk', 114: 'be', 100: 'ru-petr1708', 777: 'ru-ussr'};

var i18n = {
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
    },
    audios: {
        0: 'Аудиозаписи',
        1: 'Аудiозаписи',
        2: 'Аўдыёзапісы',
        3: 'Music',
        97: 'Аудиожазбалар',
        114: 'Аўдыязапісы',
        100: 'Композицiи',
        777: 'Грамзаписи'
    },
    videos: {
        0: 'Видеозаписи',
        1: 'Відеозаписи',
        2: 'Відэазапісы',
        3: 'Videos',
        97: 'Бейнежазбалар',
        114: 'Відэазапісы',
        100: 'Синематографъ',
        777: 'Киноленты'
    },
    groups: {
        0: 'Группы',
        1: 'Групи',
        2: 'Групы',
        3: 'Groups',
        97: 'Топтарым',
        114: 'Групы',
        100: 'Общества',
        777: 'Клубы'
    },
    spam: {
        0: 'Это спам',
        1: 'Це спам',
        2: 'Гэта спам',
        3: 'Spam',
        97: 'Бұл спам',
        114: 'Гэта спам',
        100: 'Сiе спамъ',
        777: 'Это провокация'
    },
    delete: {
        0: 'Удалить',
        1: 'Видалити',
        2: 'Выдаліць',
        3: 'Delete',
        97: 'Жою',
        114: 'Выдаліць',
        100: 'Сжечь',
        777: 'Сжечь'
    },
    messages: {
        0: 'Сообщения',
        1: 'Повідомлення',
        2: 'Паведамленьні',
        3: 'Messages',
        97: 'Хабарламалар',
        114: 'Паведамленні',
        100: 'Письма',
        777: 'Телеграммы'
    }
};