/*jslint nomen: true*/
/*global $,define,require,module */

var urlSanitizer = require('./url-sanitizer');

exports.getKey = function (xhr) {
    return urlSanitizer.clean(xhr.requestURL || xhr.url) + xhr.requestText;
};