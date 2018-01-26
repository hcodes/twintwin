// Yandex.Metrika
function prepareParam(value) {
    return window.encodeURIComponent((value || '').substr(0, 512));
}

const Metrika = {
    hit(id) {
        var pageUrl = prepareParam(window.location.href),
            pageRef = prepareParam(document.referrer);

        new Image().src = 'https://mc.yandex.ru/watch/' + id +
            '?page-url=' + pageUrl +
            '&page-ref=' + pageRef;
    }
};

export default Metrika;
