/*jslint nomen: true*/
/*global $,define,require,module */

var xhrKeyGenerator = require('./xhr-key-generator');
var mockHttpServer = require('./mock').create();
var xhrMockData;

mockHttpServer.handle = function (xhr) {
    var mockData = xhrMockData[xhrKeyGenerator.getKey(xhr)];
    var responseHeader = mockData.responseHeader;
    Object.keys(responseHeader).forEach(function(key) {
        xhr.setResponseHeader(key, responseHeader[key]);
    });
    xhr.receive(mockData.status, mockData.responseText);
};

exports.loadMockData = function (data) {
    xhrMockData = data;
};

exports.start = function () {
    mockHttpServer.start();
};

exports.stop = function () {
    mockHttpServer.stop();
};

window.ajaxMock = exports;