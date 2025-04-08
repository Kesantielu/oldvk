const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const layout = document.getElementById('layout');
const layoutWrap = document.getElementById('layout_wrap');
//const status_ = document.getElementById('status');

localize();

/*function setStatus(text, error) {
    status_.textContent = text;
    status_.classList.remove('hide');
    if (error)
        status_.classList.add('error')
    else
        setTimeout(() => status_.classList.add('hide'), 20);
}
*/

function submitOptions() {
    checkboxes.forEach(checkbox => options[checkbox.id] = checkbox.checked)
    browser.storage.local.set(options);
    // setStatus(browser.i18n.getMessage('saved'));
}

browser.storage.local.get(options => {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', submitOptions);
        checkbox.checked = options[checkbox.id];
    });

    layout.value = options.layout ? options.layout : layout.min;
    layoutWrap.setAttribute('data-value', layout.value);
    layout.addEventListener('input', () => {
        layoutWrap.setAttribute('data-value', layout.value);
        browser.storage.local.set({layout: layout.value});
        //changeLayout(layout.value);
    })
});


/*async function changeLayout(value) {
    browser.tabs.query({active: true, url: '*://vk.com/!*'}, function (tabs) {
        tabs.forEach(function (tab) {
            browser.tabs.sendMessage(tab.id, {action: 'layout', value: layout.value}, result => {
                if (chrome.runtime.lastError) {
                    console.warn('Layout: ' + chrome.runtime.lastError.message);
                    setStatus(browser.i18n.getMessage('reload'), true);
                }
            })
        })
    })
}*/
