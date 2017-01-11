var wide;
var topStop = 3000;

function initResize() {

    KPP.add('.page_post_sized_thumbs', function (e) {
        var element = e;
        resizing(element, function () {
            Zoom.minus(element);
            Array.prototype.forEach.call(element.childNodes, function (node) {
                Zoom.minus(node)
            });
            element.classList.add('oldvk-resized');
        })
    });

    KPP.add('.page_gif_large', function (e) {
        var element = e;
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
        element.style.width = parseFloat(element.style.width) / Zoom.factor + 'px';
        element.style.height = parseFloat(element.style.height) / Zoom.factor + 'px';
    },
    minus: function (element) {
        element.style.width = parseFloat(element.style.width) * Zoom.factor + 'px';
        element.style.height = parseFloat(element.style.height) * Zoom.factor + 'px';
    },
    plus_d: function (element) {
        element.dataset.width = element.dataset.width / Zoom.factor;
        element.dataset.height = element.dataset.height / Zoom.factor
    },
    minus_d: function (element) {
        element.dataset.width = element.dataset.width * Zoom.factor;
        element.dataset.height = element.dataset.height * Zoom.factor
    }
};