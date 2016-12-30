var injectEnd = document.createElement('script');
injectEnd.type = 'text/javascript';
injectEnd.src = self.options.inject;

document.body.appendChild(injectEnd);
initWide();

var leftMenuObserver = new MutationObserver(function (m) {
    LocalizedContent.updateMenu();
});
try {
    leftMenuObserver.observe(document.querySelector('#side_bar_inner ol'), {childList: true});
} catch (e) {
    console.warn(window.location.href, 'sidebar does not exist on this page')
}