/*jslint nomen: true*/
/*global $,define,require,module */

var ajaxInterceptor = require('./ajax-interceptor'),
    xhrStore = require('./xhr-store'),
    isRecording = false;

ajaxInterceptor.addResponseCallback(function(xhr) {
    if (isRecording) {
        xhrStore.save(xhr);
    }
});

exports.record = function () {
    isRecording = true;
    ajaxInterceptor.wire();
};

exports.stop = function () {
    isRecording = false;
    ajaxInterceptor.unwire();
};

exports.clear = function () {
    xhrStore.clear();
};

exports.getRecordedXhrs = function () {
    return xhrStore.getAll();
};

window.httpRecorder = exports;

// copy(httpRecorder.getRecordedXhrs())