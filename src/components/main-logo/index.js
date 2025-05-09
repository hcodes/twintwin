import { $ } from '../../helpers/dom';

import './index.css';

const elem = $('.main-logo');

setTimeout(function() {
    elem.classList.add('main-logo_visible');
}, 1000);
