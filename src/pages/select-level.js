var $ = require('dom').$,
    jstohtml = require('jstohtml'),
    levels = require('levels'),
    lutils = require('level-utils'),
    Settings = require('settings'),
    Page = require('page');

module.exports = {
    name: 'select-level',
    locationHash: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();
        
        $.on('.select-level__exit', 'click', function() {
            Page.show('main');
        });
        
        $.delegate(el, '.btn', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            var level = parseInt(e.target.dataset['level']);
            Settings.set('level', level);
            Page.show('game');
        });

        return this;
    },
    getList: function() {
        var html = [],
            maxLevel = Settings.get('maxLevel');

        levels.forEach(function(level, i) {
            if (!i) {
                return;
            }

            html.push({
                t: 'li',
                cl: 'select-level__item',
                c: {
                    t: 'span',
                    cl: [
                        'btn btn_red btn_middle',
                        maxLevel < i ? 'btn_disabled' : ''
                    ],
                    'data-level': i,
                    c: [
                        {
                            t: 'span',
                            cl: 'select-level__emoji emoji',
                            c: lutils.levelSymbol(i)
                        },
                        level.name
                    ]
                }
            });
        }, this);
        
        return jstohtml(html);
    },
    show: function() {},
    hide: function() {}
};
