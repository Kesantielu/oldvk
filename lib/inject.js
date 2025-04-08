/**
 * Отслеживает изменения глобальной переменной в window
 * @param {string} variable - Имя переменной для наблюдения (в глобальной области видимости)
 * @param {(value: any) => void} callback - Функция-обработчик изменений значения
 * @example
 * watchVar('vk', (newValue) => {
 *   console.log('VK object changed:', newValue);
 * });
 */
function watchVar(variable, callback) {
    // Создаём ключ для хранения оригинального значения
    const key = `_oldvk_${variable}`;
    // Если уже наблюдаем за этой переменной, не переопределяем свойство
    if (Object.getOwnPropertyDescriptor(window, variable)?.configurable === false) {
        return;
    }
    // Инициализируем значение, если переменная уже существует
    if (variable in window && typeof window[key] === 'undefined') {
        window[key] = window[variable];
        // Вызываем коллбэк с текущим значением
        if (callback) callback(window[key]);
    } else
        window[key] = undefined;

    Reflect.defineProperty(window, variable, {
        get: function () {
            return window[key];
        },
        set: function (value) {
            window[key] = value;
            if (callback) callback(value);
        },
        enumerable: true,
        configurable: false // Предотвращаем повторное определение
    });

    return function unwatchVar() {
        // Функция для прекращения наблюдения
        const value = window[key];
        delete window[key];
        delete window[variable];
        window[variable] = value;
    }
}

/**
 * Monkey-patching для перехвата вызовов методов
 * @param {Object} variable - Целевой объект (например, window)
 * @param {string} prop - Имя метода для перехвата
 * @param {(this: any, args: any[]) => any[]|void} [before] - Хук перед вызовом:
 *  - Получает текущий контекст (this) и копию аргументов
 *  - Может модифицировать и вернуть новые аргументы
 * @param {(this: any, result: any, args: any[]) => any|void} [after] - Хук после вызова:
 *  - Получает результат выполнения, контекст и аргументы
 *  - Может модифицировать и вернуть новый результат
 * @returns {function} Функция для восстановления оригинального метода
 * @example
 * const unpatch = monkey(window, 'onclick',
 *   (args) => ['[LOG] ' + args[0]],
 *   (result, args) => { sendToAnalytics(args) }
 * );
 *
 * // Откат изменений
 * unpatch();
 */
function monkey(variable, prop, before, after) {    // Monkey Patching. (Переменная; ее свойство;
    // Обрабатываем специальный случай с window
    if (variable === window && window.hasOwnProperty(`_oldvk_${prop}`)) {
        prop = `_oldvk_${prop}`;
    }

    // Сохраняем оригинальную функцию
    const originalFn = variable[prop];
    // Если функция уже была модифицирована, получаем её оригинальную версию
    const originalImpl = originalFn._original || originalFn;

    // Создаём новую функцию-обёртку
    const patchedFn = () => {
        let args = Array.from(arguments);

        // Вызываем функцию "до", если она определена
        if (before) {
            const modifiedArgs = before.call(this, args);
            if (modifiedArgs !== undefined)
                args = Array.isArray(modifiedArgs) ? modifiedArgs : args;
        }

        // Вызываем оригинальную функцию с правильным контекстом
        let result = originalImpl.apply(this, args);

        // Вызываем функцию "после", если она определена
        if (after) {
            const modifiedResult = after.call(this, result, args);
            if (modifiedResult !== undefined)
                result = modifiedResult;
        }
        return result;
    };

    // Сохраняем ссылку на оригинальную функцию для возможности отката
    patchedFn._original = originalImpl;

    // Заменяем оригинальную функцию на патч
    variable[prop] = patchedFn;

    // Возвращаем функцию для отмены патча
    return function unpatch() {
        variable[prop] = originalImpl;
    };
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

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}