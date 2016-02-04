var $ = function(el, context) {
    if (typeof context === 'string') {
        context = document.querySelector(context);
    }

    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

$.js2dom = function(data) {
    this.js2dom._div.innerHTML = jstohtml(data);
    var result = this.js2dom._div.firstElementChild;
    this.js2dom._div.innerHTML = '';

    return result;
};

$.js2dom._div = document.createElement('div');

$.on = function(el, type, callback) {
    $(el).addEventListener(type, callback, false);

    return $;
};

$.delegate = function(root, el, type, callback) {
    $(root).addEventListener(type, function(e) {
        var cls = el[0] === '.' ? el.substr(1) : el;
        if (e.target.classList.contains(cls)) {
            callback.call(e.target, e);
        }
    }, false);

    return $;
};

$.off = function(el, type, callback) {
    $(el).removeEventListener(type, callback, false);

    return $;
};

$.extend = function(dest, source) {
    Object.keys(source).forEach(function(key) {
        if(typeof dest[key] === 'undefined') {
           dest[key] = source[key];
        }
    });

    return dest;
};

$.move = function(elem, left, top) {
    $.css(elem, {left: left + 'px', top: top + 'px'});
};

$.size = function(elem, width, height) {
    $.css(elem, {width: width + 'px', height: height + 'px'});
};

$.css = function(el, props) {
    var style = el.style;
    Object.keys(props).forEach(function(key) {
        style[key] = props[key];
    });
};

var $$ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelectorAll(el) : el;
};

var hasSupportCss = (function() {
    var div = document.createElement('div'),
        vendors = 'Khtml ms O Moz Webkit'.split(' '),
        len = vendors.length;

    return function(prop) {

        if (prop in div.style) return true;

        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });

        while(len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            }
        }

        return false;
    };
})();
