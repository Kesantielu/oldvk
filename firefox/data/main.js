var styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

var langMap = {0: 'ru', 1: 'uk', 2: 'be-tarask', 3: 'en-us', 114: 'be', 100: 'ru-petr1708', 777: 'ru-ussr'};

var injectJS = document.createElement('script');
injectJS.setAttribute('type', 'text/javascript');
injectJS.innerHTML = 'function vkwait(){if(typeof vk!=="undefined"){window.postMessage({type:"VK_INFO",text:vk.lang},"*");}else{setTimeout(function(){vkwait();},10)}}vkwait();(function(history){var pushState=history.pushState;history.pushState=function(state){window.postMessage({type:"PUSH_URL",text:arguments[2].slice(1)},"*");return pushState.apply(history,arguments);}})(window.history);';

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

function checkCSS(styles, path) {
    var Styles = [];
    var url = document.createElement('a');
    url.href = window.location.href;
    if (path == undefined) path = url.pathname.slice(1);
    styles.forEach(function (style) {
        var apply = !!path.startsWith(style.match);
        Styles.push({css: style.css, apply: apply})
    });
    updateCSS(Styles)
}

function updateCSS(styles) {
    styles.forEach(function (style) {
        if (style.apply) document.head.classList.add('oldvk-' + style.css);
        else document.head.classList.remove('oldvk-' + style.css);
    })
}

var l_ntf = document.createElement('li');
l_ntf.id = 'l_ntf';
l_ntf.innerHTML = '<a href="/feed?section=notifications" class="left_row"><span class="left_fixer"><span class="left_count_wrap fl_r left_void"><span class="inl_bl left_count_sign"></span></span><span class="left_icon fl_l"></span><span class="left_label inl_bl">Ответы</span></span></a>';

window.addEventListener('message', function (event) {
    if (event.data.type == 'VK_INFO') {
        var lang = event.data.text;
        document.documentElement.setAttribute('lang', langMap[lang]);
    }
    if (event.data.type == 'PUSH_URL') {
        checkCSS(styles, event.data.text);
    }
}, false);

document.arrive('head', {onceOnly: true, existing: true}, function () {
    checkCSS(styles);
    document.head.appendChild(injectJS);
    document.arrive('#side_bar_inner', {existing: true}, function () {
        if (document.getElementById('l_nwsf'))
            insertAfter(document.getElementById('l_nwsf'), l_ntf)
    });
});

window.addEventListener('beforeunload', function () {
    Arrive.unbindAllArrive();
});