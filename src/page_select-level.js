var PageSelectLevel = {
    name: 'select-level',
    init: function(data) {
        var el = $('.select-level__list');
        el.innerHTML = this.getList();
        
        $.on('.select-level__exit', 'click', function() {
            App.page.show('main');
        });
        
        $.delegate(el, '.btn', 'click', function(e) {
            var level = e.target.dataset['level'];
            App.page.show('field', {
                level: level
            });
        });

        return this;
    },
    getList: function() {
        var html = [];

        this.data.levels.forEach(function(level, i) {
            var btnClass = ['btn', 'btn_red'];
            if (i > 5) {
                btnClass.push('btn_disabled');
            }

            html.push('<li class="select-level__item"><span data-level="' + i + '" class="' +
                btnClass.join(' ') + '"><span class="select-level__emoji emoji">' +
                level.symbols[0] + '</span>' + level.name + '</span></li>');
        }, this);
        
        return html.join('');
    },
    show: function() {
    },
    hide: function() {
    }
};
