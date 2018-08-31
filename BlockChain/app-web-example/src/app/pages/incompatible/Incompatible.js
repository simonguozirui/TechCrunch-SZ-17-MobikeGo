import UAParser from 'ua-parser-js';
import Mustache from 'mustache';
import incompatibleTemplate from './incompatible.html';
import style from './incompatible.scss';

var uaParser = new UAParser(), Incompatible = {};

Incompatible.uaResult = uaParser.getResult();
/**
 * Check browser compatibility
 *
 * @return {boolean} - for uncompatible browser return 'true', otherwise 'false'
 */
Incompatible._isIncompatibleBrowser = function () {
    /* var listOfSupported = [
            { browser: 'Chrome'       , version: 43 },
            { browser: 'Firefox'      , version: 38 },
            { browser: 'Safari'       , version:  7 },
            { browser: 'Mobile Safari', version:  7 },
            { browser: 'IE'           , version: 11 },
            { browser: 'Edge'         , version: 12 },
            { browser: 'IEMobile'     , version: 11 }
        ],
        incomp = true,
        i;

    for (i = 0; i < listOfSupported.length; i++) {
        if (listOfSupported[i].browser === Incompatible.uaResult.browser.name &&
            listOfSupported[i].version <= parseInt(Incompatible.uaResult.browser.major, 10))  {
            incomp = false;
        }
    } */

    // return incomp;
    return false;
};

/**
 * Add 'incompatible' class to documentElement in unsupported browsers
 */
Incompatible.check = function () {
    var isIncompatible = Incompatible._isIncompatibleBrowser();

    var output = Mustache.render(incompatibleTemplate, { style }),
        el = document.getElementById('incompatibleBrowser');
    
    if (isIncompatible) {
        // if browser is incompatible
        document.documentElement.className = 'incompatible ' + document.documentElement.className;
        el.innerHTML = output;
    }

    return isIncompatible;
};

export default Incompatible;
