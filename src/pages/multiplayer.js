App.page.add({
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        this._fieldOne = new Field({
            elem: $('.field_one', '.multiplayer'),
            cols: 6,
            rows: 5,
            control: 'mouse',
            info: false
        });

        this._fieldTwo = new Field({
            elem: $('.field_two', '.multiplayer'),
            cols: 6,
            rows: 5,
            control: 'keyboard',
            info: false
        });

        $.on($('.multiplayer__exit', this._elem), 'mousedown', function() {
            App.page.show('select-level');
        });
    },
    show: function() {
        this._fieldOne.show();
        this._fieldTwo.show();
    },
    hide: function() {
        this._fieldOne.hide();
        this._fieldTwo.hide();
    }
});
