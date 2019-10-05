import './app.less';

import './components/gamepad-notice';
import './components/input-type';
import './components/emoji';

import './pages';

import metrika from './helpers/metrika';
import Page from './components/page';

Page.showByLocationHash();

window.addEventListener('hashchange', function() {
    Page.showByLocationHash();
}, false);

metrika.hit(35250605);
