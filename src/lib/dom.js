import jstohtml from 'jstohtml';

const _$ = function(el, context) {
    if (typeof context === 'string') {
        context = document.querySelector(context);
    }

    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

export function $(el, context) {
    const res = _$(el, context);
    if (!res) {
        console.error('Can\'t find DOM element "' + el + '"', context);
    }

    return res;
}

$.js2dom = function(data) {
    const div = document.createElement('div');
    div.innerHTML = jstohtml(data);

    return div.firstChild;
};

$.on = function(el, type, callback) {
    $(el).addEventListener(type, callback, false);

    return $;
};

$.delegate = function(root, el, type, callback) {
    $(root).addEventListener(type, function(e) {
        let node = e.target;
        for (; node !== root; node = node.parentNode || root) {
            let cls = el[0] === '.' ? el.substr(1) : el;
            if (node.classList.contains(cls)) {
                callback.call(node, e);
            }
        }
    }, false);

    return $;
};

$.off = function(el, type, callback) {
    $(el).removeEventListener(type, callback, false);

    return $;
};

$.move = function(elem, left, top) {
    $.css(elem, {left: left + 'px', top: top + 'px'});
};

$.size = function(elem, width, height) {
    $.css(elem, {width: width + 'px', height: height + 'px'});
};

$.css = function(el, props) {
    const style = el.style;
    Object.keys(props).forEach(function(key) {
        style[key] = props[key];
    });
};

$.show = function(el) {
    $(el).style.display = 'block';
};

$.hide = function(el) {
    $(el).style.display = 'none';
};

$.offset = function(el) {
    let box = {top: 0, left: 0};

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (el && typeof el.getBoundingClientRect !== 'undefined') {
        box = el.getBoundingClientRect();
    }

    return {
        top: box.top  + (window.pageYOffset || document.scrollTop || 0) - (document.clientTop  || 0),
        left: box.left + (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
    };
};

export function $$(el, context) {
    return typeof el === 'string' ? (context || document).querySelectorAll(el) : el;
}

export const hasSupportCss = (function() {
    const
        div = document.createElement('div'),
        vendors = 'Khtml ms O Moz Webkit'.split(' ');

    let len = vendors.length;

    return function(prop) {
        if (prop in div.style) {
            return true;
        }

        prop = prop.replace(/^[a-z]/, function(val) {
            return val.toUpperCase();
        });

        while (len--) {
            if (vendors[len] + prop in div.style) {
                return true;
            }
        }

        return false;
    };
})();
