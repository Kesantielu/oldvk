var wide;

var injectEnd = document.createElement('script');
injectEnd.type = 'text/javascript';
injectEnd.src = isWebExt ? chrome.extension.getURL('content/injectEnd.js') : self.options.inject;

if (options.enabled || !isWebExt) {
    document.body.appendChild(injectEnd);
    initWide();

    if (isWebExt)
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.action === 'updating') {
                initWide();
                setTimeout(function () {
                    initWide()
                }, 500); // TODO: Найти лучшее решение
            }
        });

    var leftMenuObserver = new MutationObserver(function (m) {
        LocalizedContent.updateMenu();
    });
    if (document.querySelector('#side_bar_inner ol'))
        leftMenuObserver.observe(document.querySelector('#side_bar_inner ol'), {childList: true});

    var fw = document.getElementById('footer_wrap');
    if (fw)
        fw.appendChild(document.getElementsByClassName('left_menu_nav_wrap')[0])

    /*KPP.add('.apps_i_wrap', function (element) {
        document.body.classList.remove('static_header')
    })*/

}