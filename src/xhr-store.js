/*jslint nomen: true*/
/*global $,define,require,module */

var store = {};

function cleanUrl(url) {
    // todo: strip out unnecessary parameters such as timestamp
    return url;
}

function isResponseTextValid(xhr) {
    var responseType = xhr.responseType;
    return responseType === '' || responseType === 'text';
}

function getXhrData(xhr) {
    return {
        requestURL: cleanUrl(xhr.requestURL),
        requestText: xhr.requestText,
        status: xhr.status,
        statusText: xhr.statusText,
        responseText: isResponseTextValid(xhr) ? xhr.responseText : '',
        response: xhr.response // this may not require
    };
}

function getXhrKey(xhr) {
    return cleanUrl(xhr.requestURL) + xhr.requestText;
}

exports.save = function (xhr) {
    store[getXhrKey(xhr)] = getXhrData(xhr);
};

exports.getAll = function () {
    return store;
};