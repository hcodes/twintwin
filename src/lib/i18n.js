var texts = {};
var lang;

function get(key) {
    var val = texts[key];
    
    return val && val[lang];
}

function set(keyset, keys) {
    Object.keys(keys).forEach(function(key) {
        texts[keyset + '.' + key] = keys[key];
    });
}

module.exports = {
    get: get,
    set: set,
    get lang: function() {
        return lang;
    },
    set lang: function(val) {
        lang = val;
    }
};
