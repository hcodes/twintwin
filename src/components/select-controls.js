var dom = require('dom')
var $ = dom.$;
var $$ = dom.$$;
var Event = require('event');
var Component = require('component');
var Settings = require('settings');

var SelectControls = Component.create({
    init: function() {
        this.values = [];

        var defaultValues = [
            'mouse',
            'keyboard1',
            'keyboard2',
            'gamepad1'
        ].map(function(val, i) {
            var control = Settings.get('control' + i);
            return this.getIndex(control) === -1 ? val : control;
        }, this);

        var events = [];

        this.elems = Array.from($$('.select-controls'));
        this.elems.forEach(function(el, i) {
            var value = defaultValues[i];

            this.values.push(value);

            this.updateElem(i);

            events.push([
                el, 'click', function() {
                    this.selectNext(i);
                }.bind(this)
            ]);
        }, this);

        this.setDomEvents(events);
    },
    getPlayerControl: function(playerNum) {
        return this.values[playerNum];
    },
    selectNext: function(playerNum) {
        var currentIndex = this.getIndex(this.values[playerNum]);
        var index = currentIndex;
        while(this.values.indexOf(this.controls[index].value) !== -1) {
            index++;
            if (index >= this.controls.length - 1) {
                index = 0;
            }
        }

        var value = this.controls[index].value;
        this.values[playerNum] = value;
        Settings.set('control' + playerNum, value);

        this.trigger('change', {
            playerNum: playerNum,
            control: value
        });

        this.updateElem(playerNum);
    },
    updateElem: function(playerNum) {
        var controlInfo = this.controls[this.getIndex(this.values[playerNum])];

        var elem = this.elems[playerNum];

        elem.innerHTML = controlInfo.text;
        elem.title = controlInfo.title;
    },
    getIndex: function(value) {
        var index = -1;

        this.controls.some(function(item, i) {
            if (item.value === value) {
                index = i;
                return true;
            }

            return false;
        });

        return index;
    },
    controls: [
        {
            value: 'keyboard1',
            text: '⌨ 1',
            title: 'Keyboard: Cursors + Enter'
        },
        {
            value: 'keyboard2',
            text: '⌨ 2',
            title: 'Keyboard: W, A, D, S + Space'
        },
        {
            value: 'mouse',
            text: '🖱',
            title: 'Mouse'
        },
        {
            value: 'touch',
            text: '🤚',
            title: 'Touch'
        },
        {
            value: 'gamepad1',
            text: '🎮 1',
            title: 'Gamepad 1'
        },
        {
            value: 'gamepad2',
            text: '🎮 2',
            title: 'Gamepad 2'
        },
        {
            value: 'gamepad3',
            text: '🎮 3',
            title: 'Gamepad 3'
        },
        {
            value: 'gamepad4',
            text: '🎮 4',
            title: 'Gamepad 4'
        }
    ]
});

module.exports = SelectControls;