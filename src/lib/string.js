export function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function truncate(text, len) {
    if (text) {
        return text.length > len ? text.substr(0, len) : text;
    }

    return '';
}
