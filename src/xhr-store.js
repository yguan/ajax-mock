/*jslint nomen: true*/
/*global $,define,require,module */

var xhrKeyGenerator = require('./xhr-key-generator');
var store = {};

function isResponseTextValid(xhr) {
    var responseType = xhr.responseType;
    return responseType === '' || responseType === 'text';
}

function getResponseHeader(xhr) {
    return {
        'Content-Type': xhr.getResponseHeader('Content-Type')
    };
}

function getXhrData(xhr) {
    return {
        requestURL: xhr.requestURL,
        requestText: xhr.requestText,
        status: xhr.status,
        responseHeader: getResponseHeader(xhr),
        responseText: isResponseTextValid(xhr) ? xhr.responseText : '',
        response: xhr.response // this may not require
    };
}

exports.save = function (xhr) {
    store[xhrKeyGenerator.getKey(xhr)] = getXhrData(xhr);
};

exports.getAll = function () {
    return store;
};

exports.clear = function () {
    store = {};
};