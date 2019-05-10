/* UNIT TEST (TESTING LIB) */

//dependencies
const assert = require('assert');
const lib = require('../app/lib');

//unit obj
const unit = {};

//assert if lib.generateRandomNumber(min, max), return a number, such that max > num > min
unit['lib.generateRandomNumber(2, 18) return an number such 18 > number > 2'] = done => {
    const num = lib.generateRandomNumber(2, 18);
    assert.equal(typeof(num), 'number');
    assert.ok(num >= 2 && num <=18);
    done();
};

//assert if lib.generateRandomString(len), return a string with specified length.
unit['lib.generateRandomString(99) return a string with length 99'] = done => {
    const str = lib.generateRandomString(99);
    assert.equal(typeof(str), 'string');
    assert.ok(str.length == 99);
    done();
};

//assert if lib.generateRandomString(len) does not throw if len is not specified, instead it generates  a string with default length
unit['lib.generateRandomString() does not throw and it generates a string with default length'] = done => {
    assert.doesNotThrow(() => {
        const str = lib.generateRandomString();
        assert.equal(typeof(str), 'string');
        assert.ok(str.length > 0);
        done();
    }, TypeError);
};

//assert lib.parseStringToObject(json) does not throw, but return an empty object instead
unit['lib.parseStringToObject(json) does not throw'] = done => {
    assert.doesNotThrow(() => {
        const parsedObj = lib.parseStringToObject('Not A JSON');
        assert.equal(typeof(parsedObj), 'object');
        done();
    }, TypeError);
};

//assert lib.checkPalindrom() does not throw, and return a boolean
unit['lib.checkPalindrom() does not throw, and return a boolean'] = done => {
    assert.doesNotThrow(() => {
        const bool = lib.checkPalindrom();
        assert.equal(typeof(bool), 'boolean');
        done();
    }, TypeError);
};

//assert lib.checkWebsiteStatus(protocol, url, method, callback) does not throw if params are wrong, but return a string error instead
unit["lib.checkWebsiteStatus() should not throw, but return string error"] = done => {
    assert.doesNotThrow(() => {
        lib.checkWebsiteStatus('', '', '', (err) => {
            assert.ok(err);
            done();
        });
    }, TypeError);
};

//export unit tests
module.exports = unit;