const texts = {};

let lang;

const i18n = {
    get(key) {
        const val = texts[key];

        return val && val[lang];
    },
    set(keyset, keys) {
        Object.keys(keys).forEach(function(key) {
            texts[keyset + '.' + key] = keys[key];
        });
    },
    get lang: function() {
        return lang;
    },
    set lang: function(val) {
        lang = val;
    }
};

export default i18n;
