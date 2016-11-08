var injectStart = document.createElement('script');
injectStart.setAttribute('type', 'text/javascript');
injectStart.innerHTML = 'function vkwait(){if(typeof vk!=="undefined"){window.postMessage({type:"VK_INFO",text:vk.lang},"*");}else{setTimeout(function(){vkwait();},10)}}vkwait();(function(history){var pushState=history.pushState;history.pushState=function(state){window.postMessage({type:"PUSH_URL",text:arguments[2].slice(1)},"*");return pushState.apply(history,arguments);}})(window.history);';


window.addEventListener('message', function (event) {
    if (event.data.type == 'VK_INFO') {
        lang = event.data.text;
        document.documentElement.setAttribute('lang', langMap[lang]);
        LocalizedContent.init()
    }
    if (event.data.type == 'PUSH_URL') {
        console.log('push_url',event.data);
        checkCSS(styles, event.data.text);
        initWide();
    }
}, false);

document.arrive('head', {onceOnly: true, existing: true}, function () {
    checkCSS(styles);
    document.head.appendChild(injectStart);
    initResize();
    console.log('arrived head!');
    console.log('arrived head',window.location.href);
    document.querySelector("link[rel*='icon']").href = "https://vk.com/images/favicon.ico";
});

window.addEventListener('beforeunload', function () {
    Arrive.unbindAllArrive();
});

var LocalizedContent = {
    l_ntf: document.createElement('li'),
    l_edit: document.createElement('a'),
    l_set: document.createElement('li'),

    init: function () {
        this.l_ntf.id = 'l_ntf';
        this.l_ntf.innerHTML = '<a href="/feed?section=notifications" class="left_row" onclick="return nav.go(this, event, {noback: true, params: {_ref: \'left_nav\'}});" onmouseover="TopNotifier.preload(); if (!TopNotifier.shown()) {ntf = setTimeout(function(){TopNotifier.show(event)},1200)}" onmouseout="clearTimeout(ntf);"><span class="left_fixer"><span class="left_count_wrap fl_r" id="oldvk-notify-wrap" onmouseover="TopNotifier.preload()" onclick="TopNotifier.show(event);"><span class="inl_bl left_count" id="oldvk-notify"></span></span><span class="left_label inl_bl">' + i18n.answers[lang] + '</span></span></a>';

        this.l_edit.id = 'l_edit';
        this.l_edit.classList.add('fl_r');
        this.l_edit.href = '/edit';
        this.l_edit.innerHTML = i18n.edit[lang];

        this.l_set.id = 'l_sett';
        this.l_set.innerHTML = '<a href="/settings" class="left_row"><span class="left_fixer"><span class="left_label inl_bl" id="oldvk-settings"></span></span></a>';

        document.arrive('#side_bar_inner', {onceOnly: true, existing: true}, function () {
            LocalizedContent.updateMenu();
            var notifyCount = parseInt(document.getElementById('top_notify_count').innerHTML, 10);
            if (notifyCount < 1) document.getElementById('oldvk-notify-wrap').classList.add('has_notify');
            document.getElementById('oldvk-notify').innerHTML = notifyCount.toString();
            document.arrive('#top_settings_link', {onceOnly: true, existing: true}, function () {
                document.getElementById('oldvk-settings').innerHTML = this.innerHTML
            })
        });

        var top_menu = '<div class="head_nav_item fl_r"><a id="oldvk_top_exit" class="top_nav_link" href="" onclick="if (checkEvent(event) === false) { window.Notifier && Notifier.lcSend(\'logged_off\'); location.href = this.href; return cancelEvent(event); }" onmousedown="tnActive(this)"><div class="top_profile_name"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_help" class="top_nav_link" href="/support?act=home" onclick="return TopMenu.select(this, event);"><div class="top_profile_name"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_music" class="top_nav_link" href="" onclick="return (checkKeyboardEvent(event) ? showAudioLayer(event, this) : false);" onmouseover="prepareAudioLayer()" onmousedown="return (checkKeyboardEvent(event) ? false : showAudioLayer(event, this))"><div class="top_profile_name fl_l">' + i18n.music[lang] + '</div><div id="oldvk_top_play" class="oldvk-hide" onclick="cancelEvent(event); if (getAudioPlayer().isPlaying()) {getAudioPlayer().pause(); removeClass(this,\'active\')} else {getAudioPlayer().play(); addClass(this,\'active\')}" onmousedown="cancelEvent(event);"></div></a><span id="oldvk_talp"></span></div><div class="head_nav_item fl_r"><a id="oldvk_top_apps" class="top_nav_link" href="/apps" onclick="return TopMenu.select(this, event);"><div class="top_profile_name">' + i18n.games[lang] + '</div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_communities" class="top_nav_link" href="/search?c[section]=communities" onclick="return TopMenu.select(this, event);"><div class="top_profile_name">' + i18n.communities[lang] + '</div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_peoples" class="top_nav_link" href="/search?c[section]=people" onclick="return TopMenu.select(this, event);"><div class="top_profile_name">' + i18n.peoples[lang] + '</div></a></div>';
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
    }
};