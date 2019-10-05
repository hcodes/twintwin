import {$, hasSupportCss} from '../../helpers/dom';
import isMobile from '../../helpers/is-mobile';

let inputType;
const body = document.body;

function setInputType(type) {
    if (type !== inputType) {
        document.body.classList.remove('input_' + inputType);
        document.body.classList.add('input_' + type);
        inputType = type;
    }
}

body.classList.add('support_transform3d_' + hasSupportCss('perspective'));
body.classList.add('device_' + (isMobile ? 'mobile' : 'desktop'));

setInputType('mouse');

if (isMobile) {
    setInputType('touch');
} else {
    $
        .on(document, 'mousemove', () => {
            setInputType('mouse');
        })
        .on(document, 'touchstart', () => {
            setInputType('touch');
        });
}

$.on(document, 'keydown', () => {
    setInputType('keyboard');
});

