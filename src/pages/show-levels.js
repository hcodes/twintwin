// For debug

var levels = require('levels');
var $ = require('dom').$;
var jstohtml = require('jstohtml');

module.exports = {
    name: 'show-levels',
    locationHash: 'show-levels',
    init: function(data) {
        var container = $('.page_show-levels');

        var obj = levels.data.map(function(item, i) {
            return i ? [
                {
                    t: 'h4',
                    c: [
                        i + '. ' + item.name + ' ',
                        { t: 'sup', c: + item.symbols.length }
                    ]
                },
                {
                    c: item.symbols.join(' ')
                },
                {
                    t: 'br'
                }
            ] : null;
        });

        container.innerHTML = jstohtml(obj);
    },
    show: function() {},
    hide: function() {}
};
