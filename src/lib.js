Array.prototype.shuffle = function () {
    var input = this;
    for (var i = input.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
};

var $ = function(el, context) {
    return typeof el === 'string' ? (context || document).querySelector(el) : el;
};

$.on = function(el, type, callback) {
    $(el).addEventListener(type, callback, false);

    return $;
};

$.delegate = function(root, el, type, callback) {
    $(root).addEventListener(type, function(e) {
        var cls = el[0] === '.' ? el.substr(1) : el;
        if (e.target.classList.contains(cls)) {
            callback.call(this, e);
        }
    }, false);

    return $;
};

$.off = function(el, type, callback) {
    $(el).removeEventListener(type, callback, false);

    return $;
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
