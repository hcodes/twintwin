var $ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

$._fromHTML = document.createElement('div');
$.fromHTML = function(data) {
    this._fromHTML.innerHTML = jstohtml(data);
    var result = this._fromHTML.firstElementChild;
    this._fromHTML.innerHTML = '';

    return result;
};

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

var $$ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelectorAll(el) : el;
};

var setCSS = function(el, props) {
    var style = el.style;
    Object.keys(props).forEach(function(key) {
        style[key] = props[key];
    });
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
