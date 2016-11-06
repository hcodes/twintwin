module.exports = {
    format: function(n, separator) {
        separator = separator || '\u202F';

        n = n.toString()
            .split('').reverse().join('')
            .replace(/(\d{3})/g, '$1' + separator)
            .split('').reverse().join('');

        return n[0] == separator ? n.substr(1) : n;
    }
};
