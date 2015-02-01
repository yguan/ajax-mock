(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// modified from https://github.com/slorber/ajax-interceptor
// override XMLHttpRequest.prototype.send can capture method and url
'use strict';

var COMPLETED_READY_STATE = 4;

var RealXHRSend = XMLHttpRequest.prototype.send;
var RealXHROpen = window.XMLHttpRequest.prototype.open;

var requestCallbacks = [];
var responseCallbacks = [];

var wired = false;

function arrayRemove(array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    } else {
        throw new Error("Could not remove " + item + " from array");
    }
}

function fireCallbacks(callbacks, xhr) {
    for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](xhr);
    }
}

exports.addRequestCallback = function (callback) {
    requestCallbacks.push(callback);
};

exports.removeRequestCallback = function (callback) {
    arrayRemove(requestCallbacks, callback);
};

exports.addResponseCallback = function (callback) {
    responseCallbacks.push(callback);
};

exports.removeResponseCallback = function (callback) {
    arrayRemove(responseCallbacks, callback);
};

function fireResponseCallbacksIfCompleted(xhr) {
    if (xhr.readyState === COMPLETED_READY_STATE) {
        fireCallbacks(responseCallbacks, xhr);
    }
}

function proxifyOnReadyStateChange(xhr) {
    var realOnReadyStateChange = xhr.onreadystatechange;
    if (realOnReadyStateChange) {
        xhr.onreadystatechange = function () {
            fireResponseCallbacksIfCompleted(xhr);
            realOnReadyStateChange();
        };
    }
}

function interceptedXhrOpen() {
    this.method = arguments[0];
    this.requestURL = arguments[1];

    RealXHROpen.apply(this, arguments);
}

function interceptedXhrSend(requestText) {
    this.requestText = requestText;

    // Fire request callbacks before sending the request
    fireCallbacks(requestCallbacks, this);

    // Wire response callbacks
    if (this.addEventListener) {
        var self = this;
        this.addEventListener("readystatechange", function () {
            fireResponseCallbacksIfCompleted(self);
        }, false);
    }
    else {
        proxifyOnReadyStateChange(this);
    }

    RealXHRSend.apply(this, arguments);
}

exports.wire = function () {
    if (wired) throw new Error("Ajax interceptor already wired");

    XMLHttpRequest.prototype.open = interceptedXhrOpen;
    XMLHttpRequest.prototype.send = interceptedXhrSend;
    wired = true;
};

exports.unwire = function () {
    if (!wired) throw new Error("Ajax interceptor not currently wired");
    XMLHttpRequest.prototype.send = RealXHRSend;
    wired = false;
};
},{}],2:[function(require,module,exports){
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
},{"./ajax-interceptor":1,"./xhr-store":3}],3:[function(require,module,exports){
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
        response: xhr.response
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
},{}]},{},[2])