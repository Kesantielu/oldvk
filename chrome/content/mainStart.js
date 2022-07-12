let lang, emoji;

const injectStart = document.createElement('script');
injectStart.type = 'text/javascript';
injectStart.src = isWebExt ? browser.runtime.getURL('content/injectStart.js') : options.inject;

const injectOptions = document.createElement('meta');
injectOptions.name = 'oldvk';
if (!isWebExt)
    options.fox = true;
injectOptions.textContent = JSON.stringify(options);

document.addEventListener('DOMContentLoaded', () => logTime('DOM'));

function setLayoutWidth(width) {
    document.documentElement.style.setProperty('--layout-width', width + 'px', 'important');
}

function init() {
    document.head.appendChild(injectOptions);
    document.head.appendChild(injectStart);
    headOptions();
    headFixes();
    checkStyles(styles);
    if (isWebExt) {
        if (options.layout)
            setLayoutWidth(options.layout);
        insertCSS('local');
        insertCSS('main');
        browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.action === 'updating') {
                updateStyles(request.css);
                updating(request.path)
            }
            ;
            if (request.action === 'layout')
                setLayoutWidth(request.value);
            sendResponse({result: true})
        });
    }
    initArrives();
}


const getOptions = new Promise(function (resolve) {
    if (isWebExt) {
        browser.storage.local.get(function (items) {
            Object.assign(options, items);
            injectOptions.textContent = JSON.stringify(options);
            resolve();
        });
    } else {
        self.port.on('options', function (o) {
            Object.assign(options, o);
            resolve();
        })
    }
});

const getHead = new Promise(resolve => KPP.head(() => resolve()));

Promise.all([getOptions, getHead]).then(() => {
    if (options.enabled)
        init()
});

const getLang = new Promise(resolve => langResolve = resolve);

window.addEventListener('message', function (event) {
    if (!options.enabled)
        return;
    switch (event.data.type) {
        case 'VK_INFO':
            logTime('vk_msg');
            lang = langMap.hasOwnProperty(event.data.text.lang) ? event.data.text.lang : 3;
            document.documentElement.setAttribute('lang', langMap[lang]);
            langResolve(lang);
            Template.localize();
            break;
        case 'VK_EMOJI':
            emoji = event.data.text;
            break;
        case 'PUSH_URL':
            checkStyles(styles, event.data.text);
            initWide();
            break;
        case 'RELOAD_VK_TOP':
            Template.init();
            break;
        case 'SAVE_OPTION':
            if (isWebExt)
                browser.storage.local.set(event.data.opt);
            else
                self.port.emit('local', event.data.opt);
            break;
        /*case 'CUR_LANG':
            if (typeof lang !== 'undefined') {
                i18n.vkservices = {};
                i18n.vkservices[lang] = event.data.lang.vkconnect_sak_ecosystem_nav_services_title;
            }
            break;
        /*case 'vk-connect':
            if (event.data.handler === 'VKWebAppResizeWindow') {
                setLayoutWidth(event.data.params.width + 160 + 24);
            }
            break;*/
    }
});

function insertCSS(style) {
    const css = browser.runtime.getURL('content/' + style + '.css');
    if (!document.getElementById('oldvk-style-' + style)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        link.id = 'oldvk-style-' + style;
        document.head.insertAfter(link);
    }
}

function updateStyles(Styles) {
    for (const style in Styles) {
        if (Styles.hasOwnProperty(style) && Styles[style])
            document.head.classList.add('oldvk-' + style);
        else
            document.head.classList.remove('oldvk-' + style);
    }
}

function checkStyles(styles) {
    let Styles = {};
    const path = window.location.pathname.slice(1);
    styles.forEach(function (style) {
        Styles[style.css] = Styles[style.css] || path.startsWith(style.match)
    });
    updateStyles(Styles)
}

function headOptions() {
    const active = ['audio', 'date', 'font']; // Список требуемых опций для head
    active.forEach(function (option) {
        if (options['option' + option[0].toUpperCase() + option.slice(1)])
            document.head.classList.add('oldvk-option-' + option);
    })
}

function headFixes() { // Исправления для особых версий браузера
    const browserVersion = getBrowser();
    if (browserVersion.name === 'Firefox' && browserVersion.version < 54)
        document.head.classList.add('oldvk-ff-grid-fix1');
    if (browserVersion.name === 'Firefox' && browserVersion.version < 76)
        document.head.classList.add('oldvk-ff-grid-fix2');
}

function updateNotify() {
    const top_notify_count = document.getElementById('top_notify_count');
    if (!top_notify_count)
        return;
    const notifyCount = parseInt(top_notify_count.textContent, 10);
    if (notifyCount > 0) {
        document.getElementById('oldvk-notify-wrap').classList.add('has_notify');
        document.getElementById('oldvk-notify').textContent = notifyCount.toString()
    }
}

const Template = { // Шаблоны некоторых элементов страницы, которые далее локализируются 
    l_ntf: document.createElement('li'),
    l_edit: document.createElement('a'),
    l_set: document.createElement('li'),
    l_srv: document.createElement('li'),
    ntf: `<a href="/feed?section=notifications" class="left_row" onclick="return nav.go(this, event, {noback: true, params: {_ref: \'left_nav\'}});" onmouseover="TopNotifier.preload();"><span class="left_label inl_bl" data-oldvk-i18n="answers"></span><span class="left_count_wrap fl_r" id="oldvk-notify-wrap" onmouseover="TopNotifier.preload()" onmousedown="return TopNotifier.onBellMouseDown(event)" onclick="event.stopPropagation();TopNotifier.setCount(\'\',true);return TopNotifier.onBellClick(event)"><span class="inl_bl left_count" id="oldvk-notify"></span></span></a>`,
    sett: `<a href="/settings" class="left_row"><span class="left_label inl_bl" id="oldvk-settings" data-oldvk-i18n="settings"></span></a>`,
    top_menu: `<div class="head_nav_item fl_r"><a id="oldvk_top_exit" class="top_nav_link" href="" onclick="if (checkEvent(event) === false) { window.Notifier && Notifier.lcSend(\'logged_off\'); location.href = this.href; return cancelEvent(event); }" onmousedown="tnActive(this)"><div class="top_profile_name"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_help" class="top_nav_link" href="/support?act=home" onclick="return TopMenu.select(this, event);"><div class="top_profile_name"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_music" class="top_nav_link" href="" onclick="return (checkKeyboardEvent(event) ? AudioUtils.getLayer().toggle() : false);" onmouseover="AudioLayer.prepare()" onmousedown="return (checkKeyboardEvent(event) ? false : AudioUtils.getLayer().toggle(),cancelEvent(event))"><div class="top_profile_name" data-oldvk-i18n="music"></div><div id="oldvk_top_play" class="oldvk-hide" onclick="cancelEvent(event); if (getAudioPlayer().isPlaying()) {getAudioPlayer().pause(); removeClass(this,\'active\')} else {getAudioPlayer().play(); addClass(this,\'active\')}" onmousedown="cancelEvent(event);"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_apps" class="top_nav_link" href="/apps" onclick="return TopMenu.select(this, event);"><div class="top_profile_name" data-oldvk-i18n="games"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_communities" class="top_nav_link" href="/search?c[section]=communities" onclick="return TopMenu.select(this, event);"><div class="top_profile_name" data-oldvk-i18n="communities"></div></a></div><div class="head_nav_item fl_r"><a id="oldvk_top_peoples" class="top_nav_link" href="/search?c[section]=people" onclick="return TopMenu.select(this, event);"><div class="top_profile_name" data-oldvk-i18n="people"></div></a></div>`,
    im_menu: `<div class="page_block ui_rmenu ui_rmenu_pr" role="list"><a id="ui_rmenu_all" href="/im?tab=all" class="ui_rmenu_item" onclick="switchRightMenu(event.currentTarget); return nav.go(this, event);"><span>{all}</span></a><a id="ui_rmenu_unread" href="/im?tab=unread" class="ui_rmenu_item" onclick="switchRightMenu(event.currentTarget); return nav.go(this, event);"><span>{unread}</span></a><a id="ui_rmenu_mr" href="/im?tab=mr" class="ui_rmenu_item unshown" onclick="switchRightMenu(event.currentTarget); return nav.go(this, event);"><span>{invite}</span></a><div class="_im_ui_peers_list"></div></div>`,
    im_menu_item: `<a id="ui_rmenu_peer_{id}" href="/im?sel={id}" class="ui_rmenu_item" data-list-id="{id}" title="{name}"><span><span class="ui_rmenu_count im-right-menu--count"></span><button type="button" class="im-right-menu--close"></button><span class="im-right-menu--text">{name}</span></span></a>`,
    sidebar: {
        l_ap: 'apps',
        l_aud: 'audios',
        l_vid: 'videos',
        l_gr: 'groups',
        l_msg: 'messages'
    },

    init: function () { // Формирует пункты меню уведомлений, настроек и редактирования профиля
        this.l_ntf.id = 'l_ntf';
        this.l_ntf.innerHTML = this.ntf;
        this.l_edit.id = 'l_edit';
        this.l_edit.classList.add('fl_r');
        this.l_edit.href = '/edit';
        this.l10n(this.l_edit, 'edit');
        this.l_set.id = 'l_sett';
        //this.l_set.className = 'sep_after';
        this.l_set.innerHTML = this.sett;
        this.l_srv.id = 'l_srv';
    },

    l10n: function (element, key) { // Устанавливает текстовое содержание локализированного элемента либо атрибут для последующей локализации, если код языка еще не определен
        element.dataset.oldvkI18n = key;
        if (typeof lang !== 'undefined')
            element.textContent = i18n[key][lang]
    },
    localize: function () { // Локализирует элементы с предварительно установленными атрибутами локализации
        if (typeof lang !== 'undefined') {
            const items = document.querySelectorAll('[data-oldvk-i18n]');
            [].map.call(items, item => item.textContent = i18n[item.dataset.oldvkI18n][lang])
        }
    }
};

Template.init();

function updateMenu() {
    const side_bar_ol = document.getElementsByClassName('side_bar_ol')[0];

    if (!document.getElementById('l_ntf'))
        side_bar_ol.appendChild(Template.l_ntf);

    const l_edit_parent = document.querySelector('#l_pr a.left_row');
    if (!document.getElementById('l_edit') && l_edit_parent)
        l_edit_parent.appendChild(Template.l_edit);

    if (!document.getElementById('l_sett'))
        side_bar_ol.appendChild(Template.l_set);

    if (!document.getElementById('l_srv'))
        side_bar_ol.appendChild(Template.l_srv);

    const l_vid_r = document.querySelector('#l_vid .left_row');
    if (l_vid_r) l_vid_r.setAttribute('href', '/videos');

    const l_aud_r = document.querySelector('#l_aud .left_row');
    if (l_aud_r) l_aud_r.setAttribute('href', '/audio?section=all');

    if (Template.ecosystem) {
        let left_row = Template.l_srv.getElementsByClassName('left_row')[0];
        left_row.insertBefore(Template.ecosystem, left_row.firstChild);
    }

    // Расстановка разделителей

    /*[].forEach.call(side_bar_ol.querySelectorAll('.more_div'), more=>more.remove());

    const l_comm = side_bar_ol.querySelector('.l_comm');
    if (l_comm) l_comm.classList.add('sep_before');
    const l_app = side_bar_ol.querySelector('*[id^="l_app"]');
    if (l_app) l_app.classList.add('sep_before');

    //if (!Template.l_set.nextSibling) Template.l_set.classList.remove('sep_after');

        // Разделитель для первого элемента второй группы
    const lvl2 = ['l_ap','l_doc','l_mk','l_ca','l_svd','l_mini_apps', 'l_stickers']; 
    const lvl2_id = [].find.call(side_bar_ol.querySelectorAll('li'),li=>lvl2.includes(li.id));
    if (lvl2_id) lvl2_id.classList.add('sep_before');
    const lvl3 = ['l_srv','l_vkp','l_ads','l_apm','l_bt'];
    const lvl3_id = [].find.call(side_bar_ol.querySelectorAll('li'),li=>lvl3.includes(li.id));
    if (lvl3_id) lvl3_id.classList.add('sep_before');*/

    updateNotify()
}

function initArrives() { // Инициализация обработчиков появления элементов на странице

    logTime('initArrives');

    KPP.body(function () {
        logTime('body');
        document.body.style.visibility = 'hidden';
        document.body.style.backgroundColor = '#FFF';
    });

    KPP.add('#react_rootEcosystemServicesNavigationEntry', () => logTime('EcosystemServicesNavigationEntry'));
    KPP.add('.EcosystemServicesNavigationDropdown_popout__NYAnq', () => logTime('EcosystemServicesNavigationDropdown'));

    KPP.add('.side_bar_ol', function (element) {
        updateMenu();
        const sidebarObserver = new MutationObserver(() => updateMenu());
        sidebarObserver.observe(element, {childList: true})
    }, {postpone: true}); // true // Означает, что обработчик запустится не сразу, а по наступлению события DOMContentLoaded

    KPP.add('.side_bar_ol > li .left_label', function (left_label) {
        const id = left_label.closest('li').id;
        if (Template.sidebar.hasOwnProperty(id))
            Template.l10n(left_label, Template.sidebar[id])
    }, {postpone: false});

    KPP.add('#top_nav', function (element) {
        KPP.remove('#top_nav');
        const oldvk_top_menu = document.createElement('div');
        oldvk_top_menu.id = "oldvk_top_menu";
        oldvk_top_menu.innerHTML = Template.top_menu;
        const top_nav = document.getElementById('top_nav');
        if (!document.getElementById('oldvk_top_menu')) top_nav.appendChild(oldvk_top_menu);
        const oldvk_top_music = document.getElementById('oldvk_top_music');
        const top_audio_layer_place = document.getElementById('top_audio_layer_place')
        if (oldvk_top_music && top_audio_layer_place)
            oldvk_top_music.insertAfter(top_audio_layer_place);
        Template.ecosystem = document.getElementById('react_rootEcosystemServicesNavigationEntry');
        if (Template.ecosystem) {
            const l_srv_a = document.createElement('a');
            l_srv_a.className = 'left_row';
            Template.l_srv.appendChild(l_srv_a);
            const l_srv_label = document.createElement('span');
            l_srv_label.className = 'left_label inl_bl';
            logTime('vkservices');
            Template.l10n(l_srv_label, 'vkservices');
            l_srv_a.appendChild(l_srv_label);
            l_srv_a.insertBefore(Template.ecosystem, l_srv_a.firstChild);
        }
        ;
        Template.localize();
    }, {postpone: true}); // true

    KPP.add('#top_logout_link', () => logTime('top_logout_link'));
    KPP.add('#top_support_link', () => logTime('top_support_link'));

    KPP.add('#top_profile_menu', function (top_profile_menu) {
        const oldvk_top_exit = document.getElementById('oldvk_top_exit');
        const top_logout_link = document.getElementById('top_logout_link');
        const oldvk_top_help = document.getElementById('oldvk_top_help');
        const top_support_link = document.getElementById('top_support_link');
        if (oldvk_top_exit && top_logout_link) {
            oldvk_top_exit.firstElementChild.textContent = top_logout_link.textContent.toLowerCase();
            oldvk_top_exit.href = top_logout_link.href;
        } else
            oldvk_top_exit.classList.add('unshown');
        if (oldvk_top_help && top_support_link)
            oldvk_top_help.firstElementChild.textContent = top_support_link.textContent.toLowerCase();
        else
            oldvk_top_help.classList.add('unshown');
    }, {postpone: true}); // true

    // Обложка страниц и аватарки

    KPP.add('.page_cover', function (element) {
        if (options.optionCover) {
            element.classList.add('adapted')
        } else {
            const page_actions = document.getElementsByClassName('group_actions_wrap')[0];
            const nc = document.getElementById('narrow_column');
            const page_block = document.createElement('div');
            page_block.className = 'page_block page_photo';
            page_block.innerHTML = '<div class="page_avatar_wrap"><div class="page_avatar" id="page_avatar"></div></div>';
            page_block.appendChild(page_actions);
            const page_avatar_a = document.getElementsByClassName('page_cover_image')[1];
            page_avatar_a.className = '';
            page_avatar_a.firstElementChild.className = 'page_avatar_img';
            if (page_avatar_a.hasAttribute('onclick')) {
                const temp = JSON.parse(page_avatar_a.getAttribute('onclick').match(/{.*}/)[0]).temp;
                page_avatar_a.firstElementChild.setAttribute('src', temp.base + temp.x_[0] + '.jpg');
            }
            nc.insertBefore(page_block, nc.firstChild);
            document.getElementById('page_avatar').appendChild(page_avatar_a)
        }
    });

    KPP.add('#friends', function (element) {
        const urr = document.getElementById('ui_rmenu_requests');
        if (urr) {
            urr.className = 'ui_tab';
            const ftr = document.createElement('li');
            ftr.id = 'friends_tab_requests';
            urr.setAttribute('onclick', urr.getAttribute('onclick').replace('Menu', 'Tab'));
            ftr.appendChild(urr);
            if (document.getElementById('friends_tab_online')) document.getElementById('friends_tab_online').insertAfter(ftr);
            if (element.classList.contains('friends_requests')) {
                urr.classList.add('ui_tab_sel');
                document.getElementById('friends_tab_all').firstElementChild.classList.remove('ui_tab_sel')
            }
        }
        if (document.getElementsByClassName('ui_search_fltr')[0]) document.getElementsByClassName('ui_search_fltr')[0].appendChild(document.getElementsByClassName('ui_rmenu')[0]);
        else document.getElementsByClassName('ui_rmenu')[0].parentNode.removeChild(document.getElementsByClassName('ui_rmenu')[0]);
        if (document.getElementById('friends_tabs_wrap')) {
            document.getElementById('friends_tabs_wrap').appendChild(document.getElementById('friends_list_edit_btn'));
            document.getElementById('friends_tabs_wrap').appendChild(document.getElementById('friends_list_delete_btn'));
            const urs = document.createElement('div');
            urs.className = 'ui_rmenu_sep';
            if (document.getElementById('ui_rmenu_lists_list')) document.getElementById('ui_rmenu_lists_list').insertBefore(urs, document.getElementsByClassName('friends_create_list')[0])
        } else {
            element.firstElementChild.insertAfter(document.getElementById('friends_import_block'));
            const uhes = document.getElementsByClassName('ui_header_ext_search')[0];
            document.getElementById('friends_import_block').appendChild(uhes);
            uhes.className = 'friends_import_row clear_fix';
            const fie = document.createElement('div');
            fie.className = 'friends_import_icon friends_import_extended';
            const fic = document.createElement('div');
            fic.className = 'friends_import_cont';
            const fih = document.createElement('div');
            fih.className = 'friends_import_header';
            fih.textContent = uhes.textContent;
            fic.appendChild(fih);
            uhes.appendChild(fie);
            uhes.appendChild(fic);
            uhes.firstChild.textContent = '';
            const fta = document.createElement('div');
            fta.id = 'friends_tab_all';
            const fta_a = document.createElement('a');
            fta_a.className = 'ui_tab';
            fta_a.href = '/friends?section=all';
            Template.l10n(fta_a, 'all_friends');
            fta.appendChild(fta_a);
            const ft_w = document.createElement('div');
            ft_w.className = 'friends_tabs_wrap ui_tabs_header ui_tabs';
            element.insertBefore(ft_w, document.getElementById('friends_import_header'));
            ft_w.appendChild(fta);
            ft_w.appendChild(document.getElementById('friends_import_header'));
            element.insertBefore(document.getElementById('friends_filters_header'), document.getElementById('results'));
            const sqw = document.getElementById('search_query_wrap');
            let ffb_top;
            if (sqw)
                ffb_top = sqw.clientHeight + sqw.offsetTop;
            const ffb = document.getElementById('friends_filters_block');
            if (ffb && ffb_top)
                ffb.style.top = ffb_top + 'px';
        }
    });

    KPP.add('.im-chat-input--textarea', function (chat) {
        const emoji_div = document.createElement('div');
        emoji_div.id = 'oldvk-emoji';
        chat.appendChild(document.getElementsByClassName('im-chat-input--send')[0]);
        chat.appendChild(document.getElementsByClassName('im-chat-input--selector')[0]);
        wait(() => emoji, function () {
            emoji_div.innerHTML = emoji.html.map(function (e, i) {
                return `<a class="emoji_smile_cont" onmousedown="Emoji.addEmoji(Emoji.last - 1,\'${emoji.emoji[i]}\', this); return cancelEvent(event);" onclick="return cancelEvent(event);" onmouseover="return Emoji.emojiOver(Emoji.last - 1, this, true);">${e}</a>`
            }).join('');
            chat.insertBefore(emoji_div, document.getElementsByClassName('im-chat-input--selector')[0]);
        });
        const avatar1 = document.createElement('img');
        avatar1.src = document.getElementsByClassName('TopNavBtn__profileImg')[0].src;
        avatar1.className = 'oldvk-chat-avatar';
        chat.parentNode.insertBefore(avatar1, chat);

        KPP.add('.im-page--aside-photo .nim-peer--photo', function (element) {
            const avatars = element.getElementsByTagName('img');
            let tmp = chat.parentNode.getElementsByClassName('oldvk-chat-avatar-wrap');
            for (let i = tmp.length; i--;) {
                tmp[i].remove();
            }
            tmp = chat.parentNode.getElementsByClassName('oldvk-chat-avatar-2');
            for (let i = tmp.length; i--;) {
                tmp[i].remove();
            }

            const wrap = document.createElement('div');
            wrap.className = 'oldvk-chat-avatar-wrap';
            if (avatars.length === 2)
                wrap.classList.add('wide');

            for (let i = avatars.length; i--;) {
                avatars[i].className = 'oldvk-chat-avatar-2' + ' oldvk-chat-avatar' + (avatars.length >= 3 ? '-small' : '');
                wrap.appendChild(avatars[i].cloneNode(false))
            }

            chat.insertAfter(wrap);

            if (avatars.length === 1 && document.getElementsByClassName('_im_page_peer_online')[0].textContent === 'online')
                wrap.classList.add('online');

            const iphm = document.getElementsByClassName('im-page--header-more');
            const iphc = document.getElementsByClassName('im-page--header-call');
            const ipchi = document.getElementsByClassName('im-page--chat-header-in');
            if (iphm.length > 0)
                document.getElementsByClassName('im-page--chat-header')[0].insertBefore(iphm[0], ipchi[0])
            if (iphc.length > 0)
                document.getElementsByClassName('im-page--chat-header')[0].insertBefore(iphc[0], ipchi[0])
        });

        if (!options.optionIm) {
            const ipma = document.querySelectorAll('.im-page--mess-actions .im-page-action');
            [].map.call(ipma, item => item.classList.add('flat_button'));
            Template.l10n(document.getElementsByClassName('im-page-action_delete')[0], 'delete');
            Template.l10n(document.getElementsByClassName('im-page-action_spam')[0], 'spam');
        }
    });

    KPP.add('body:not(.blog_page) #ui_rmenu_news_list', function (element) {
        const ont = document.createElement('ul');
        ont.id = 'oldvk-news-tabs';
        ont.className = 'ui_tabs ui_tabs_header clear_fix';
        const urn = document.getElementById('ui_rmenu_news');
        const uru = document.getElementById('ui_rmenu_updates');
        const urc = document.getElementById('ui_rmenu_comments');
        const urs = document.getElementById('ui_rmenu_search');
        urn.classList.add('ui_tab');
        uru.classList.add('ui_tab');
        urc.classList.add('ui_tab');
        urs.classList.add('ui_tab');
        let tmp = element.parentNode.getElementsByClassName('ui_rmenu_item');
        for (let i = tmp.length; i--;) tmp[i].setAttribute('onclick', 'newsMenuTabs(this);' + tmp[i].getAttribute('onclick'));
        tmp = element.parentNode.getElementsByClassName('ui_rmenu_subitem');
        for (let i = tmp.length; i--;) tmp[i].setAttribute('onclick', 'newsMenuTabs(this);' + tmp[i].getAttribute('onclick'));
        ont.appendChild(urn);
        ont.appendChild(uru);
        ont.appendChild(urc);
        ont.appendChild(urs);
        element.parentNode.parentNode.insertBefore(ont, element.parentNode);
        const urnl = document.getElementById('ui_rmenu_news_list');
        urnl.appendChild(document.getElementById('ui_rmenu_recommended'));
        //urnl.appendChild(document.getElementById('ui_rmenu_articles'));
        if (!(urn.classList.contains('ui_rmenu_item_sel') || document.querySelector('#ui_rmenu_news_list .ui_rmenu_item_sel'))) element.parentNode.classList.add('unshown');
        const fali = document.getElementById('feed_add_list_icon');
        fali.classList.add('ui_rmenu_subitem');
        urnl.insertBefore(fali, urnl.firstChild);
        const spb = document.getElementById('submit_post_box');
        if (spb) document.getElementById('feed_filters').parentNode.insertBefore(spb, document.getElementById('feed_filters'));
    });

    KPP.add('#ui_rmenu_communities_list', function (element) {
        element.parentNode.appendChild(element);
        document.getElementById('ui_rmenu_communities').addEventListener('click',
            () => setTimeout(() => document.getElementById('ui_rmenu_communities_list').style.display = 'block', 200))
    });

    KPP.add('#search_filters_block', function (element) {
        const fl = document.createElement('div');
        fl.id = 'oldvk-filter-label';
        element.parentNode.insertBefore(fl, document.getElementById('search_filters_block'))
    });

    KPP.add('#profile #wide_column', function (element) {

        const name = element.getElementsByClassName('page_name')[0].childNodes[0].textContent.split(' ');
        if (name[name.length - 1].substr(name[name.length - 1].length - 1) === ')')
            name.pop();
        const title = document.createElement('div');
        title.id = 'oldvk_profile_title';
        title.textContent = name.shift() + ' ' + name.pop();
        document.getElementById('wrap1').insertBefore(title, document.getElementById('content'));

        const sub = document.querySelector('.page_counter[onclick*="fans"]');
        const tag = document.querySelector('.page_counter[href^="/tag"]');
        if (sub || tag) {
            const counters = document.createElement('div');
            counters.id = 'oldvk-counters';
            if (tag) {
                const tag_c = document.createElement('a');
                tag_c.className = 'oldvk-counter';
                tag_c.id = 'oldvk-counter-tag';
                const tag_cs = document.createElement('span');
                tag_cs.textContent = tag.firstElementChild.textContent;
                tag_cs.className = 'fl_r';
                tag_c.setAttribute('onclick', tag.getAttribute('onclick'));
                tag_c.setAttribute('href', tag.getAttribute('href'));
                tag_c.appendChild(tag_cs);
                counters.appendChild(tag_c)
            }
            if (sub) {
                const sub_c = document.createElement('a');
                sub_c.className = 'oldvk-counter';
                sub_c.id = 'oldvk-counter-sub';
                const sub_cs = document.createElement('span');
                sub_cs.textContent = sub.firstElementChild.textContent;
                sub_cs.className = 'fl_r';
                sub_c.setAttribute('onclick', sub.getAttribute('onclick'));
                const sub_id = sub_c.getAttribute('onclick').match(/\d+/)[0];
                sub_c.setAttribute('href', `/friends?id=${sub_id}&section=subscribers`);
                sub_c.appendChild(sub_cs);
                counters.appendChild(sub_c)
            }
            document.getElementsByClassName('page_photo')[0].appendChild(counters)
        }
    });

    KPP.add('#profile_wall, #public_wall, #group_wall', function (element) {
        const spb = document.getElementById('submit_post_box');
        if (spb) element.firstElementChild.insertAfter(spb);
    });

    KPP.add('#profile .page_extra_actions_wrap .page_actions_inner', function (element) {
        document.getElementsByClassName('page_actions_cont')[0].style.display = 'none';
        document.getElementsByClassName('narrow_column_wrap')[0].appendChild(element);
        const psgb = document.getElementById('profile_send_gift_btn');
        const pgsb = document.getElementById('profile_gift_send_btn');
        if (psgb && !pgsb) {
            psgb.className = 'page_actions_item';
            psgb.textContent = psgb.getElementsByClassName('profile_side_text')[0].textContent;
            element.insertBefore(psgb, element.firstChild)
        }
    });

    KPP.add('.people_cell_name a', function (element) {
        const br = document.createElement('br');
        const span = document.createElement('span');
        span.textContent = decodeHtml(element.parentNode.parentNode.querySelector('img').alt.split(' ').pop());
        element.appendChild(br);
        element.appendChild(span);
    });

    function getFirstPhotoRow(pr) {
        if (!pr.previousElementSibling || pr.previousElementSibling.classList.contains('photos_period_delimiter'))
            return pr;
        else return getFirstPhotoRow(pr.previousElementSibling)
    }

    KPP.add('.photos_row', function (element) {
        if (document.getElementsByClassName('photos_period_delimiter').length > 0 || document.getElementsByClassName('photos_row_wrap').length > 0) {
            getFirstPhotoRow(element.parentElement).appendChild(element);
        }
    });

    if (!options.optionViewer) {
        KPP.add('.pe_canvas', function (element) {
            element.style.marginTop = element.parentNode.firstChild.offsetTop + 'px';
            element.style.marginLeft = element.parentNode.firstChild.offsetLeft + 'px';
            document.getElementsByClassName('pv_cont')[0].style.paddingLeft = '0'
        })
    }

    KPP.add('.im-page--members', function () {
        const ipch = document.querySelectorAll('.im-page--members');
        if (ipch.length > 0)
            for (let i = 1, l = ipch.length; i < l; i++)
                ipch[i].remove();
        document.getElementsByClassName('im-page--chat-header')[0].appendChild(ipch[0]);
    });

    KPP.add('#ui_rmenu_members_list', function (urml) {
        const urel = document.getElementById('ui_rmenu_edit_list');
        urel.parentNode.appendChild(urel);
        urml.parentNode.appendChild(urml)
    });

    KPP.add('#ui_rmenu_arhive', function (ura) {
        const urel = document.getElementById('ui_rmenu_news');
        urel.insertAfter(ura)
    });

    KPP.add('.im-right-menu', function (irm) {
        const ian = irm.getElementsByClassName('im-aside-notice');
        const ipd = document.getElementsByClassName('im-page--dialogs')[0];
        const id = document.getElementById('im_dialogs');
        if (ian.length > 0)
            for (let i = 0, l = ian.length; i < l; i++)
                ipd.insertBefore(ian[i], id);
        const igodn = document.getElementById('im-group-online-disabled-notice');
        if (igodn)
            ipd.insertBefore(igodn, id)
    });

    // Перенос даты поста вниз

    if (!options.optionDate) {
        KPP.add('.post', function (post) {
            const pd = post.getElementsByClassName('post_date')[0];
            const wt = post.getElementsByClassName('wall_text')[0];
            const pfl = post.getElementsByClassName('post_full_like')[0];
            const lw = post.getElementsByClassName('like_wrap')[0];
            if (pd && pfl) {
                pfl.insertBefore(pd, pfl.firstElementChild);
                // pd.style.outline = '1px #F55 dashed'; // debug
            } else if (pd && wt) {
                if (lw)
                    lw.insertBefore(pd, lw.firstChild);
                else
                    wt.parentElement.appendChild(pd)
            }
        });

        KPP.add('.ShortVideoPost', function (post) {
            const pd = post.getElementsByClassName('ShortVideoPost__date')[0];
            const pw = post.getElementsByClassName('ShortVideoPost__widgets')[0];
            if (pd && pw)
                pw.insertBefore(pd, pw.firstElementChild)
        });
    }

    // Обработка изображений для расширения стены

    KPP.add('.wall_posts .page_post_sized_thumbs:not(.oldvk-thumb-narrow), .wall_posts .page_album_thumb_wrap:not(.oldvk-thumb-narrow)', function (thumb) {
        const top = thumb.getBoundingClientRect().top + document.documentElement.scrollTop;
        //console.log('narrow', document.getElementById('narrow_column').offsetHeight, top);
        if (top < topStop) {
            let factor = thumb.matches('.wall_module:not(#profile_wall) .post_fixed .page_post_sized_thumbs, .wall_module:not(#profile_wall) .post_fixed .page_album_thumb_wrap') ? 0.77 : 0.66;
            if (thumb.matches('.replies_list_deep .page_post_sized_thumbs'))
                factor = 0.615;
            //factor = options.layout ? factor * (options.layout / 791) : factor;
            const narrow = thumb.cloneNode(true);
            narrow.classList.add('oldvk-thumb-narrow');
            thumb.insertAfter(narrow);
            resizeNarrow(narrow, factor + 0.01);
            thumb.classList.add('oldvk-thumb-wide');

            if (narrow.childElementCount > 0) {
                [].slice.call(narrow.children).forEach(function (child) {
                    if (child.tagName === 'A' || child.classList.contains('page_doc_photo'))
                        resizeNarrow(child, factor)
                })
            }
        }
    });

    /*KPP.add('.page_post_sized_thumbs a, .wall_posts .page_album_thumb_wrap a', function (element) {
        if (element.style.backgroundImage) {
        const helper = document.createElement('img');
        helper.src = element.style.backgroundImage.match(/(?:\(['"]?)(.*?)(?:['"]?\))/)[1];
        helper.className = 'imghelper';
        element.appendChild(helper);
        }
    });*/

    KPP.add('.wall_posts .page_gif_large:not(.oldvk-thumb-narrow)', function (gif) {
        const top = gif.getBoundingClientRect().top + document.documentElement.scrollTop;
        if (top < topStop) {
            const factor = gif.matches('.wall_module:not(#profile_wall) .post_fixed .page_gif_large') ? 0.77 : 0.66;
            const narrow = gif.cloneNode(true);
            narrow.classList.add('oldvk-thumb-narrow');
            gif.parentElement.insertBefore(narrow, gif);
            resizeNarrow(narrow.getElementsByClassName('page_doc_photo')[0], factor);
            resizeNarrow(narrow.getElementsByClassName('page_doc_photo_href')[0], factor);
            gif.classList.add('oldvk-thumb-wide');
        }
    });

    // Пункт меню «Понравилось»

    KPP.add('#ui_rmenu_likes', function (likes) {
        const menu = document.getElementById('ui_rmenu_news_list');
        if (menu)
            menu.appendChild(likes)
    });

    // Счетчик лайков для реакций

    KPP.add('.PostButtonReactions', function (reactions) {
        let count = reactions.dataset.reactionCounts;
        if (count && !(reactions.dataset.reactionButtonTextIsCounter)) {
            count = JSON.parse(count);
            if (!Array.isArray(count)) {
                count = Object.values(count)
            }
            let likes = count.reduce((previous, current) => previous + current)
            reactions.getElementsByClassName('PostButtonReactions__title')[0].textContent = likes;
        }
        reactions.dataset.reactionButtonTextIsCounter = '1';

        const target = reactions.dataset.reactionTargetObject;
        if (target)
            reactions.setAttribute('onmouseover', `Likes.showLikes(this,\'${target}\')`)
    });

    // Меню в разделе багрепортов

    let BtTopMenu;

    KPP.add('#BtTopMenu', element => BtTopMenu = element);

    KPP.add('.BtPage .narrow_column_wrap, .BtCommunityPage', element => {
        if (BtTopMenu)
            element.parentNode.insertBefore(BtTopMenu, element)
    });

    // Плашка в сообществах

    KPP.add('#public, #group', function (element) {
        const title = document.createElement('div');
        title.id = 'oldvk_profile_title';
        Template.l10n(title, element.id);
        document.getElementById('wrap1').insertBefore(title, document.getElementById('content'));
    });

    KPP.add('.group_closed_text', function (element) {
        const title = document.getElementById('oldvk_profile_title');
        if (title)
            delete title.dataset.oldvkI18n;
        title.textContent = element.textContent;
    });

    // Меню для нового интерфейса сообщений

    KPP.add('.im-page:not(.im-page_classic)', function (element) {
        const im_right_menu = document.createElement('div');
        im_right_menu.className = 'im-right-menu';
        im_right_menu.innerHTML = Template.im_menu;
        element.appendChild(im_right_menu);
        const params = new URLSearchParams(window.location.search);
        const tab = params.has('tab') ? params.get('tab') : 'all';
        document.getElementById('ui_rmenu_' + tab).classList.add('ui_rmenu_item_sel');
    });

    KPP.add('.im-page:not(.im-page_classic) .nim-dialog--who', function (element) {
        const profile_img = document.getElementsByClassName('TopNavBtn__profileImg')[0];
        if (profile_img) {
            const im_prebody = document.createElement('div');
            im_prebody.className = 'im-prebody';
            element.textContent = '';
            im_prebody.appendChild(profile_img.cloneNode());
            element.appendChild(im_prebody);
        }
    });
}

function resizeNarrow(element, factor) {
    /*if (element.style.backgroundImage) {
        const helper = document.createElement('img');
        helper.src = element.style.backgroundImage.match(/(?:\(['"]?)(.*?)(?:['"]?\))/)[1];
        helper.className = 'imghelper';
        element.appendChild(helper);
    }*/
    element.style.width = Math.floor(element.clientWidth * factor) + 'px';
    element.style.height = Math.floor(element.clientHeight * factor) + 'px';
    if (element.classList.contains('page_doc_photo_href')) {
        element.dataset.width = Math.floor(element.dataset.width * factor).toString();
        element.dataset.height = Math.floor(element.dataset.height * factor).toString();
    }
}

function updating(path) {
    switch (path) {
        case 'friends':
            window.postMessage({type: "UPD", text: path}, '*');
            break;
        case 'im':
            const im = new URLSearchParams(window.location.search);
            if (im.has('sel'))
                window.postMessage({type: "IM", text: im.get('sel')}, '*');
            break;
    }
}