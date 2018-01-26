import {$} from '../lib/dom';
import CustomEvent from '../lib/custom-event';

class EmptyComponent extends CustomEvent {
    constructor() {
        super();
    }
}

const Component = {
    create(obj) {
        const emptyComponentObj = new EmptyComponent();

        Object.assign(emptyComponentObj, {
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

        Object.assign(emptyComponentObj, obj);

        emptyComponentObj.init && emptyComponentObj.init();

        return emptyComponentObj;
    }
};

export default Component;
