import './index.css';

import { hit } from 'lyam';

import './components/gamepad-notice';
import './components/input-type';
import './components/emoji';

import './pages';

import Page from './components/page';

Page.showByLocationHash();

window.addEventListener('hashchange', function() {
    Page.showByLocationHash();
}, false);

hit('35250605');
