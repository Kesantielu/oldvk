let wide;

Template.localize();

const injectEnd = document.createElement('script');
injectEnd.type = 'text/javascript';
injectEnd.src = isWebExt ? browser.runtime.getURL('content/injectEnd.js') : self.options.inject;

function videoShowcase() {
    if (document.body.classList.contains('video_showcase')) {
        document.body.classList.remove('video_showcase');
        document.body.classList.add('oldvk_video');
    }
}

if (options.enabled || !isWebExt) {
    document.body.appendChild(injectEnd);
    initWide();
    updateMenu();
    if (isWebExt) {
        browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.action === 'updating') {
                initWide();
                setTimeout(() => initWide(), 500); // TODO: Найти лучшее решение
            }
            ;
            sendResponse({result: true})
        });
        if (options.layout)
            setLayoutWidth(options.layout);
    }

    const footer_wrap = document.getElementById('footer_wrap');
    const left_menu_nav_wrap = document.getElementsByClassName('left_menu_nav_wrap')[0];
    if (footer_wrap && left_menu_nav_wrap)
        footer_wrap.appendChild(left_menu_nav_wrap);

    KPP.add('.apps_i_wrap', () => document.body.classList.remove('static_header'));

    if (!localStorage.oldvk_pvLarge)
        localStorage.setItem('oldvk_pvLarge', options.oldvk_pvLarge);
    if (!localStorage.oldvk_pvDark)
        localStorage.setItem('oldvk_pvDark', options.oldvk_pvDark);

    const bodyObserver = new MutationObserver(() => videoShowcase())
    videoShowcase();
    bodyObserver.observe(document.body, {attributes: true})
}

function initWide() {
    if (!document.getElementById('content')) return;
    const contentID = document.getElementById('content').firstElementChild.id;
    const wideApplicable = (contentID === 'profile' || contentID === 'group' || contentID === 'public');
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

function checkWide() {
    if (!document.getElementById('narrow_column')) return;
    if (wide !== (document.getElementById('narrow_column').getBoundingClientRect().bottom < 0)) {
        wide = !wide;
        if (wide) {
            document.getElementById('wide_column').classList.add('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'absolute';
        } else {
            document.getElementById('wide_column').classList.remove('wide');
            document.getElementsByClassName('narrow_column_wrap')[0].style.position = 'relative';
        }
    }
}