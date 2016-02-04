App.page.add({
    name: 'game',
    locationHash: 'game',
    init: function(data) {
        this._field = new Field({
            elem: $('.field', '.game'),
            cols: 6,
            rows: 5,
            control: '*',
            infoPanel: true
        });

        $.on($('.game__exit', this._elem), 'mousedown', function() {
            App.page.show('select-level');
        });
    },
    show: function() {
        this._field.show();
    },
    hide: function() {
        this._field.hide();
    }
});
