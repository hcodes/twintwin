export default class CustomEvent {
    /*
     * Attach a handler to an custom event.
     * @param {string} type
     * @param {Function} callback
     * @return {Event} this
    */
    on(type, callback) {
        if (!this._eventBuffer) {
            this._eventBuffer = [];
        }

        if (type && callback) {
            this._eventBuffer.push({
                type: type,
                callback: callback
            });
        }

        return this;
    }

    /*
     * Remove a previously-attached custom event handler.
     * @param {string} type
     * @param {Function} callback
     * @return {Event} this
    */
    off(type, callback) {
        const buf = this._eventBuffer || [];

        for (let i = 0; i < buf.length; i++) {
            if (callback === buf[i].callback && type === buf[i].type) {
                buf.splice(i, 1);
                i--;
            }
        }

        return this;
    }

    /*
     * Execute all handlers for the given event type.
     * @param {string} type
     * @param {*} [data]
     * @return {Event} this
    */
    trigger(type, data) {
        const buf = this._eventBuffer || [];

        for (let i = 0; i < buf.length; i++) {
            if (type === buf[i].type) {
                buf[i].callback.call(this, {type: type}, data);
            }
        }

        return this;
    }
}
