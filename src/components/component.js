import $ from '../lib/dom';
import Event from '../lib/event';

const Component = {
    create(cl) {
        const obj = new cl();

        Object.assign(obj, Event.prototype);

        Object.assign(obj, {
            domEvents: [],
            setDomEvents(events) {
                events.forEach(function(item) {
                    $.on.apply($, item);
                }, this);

                this.domEvents = this.domEvents.concat(events);
            },
            removeDomEvents() {
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

export default Component;
