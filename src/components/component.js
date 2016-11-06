var $ = require('dom').$;
var Event = require('event');

module.exports = {
    create: function(obj) {
        Object.assign(obj, Event.prototype);

        Object.assign(obj, {
            domEvents: [],
            setDomEvents: function(events) {
                events.forEach(function(item) {
                    $.on.apply($, item);
                }, this);

                this.domEvents = this.domEvents.concat(events);
            },
            removeDomEvents: function() {
                this.domEvents.forEach(function(item) {
                    $.off.apply($, item);
                });

                this.domEvents = [];
            }
        });

        obj.init && obj.init();

        return obj;
    }
};
