var $ = require('dom').$;
var Event = require('event');
var num = require('number');
var Component = require('component');

var gameOver = Component.create({
    init: function() {
        var that = this;
        this.setDomEvents([
            ['.game-over__restart', 'click', function() {
                that.trigger('click', 'restart');
            }],
            ['.game-over__next', 'click', function() {
                that.trigger('click', 'next');
            }]
        ]);
    },
    updateScore: function(value) {
        $('.game-over__score-i').innerHTML = num.format(value);
    },
    show: function(data) {
        $.show('.game-over');
        this.calcScore(data);
    },
    hide: function() {
        $.hide('.game-over');
    },
    calcScore: function(data) {
        var value = Math.floor(1e6 /  data.errors / Math.log(data.time + 3));
        var that = this;

        for (var i = 0; i < 10; i++) {
            (function(counter) {
                setTimeout(function() {
                    that.updateScore(Math.floor(value * counter / 10));
                }, i * 100);
            })(i);
        }
    }
});

module.exports = gameOver;
