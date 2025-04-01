console.log('self', self);

self.browser = self.browser || self.msBrowser || self.chrome;
const isFirefox = typeof InstallTrigger !== 'undefined';
const isWebExt = typeof browser !== 'undefined' && typeof browser.extension !== 'undefined';

let options = isWebExt ? {optionCover: false, optionViewer: false} : self.options;

if (isFirefox && !isWebExt) {
    self.port.on('options', function (o) {
        Object.assign(options, o);
    })
}

if (typeof Node !== 'undefined' && !Node.prototype.insertAfter) {
    Node.prototype.insertAfter = function (newNode, referenceNode) {
        if (referenceNode.nextSibling)
            this.insertBefore(newNode, referenceNode.nextSibling);
        else
            this.appendChild(newNode)
        return newNode; // Возвращаем узел для возможности создания цепочек вызовов
    };
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

if (typeof MutationObserver !== 'undefined') {
    let KPP = {
        _list: [],
        _actions: [],
        _addedTag: function (observer, mutations, tag, callback, once) {
            for (let i = 0, l = mutations.length; i < l; i++) {
                for (let j = 0, m = mutations[i].addedNodes.length; j < m; j++) {
                    if (mutations[i].addedNodes[j].tagName === tag) {
                        callback();
                        if (once) observer.disconnect();
                    }
                }
            }
        },
        _police: new MutationObserver(function (mutations) {
            for (let i = 0, l = mutations.length; i < l; i++) {
                for (let j = 0, m = mutations[i].addedNodes.length; j < m; j++) {
                    if (mutations[i].addedNodes[j].nodeType === 1) {
                        for (let k = KPP._list.length; k--;) {
                            if (mutations[i].addedNodes[j].matches(KPP._list[k])) { // Обрабатывает только существующие элементы до DOMContentLoaded
                                if (!mutations[i].addedNodes[j].KPPPassed) {
                                    KPP._actions[k](mutations[i].addedNodes[j]);
                                    mutations[i].addedNodes[j].KPPPassed = true;
                                }
                            } else {
                                let n = mutations[i].addedNodes[j].querySelectorAll(KPP._list[k]);
                                for (let o = 0, p = n.length; o < p; o++) {
                                    if (!n.KPPPassed) {
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
                const observer = new MutationObserver(function (mutations, observer) {
                    KPP._addedTag(observer, mutations, 'HEAD', callback, true)
                });
                observer.observe(document.documentElement, {childList: true});
            } else callback();
        },
        body: function (callback) {
            if (!document.body) {
                const observer = new MutationObserver(function (mutations, observer) {
                    KPP._addedTag(observer, mutations, 'BODY', callback, true)
                });
                observer.observe(document.documentElement, {childList: true});
            } else callback();
        },
        add: function (selector, callback) {
            const q = document.querySelectorAll(selector);
            if (q.length > 0) {
                for (let i = q.length; i--;) {
                    callback(q[i]);
                }
            }
            KPP._list.push(selector);
            KPP._actions.push(callback);
            KPP._police.observe(document.documentElement, {childList: true, subtree: true})
        },
        remove: function (selector) {
            const s = KPP._list.indexOf(selector);
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
    self.KPP = KPP
}



function decodeHtml(html) {
    const txt = document.createElement("textarea");
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

const topStop = 4000;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBrowser() {
    let ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name: 'IE', version: (tem[1] || '')};
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null)
            return {name: 'Opera', version: tem[1]};
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {name: M[0], version: M[1]}
}

function logTime(text) {
    console.log(text, performance.now())
}

const styles = [
    {css: 'audios', match: 'audio'},
    {css: 'friends', match: 'friends'},
    {css: 'market', match: 'market'},
    {css: 'support', match: 'support'},
    {css: 'audios', match: 'artist'},
    {css: 'audios', match: 'music'},
    {css: 'audios', match: 'podcasts'}
];

