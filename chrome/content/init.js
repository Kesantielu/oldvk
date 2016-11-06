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

var options = {optionCover: false};

chrome.storage.local.get(function (items) {
    Object.assign(options, items)
});

var injectStart = document.createElement('script');
injectStart.setAttribute('type', 'text/javascript');
injectStart.innerHTML = 'function vkwait(){if(typeof vk!=="undefined"){window.postMessage({type:"VK_INFO",text:vk.lang},"*");}else{setTimeout(function(){vkwait();},10)}}vkwait();';

document.arrive('head', {onceOnly: true, existing: true}, function () {
    chrome.storage.local.get('enabled', function (item) {
        if (item.enabled) {
            document.querySelector("link[rel*='icon']").href = "https://vk.com/images/favicon.ico";
            document.head.appendChild(injectStart);
            checkCSS(styles);
            insertCSS('local');
            insertCSS('main');
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.action == 'updating') {
                    updateCSS(request.css)
                }
            });
        }
    });
});

window.addEventListener('message', function (event) {
    if (event.source == window && event.data.type == 'VK_INFO') {
        lang = event.data.text;
        console.log('Language: ' + lang);
        document.documentElement.setAttribute('lang', langMap[lang]);
        LocalizedContent.init()
    }
});

window.addEventListener('beforeunload', function () {
    Arrive.unbindAllArrive();
});

function insertCSS(style) {
    var css = chrome.extension.getURL('content/' + style + '.css');
    if (!document.getElementById('oldvk-style-' + style)) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        link.id = 'oldvk-style-' + style;
        insertAfter(document.head, link);
        console.log(style + '.css inserted');
    }
}

function updateCSS(styles) {
    console.log('update', styles);
    styles.forEach(function (style) {
        if (style.apply) document.head.classList.add('oldvk-' + style.css);
        else document.head.classList.remove('oldvk-' + style.css);
    })
}

function checkCSS(styles) {
    var Styles = [];
    var url = document.createElement('a');
    url.href = window.location.href;
    var path = url.pathname.slice(1);
    styles.forEach(function (style) {
        var apply = !!path.startsWith(style.match);
        Styles.push({css: style.css, apply: apply})
    });
    updateCSS(Styles)
}

var LocalizedContent = {
    l_ntf: document.createElement('li'),
    l_edit: document.createElement('a'),
    l_set: document.createElement('li'),

    init: function () {
        this.l_ntf.id = 'l_ntf';
        this.l_ntf.innerHTML = '<a href="/feed?section=notifications" class="left_row" onclick="return nav.go(this, event, {noback: true, params: {_ref: \'left_nav\'}});" onmouseover="TopNotifier.preload(); if (!TopNotifier.shown()) {ntf = setTimeout(function(){TopNotifier.show(event)},2000)}" onmouseout="clearTimeout(ntf);"><span class="left_fixer"><span class="left_count_wrap fl_r" id="oldvk-notify-wrap" onmouseover="TopNotifier.preload()" onclick="TopNotifier.show(event);"><span class="inl_bl left_count" id="oldvk-notify"></span></span><span class="left_label inl_bl">' + i18n.answers[lang] + '</span></span></a>';

        this.l_edit.id = 'l_edit';
        this.l_edit.classList.add('fl_r');
        this.l_edit.href = '/edit';
        this.l_edit.innerHTML = i18n.edit[lang];

        this.l_set.id = 'l_sett';
        this.l_set.innerHTML = '<a href="/settings" class="left_row"><span class="left_fixer"><span class="left_label inl_bl" id="oldvk-settings"></span></span></a>';

        document.arrive('#side_bar_inner', {onceOnly: true, existing: true}, function () {
            LocalizedContent.updateMenu();
            document.arrive('#top_settings_link', {onceOnly: true, existing: true}, function () {
                document.getElementById('oldvk-settings').innerHTML = this.innerHTML
            })
        });

        var top_menu = '<div class="head_nav_item fl_r"><a id="oldvk_top_exit" class="top_nav_link" href="" onclick="if (checkEvent(event) === false) { window.Notifier && Notifier.lcSend(\'logged_off\'); location.href = this.href; return cancelEvent(event); }" onmousedown="tnActive(this)"><div class="top_profile_name"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_help" class="top_nav_link" href="/support?act=home" onclick="return TopMenu.select(this, event);"><div class="top_profile_name"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_music" class="top_nav_link" href="" onclick="return (checkKeyboardEvent(event) ? showAudioLayer(event, this) : false);" onmouseover="prepareAudioLayer()" onmousedown="return (checkKeyboardEvent(event) ? false : showAudioLayer(event, this))"><div class="top_profile_name">' + i18n.music[lang] + '</div><div id="oldvk_top_play" class="oldvk-hide" onclick="cancelEvent(event); if (getAudioPlayer().isPlaying()) {getAudioPlayer().pause(); removeClass(this,\'active\')} else {getAudioPlayer().play(); addClass(this,\'active\')}" onmousedown="cancelEvent(event);"></div></a><span id="oldvk_talp"></span></div><div class="head_nav_item fl_r"><a id="oldvk_top_apps" class="top_nav_link" href="/apps" onclick="return TopMenu.select(this, event);"><div class="top_profile_name">' + i18n.games[lang] + '</div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_communities" class="top_nav_link" href="/search?c[section]=communities" onclick="return TopMenu.select(this, event);"><div class="top_profile_name">' + i18n.communities[lang] + '</div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_peoples" class="top_nav_link" href="/search?c[section]=people" onclick="return TopMenu.select(this, event);"><div class="top_profile_name">' + i18n.peoples[lang] + '</div></a></div>';
        document.arrive('#top_nav', {onceOnly: true, existing: true}, function () {
            this.innerHTML += top_menu;
            document.getElementById('oldvk_top_exit').firstElementChild.innerHTML = document.getElementById('top_logout_link').innerHTML.toLowerCase();
            document.getElementById('oldvk_top_exit').href = document.getElementById('top_logout_link').href;
            document.getElementById('oldvk_top_help').firstElementChild.innerHTML = document.getElementById('top_support_link').innerHTML.toLowerCase();
            document.getElementById('top_audio_layer_place').remove();
            document.getElementById('oldvk_talp').id = 'top_audio_layer_place';
        })
    },
    updateMenu: function () {
        if (!document.getElementById('l_ntf')) {
            insertAfter(document.getElementById('l_nwsf'), this.l_ntf);
        }
        if (!document.getElementById('l_edit')) {
            var l_edit_b = document.getElementById('l_pr').getElementsByClassName('left_fixer')[0];
            l_edit_b.insertBefore(this.l_edit, l_edit_b.firstChild);
        }
        if (!document.getElementById('l_sett')) {
            if (document.getElementById('l_fav'))
                insertAfter(document.getElementById('l_fav'), this.l_set);
            else
                insertAfter(document.getElementById('l_ntf'), this.l_set);
        }
        LocalizedContent.updateNotify()
    },
    updateNotify: function () {
        var notifyCount = parseInt(document.getElementById('top_notify_count').innerHTML, 10);
        if (notifyCount < 1) document.getElementById('oldvk-notify-wrap').classList.add('has_notify');
        document.getElementById('oldvk-notify').innerHTML = notifyCount.toString();
    }
};

document.arrive('.page_cover', {existing: true}, function () {
    if (options.optionCover) {
        this.classList.add('adapted')
    } else {
        var page_actions = document.getElementsByClassName('group_actions_wrap')[0];
        var nc = document.getElementById('narrow_column');
        var page_block = document.createElement('div');
        page_block.className = 'page_block page_photo';
        var page_avatar_wrap = document.createElement('div');
        page_avatar_wrap.className = 'page_avatar_wrap';
        var page_avatar = document.createElement('div');
        page_avatar.className = 'page_avatar';
        page_avatar.id = 'page_avatar';
        var page_avatar_a = document.getElementsByClassName('page_cover_image')[0];
        page_avatar_a.className = '';
        page_avatar_a.firstElementChild.className = 'page_avatar_img';
        var temp = eval('('+page_avatar_a.getAttribute('onclick').match(/{.*}/)[0]+')').temp;
        page_avatar_a.firstElementChild.setAttribute('src', temp.base+temp.x_[0]+'.jpg');
        page_avatar.appendChild(page_avatar_a);
        page_avatar_wrap.appendChild(page_avatar);
        page_block.appendChild(page_avatar_wrap);
        page_block.appendChild(page_actions);
        nc.insertBefore(page_block, nc.firstChild)
    }
});