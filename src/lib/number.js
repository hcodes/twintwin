export function format(num, separator) {
    separator = separator || '\u202F';

    num = num.toString()
        .split('').reverse().join('')
        .replace(/(\d{3})/g, '$1' + separator)
        .split('').reverse().join('');

    return num[0] == separator ? num.substr(1) : num;
}
