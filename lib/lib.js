console.log('self', self);

self.browser = self.browser || self.msBrowser || self.chrome;
const isFirefox = typeof InstallTrigger !== 'undefined';
const isWebExt = typeof browser !== 'undefined' && typeof browser.extension !== 'undefined';

let options = isWebExt ? {enabled: true} : self.options;

if (isFirefox && !isWebExt) {
    self.port.on('options', function (o) {
        Object.assign(options, o);
    })
}

/**
 * Вставляет узел после указанного узла-ориентира, аналог insertBefore
 * @param {Node} newNode - Вставляемый узел
 * @param {Node} referenceNode - Узел-ориентир
 * @returns {Node} Вставленный узел
 * @example
 * parent.insertAfter(newDiv, existingDiv);
 */
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
        }, 50)
    }
}

/* Класс для отслеживания изменений DOM */

if (typeof MutationObserver !== 'undefined') {
    /**
     * Глобальный объект для наблюдения за изменениями DOM
     * @namespace KPP
     * @property {Map<string, function(HTMLElement)>} _selectorActions - Маппинг селекторов на коллбэки
     * @property {WeakMap<HTMLElement, boolean>} _processed - Отслеживание обработанных элементов
     * @property {MutationObserver|null} _policeObserver - Наблюдатель для изменений DOM
     */
    self.KPP = {
        _selectorActions: new Map(), // combine _list[] and _actions[]
        _processed: new WeakMap(), // instead of KPPPassed
        /**
         * Ожидает появления тега в DOM
         * @param {string} tagName - Имя тега (HEAD, BODY, TITLE)
         * @param {function()} callback - Коллбэк при появлении тега
         * @private
         */
        _waitForTag: function (tagName, callback) {
            const element = ({
                "HEAD": document.head,
                "BODY": document.body,
                "TITLE": document.title
            })[tagName];
            if (element) {
                callback();
            } else {
                const observer = new MutationObserver((mutations, observer) => {
                    for (let i = 0; i < mutations.length; i++) {
                        const addedNodes = mutations[i].addedNodes;
                        for (let j = 0; j < addedNodes.length; j++) {
                            if (addedNodes[j].tagName === tagName) {
                                callback();
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                });
                observer.observe(document.documentElement, {childList: true});
            }
        },

        /**
         * Обработчик мутаций DOM
         * @param {MutationRecord[]} mutations - Список мутаций
         * @private
         */
        _police: function (mutations) {
            if (this._selectorActions.size === 0) return;
            for (let i = 0; i < mutations.length; i++) {
                const addedNodes = mutations[i].addedNodes;
                for (let j = 0; j < addedNodes.length; j++) {
                    const node = addedNodes[j];
                    if (node.nodeType !== 1) continue;
                    for (const [selector, callback] of this._selectorActions.entries()) {
                        if (node.matches && node.matches(selector)) {
                            if (!this._processed.has(node)) {
                                callback(node);
                                this._processed.set(node, true);
                            }
                        }
                        if (node.querySelectorAll) {
                            const matchingChildren = node.querySelectorAll(selector);
                            for (let l = 0; l < matchingChildren.length; l++) {
                                const child = matchingChildren[l];
                                if (!this._processed.has(child)) {
                                    callback(child);
                                    this._processed.set(child, true);
                                }
                            }
                        }
                    }
                }
            }
        },

        _policeObserver: null,
        /**
         * Инициализирует наблюдатель изменений
         * @private
         */
        _initPoliceObserver: function () {
            if (!this._policeObserver) {
                this._policeObserver = new MutationObserver(this._police.bind(this));
            }
        },

        /**
         * Выполняет коллбэк при появлении тега HEAD
         * @param {function()} callback - Коллбэк
         */
        head: function (callback) {
            this._waitForTag('HEAD', callback);
        },

        /**
         * Выполняет коллбэк при появлении тега BODY
         * @param {function()} callback - Коллбэк
         */
        body: function (callback) {
            this._waitForTag('BODY', callback);
        },

        /**
         * Добавляет обработчик для элементов по селектору
         * @param {string} selector - CSS-селектор
         * @param {function(HTMLElement)} callback - Коллбэк для элемента
         */
        add: function (selector, callback) {
            const existingElements = document.querySelectorAll(selector);
            for (let i = 0; i < existingElements.length; i++) {
                const element = existingElements[i];
                if (!this._processed.has(element)) {
                    callback(element);
                    this._processed.set(element, true);
                }
            }
            this._selectorActions.set(selector, callback);
            this._initPoliceObserver();
            this._policeObserver.observe(document.documentElement, {childList: true, subtree: true});
        },

        /**
         * Удаляет обработчик для селектора
         * @param {string} selector - CSS-селектор
         * @returns {boolean} - Успешность удаления
         */
        remove: function (selector) {
            const removed = this._selectorActions.delete(selector);
            if (this._selectorActions.size === 0 && this._policeObserver) {
                this._policeObserver.disconnect();
            }
            return removed;
        },

        /**
         * Останавливает наблюдение
         * @param {boolean} [full=false] - Полная очистка
         */
        stop: function (full) {
            if (this._policeObserver) {
                this._policeObserver.disconnect();
            }
            full && this._selectorActions.clear();
        }
    }
}

/**
 * Декодирует HTML-сущности в строке
 * @param {string} html - Строка с HTML-сущностями
 * @returns {string} Декодированная строка
 * @example
 * const decoded = decodeHtml('&lt;div&gt;Hello&lt;/div&gt;'); // <div>Hello</div>
 */
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

/**
 * Локализация из messages.json по атрибуту data-l10n-id
 * @returns {void}
 */
function localize() {
    [].forEach.call(document.querySelectorAll('[data-l10n-id]'),
        item => item.textContent = browser.i18n.getMessage(item.dataset.l10nId));
}

/**
 * Загружает файл шаблонов и извлекает из него шаблоны
 * @returns {Promise<Object>} - Promise с объектом шаблонов, где ключ - id шаблона
 */
async function loadTemplates() {
    // Получаем URL к файлу шаблонов в расширении
    const response = await fetch(browser.runtime.getURL('content/templates.html'));
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const templates = {};
    const templateElements = doc.querySelectorAll('script[type="text/template"]');
    templateElements.forEach(template => {
        if (template.id)
            templates[template.id] = template.innerHTML;
    });
    return templates;
}

/**
 * Рендеринг шаблонов
 * @param {string} templateId - ID шаблона в HTML
 * @param {object} data - Данные для подстановки в шаблон
 * @returns {HTMLElement} - DOM элемент
 */
function renderTemplate(templateId, data) {
    let templateContent = document.getElementById(templateId).innerHTML;
    // Заменяем все переменные в формате {{variable}} на соответствующие значения
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        templateContent = templateContent.replace(regex, data[key]);
    });
    const container = document.createElement('div');
    container.innerHTML = templateContent.trim();
    return container.firstElementChild;
}

