const Settings = {
    set(name, value) {
        this._buffer[name] = this._copy(value);
        this._save();
    },
    get(name, defaultValue) {
        if (!this._isLoaded) {
            this._load();
            this._isLoaded = true;
        }

        const value = this._buffer[name];
        return value === undefined ? defaultValue : value;
    },
    lsName: 'twintwin',
    _buffer: {},
    _load() {
        var buffer = {};
        try {
            buffer = JSON.parse(localStorage.getItem(this.lsName)) || {};
        } catch(e) {}

        buffer.level = buffer.level || 1;
        buffer.maxLevel = buffer.maxLevel || 1;
        this._buffer = buffer;
    },
    _save() {
        try {
            localStorage.setItem(this.lsName, JSON.stringify(this._buffer));
        } catch(e) {}
    },
    _copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
};

export default Settings;
