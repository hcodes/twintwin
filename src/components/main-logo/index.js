import './index.less';

import { $ } from '../../helpers/dom';

const elem = $('.main-logo');

setTimeout(function() {
    elem.classList.add('main-logo_visible');
}, 1000);
