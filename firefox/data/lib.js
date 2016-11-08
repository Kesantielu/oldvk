const styles = [
    {css: 'audios', match: 'audios'},
    {css: 'friends', match: 'friends'}
];

const langMap = {0: 'ru', 1: 'uk', 2: 'be-tarask', 3: 'en-us', 97: 'kk', 114: 'be', 100: 'ru-petr1708', 777: 'ru-ussr'};

var lang = 0;

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
    peoples: {
        0: 'люди',
        1: 'люди',
        2: 'людзі',
        3: 'peoples',
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
        777: 'объединения'
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
    }
};

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

var wide;
var topStop = 3000;

function initResize() {

    document.arrive('.page_post_sized_thumbs', {existing: true}, function () {
        console.log('arrive',this.parentNode.id);
        var element = this;
        resizing(element, function () {
            console.log('resizing',element.parentNode.id);
            Zoom.minus(element);
            Array.prototype.forEach.call(element.childNodes, function (node) {
                Zoom.minus(node)
            });
            element.classList.add('oldvk-resized');
        })
    });

    document.arrive('.page_gif_large', {existing: true}, function () {
        var element = this;
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
    var wideApplicable = (contentID == "profile" || contentID == "group" || contentID == "public");
    if (!wideApplicable || element.classList.contains('oldvk-resized')) return;
    var nc = document.getElementById('narrow_column');
    if (wide == null) wide = (nc && wideApplicable) ? (nc.getBoundingClientRect().bottom < 0) : true;
    if (!wide && wideApplicable && ((element.getBoundingClientRect().top + document.body.scrollTop) <= topStop)) {
        f();
    }
}

var Zoom = {
    factor: 0.66,
    factorFixed: 0.77,
    plus: function (element) {
        //console.log('plus', element.parentNode.id);
        element.style.width = parseFloat(element.style.width) / Zoom.factor + 'px';
        element.style.height = parseFloat(element.style.height) / Zoom.factor + 'px';
    },
    minus: function (element) {
        //console.log('minus', element.parentNode.id);
        element.style.width = parseFloat(element.style.width) * Zoom.factor + 'px';
        element.style.height = parseFloat(element.style.height) * Zoom.factor + 'px';
    },
    plus_d: function (element) {
        //console.log('plus_d', element.parentNode.id);
        element.dataset.width = element.dataset.width / Zoom.factor;
        element.dataset.height = element.dataset.height / Zoom.factor
    },
    minus_d: function (element) {
        //console.log('minus_d', element.parentNode.id);
        element.dataset.width = element.dataset.width * Zoom.factor;
        element.dataset.height = element.dataset.height * Zoom.factor
    }
};

function checkWide() {
    console.log('checkwide',wide);
    if (wide != (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0)) {
        wide = !wide;
        var thumbs;
        console.info('wide',wide);
        if (wide) {
            document.getElementById('wide_column').classList.add('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'absolute';

            thumbs = Array.prototype.slice.call(document.getElementsByClassName('oldvk-resized'));
            console.log('thumbs',thumbs.length);
            thumbs.forEach(function (element) {
                Zoom.plus(element);
                Array.prototype.forEach.call(element.childNodes, function (node) {
                    Zoom.plus(node)
                });
                element.classList.remove('oldvk-resized')
            });

            thumbs = Array.prototype.slice.call(document.getElementsByClassName('oldvk-resized-gif'));
            thumbs.forEach(function (element) {
                Zoom.plus_d(element.getElementsByClassName('page_doc_photo_href')[0]);
                Zoom.plus(element.getElementsByClassName('page_doc_photo')[0]);
                Zoom.plus(element.getElementsByClassName('page_doc_photo_href')[0]);
                element.classList.remove('oldvk-resized-gif');
            })
        } else {
            document.getElementById('wide_column').classList.remove('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'relative';

            thumbs = Array.prototype.slice.call(document.getElementsByClassName('page_post_sized_thumbs'));
            console.log('thumbs',thumbs.length);
            thumbs.forEach(function (element) {
                if ((element.getBoundingClientRect().top + document.body.scrollTop) <= topStop) {
                    Zoom.minus(element);
                    Array.prototype.forEach.call(element.childNodes, function (node) {
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