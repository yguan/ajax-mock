/*jslint nomen: true*/
/*global $,define,require,module */

var xhrKeyGenerator = require('./xhr-key-generator');
var mockHttpServer = require('./mock').create();
var RealXHROpen = XMLHttpRequest.prototype.open;
var xhrMockData;

mockHttpServer.handle = function (xhr) {
    var mockData = xhrMockData[xhrKeyGenerator.getKey(xhr)];
    var responseHeader = mockData.responseHeader;
    Object.keys(responseHeader).forEach(function(key) {
        xhr.setResponseHeader(key, responseHeader[key]);
    });
    xhr.receive(mockData.status, mockData.responseText);
};

function interceptedXhrOpen() {
    this.method = arguments[0];
    this.requestURL = arguments[1];

    RealXHROpen.apply(this, arguments);
}

exports.loadMockData = function (data) {
    xhrMockData = data;
};

exports.start = function () {
    XMLHttpRequest.prototype.open = interceptedXhrOpen;
    mockHttpServer.start();
};

exports.stop = function () {
    mockHttpServer.stop();
    XMLHttpRequest.prototype.open = RealXHROpen;
};

window.ajaxMock = exports;