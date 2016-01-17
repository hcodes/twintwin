App.page.add({
    name: 'select-level',
    locationHash: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();
        
        $.on('.select-level__exit', 'click', function() {
            App.page.show('main');
        });
        
        $.delegate(el, '.btn', 'click', function(e) {
            if (this.classList.contains('btn_disabled')) {
                return;
            }

            var level = parseInt(e.target.dataset['level']);
            App.settings.set('level', level);
            App.page.show('field');
        });

        return this;
    },
    getList: function() {
        var html = [],
            maxLevel = App.settings.get('maxLevel');

        this.data.levels.forEach(function(level, i) {
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
                            c: App.levelSymbol(i)
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
});
