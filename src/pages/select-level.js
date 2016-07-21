var $ = require('dom').$;
var $$ = require('dom').$$;
var jstohtml = require('jstohtml');
var levels = require('levels');
var Settings = require('settings');
var Page = require('page');

module.exports = {
    name: 'select-level',
    locationHash: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();

        $.delegate(el, '.btn', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            var level = parseInt(this.dataset['level'], 10);
            Settings.set('level', level);
            Page.show('game');
        });

        return this;
    },
    getList: function() {
        var html = [];

        levels.data.forEach(function(levelData, i) {
            if (!i) {
                return;
            }

            html.push({
                t: 'li',
                cl: 'select-level__item',
                c: {
                    t: 'span',
                    cl: [
                        'btn btn_red btn_middle'
                    ],
                    'data-level': i,
                    c: [
                        {
                            t: 'span',
                            cl: 'select-level__emoji emoji',
                            c: levelData.titleSymbol
                        },
                        levelData.name
                    ]
                }
            });
        }, this);

        return jstohtml(html);
    },
    show: function() {
        var maxLevel = Settings.get('maxLevel'),
            btns = $$('.select-level__list .btn', this.elem),
            cl ='btn_disabled';
        
        for (var i = 0; i < btns.length; i++) {
            var btnCl = btns[i].classList;
            if (i < maxLevel) {
                btnCl.remove(cl);
            } else {
                btnCl.add(cl);
            }
        }
    },
    hide: function() {}
};
