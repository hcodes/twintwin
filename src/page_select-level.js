var PageSelectLevel = {
    name: 'select-level',
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

            var btnClass = ['btn', 'btn_red', 'btn_middle'];
            if (maxLevel < i) {
                btnClass.push('btn_disabled');
            }

            html.push('<li class="select-level__item"><span data-level="' + i + '" class="' +
                btnClass.join(' ') + '"><span class="select-level__emoji emoji">' +
                App.levelSymbol(i) + '</span>' + level.name + '</span></li>');
        }, this);
        
        return html.join('');
    },
    show: function() {
    },
    hide: function() {
    }
};
