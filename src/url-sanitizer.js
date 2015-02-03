/*jslint nomen: true*/
/*global $,define,require,module */

exports.clean = function (url) {
    return url.replace(/_dc=\d+/g, ''); // remove string such as "_dc=2837" from url
};
