App.page.add({
    name: 'multiplayer',
    locationHash: 'multiplayer',
    init: function(data) {
        var context = $('.multiplayer');
        this._fieldOne = new Field({
            elem: $('.field_one', context),
            cols: 6,
            rows: 5,
            control: 'mouse',
            infoPanel: true
        });

        this._fieldTwo = new Field({
            elem: $('.field_two', context),
            cols: 6,
            rows: 5,
            control: 'keyboard',
            infoPanel: true
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
