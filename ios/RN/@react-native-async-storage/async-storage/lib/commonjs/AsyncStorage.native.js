/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 * @jsdoc
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _RCTAsyncStorage = _interopRequireDefault(require("./RCTAsyncStorage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_RCTAsyncStorage.default) {
  throw new Error("[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.\n\nTo fix this issue try these steps:\n\n  \u2022 Run `react-native link @react-native-async-storage/async-storage` in the project root.\n\n  \u2022 Rebuild and restart the app.\n\n  \u2022 Run the packager with `--reset-cache` flag.\n\n  \u2022 If you are using CocoaPods on iOS, run `pod install` in the `ios` directory and then rebuild and re-run the app.\n\n  \u2022 If this happens while testing with Jest, check out docs how to integrate AsyncStorage with it: https://react-native-async-storage.github.io/async-storage/docs/advanced/jest\n\nIf none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-async-storage/react-native-async-storage/issues\n");
}

function checkValidInput(usedKey, value) {
  const isValuePassed = arguments.length > 1;

  if (typeof usedKey !== 'string') {
    console.warn("[AsyncStorage] Using ".concat(typeof usedKey, " type for key is not supported. This can lead to unexpected behavior/errors. Use string instead.\nKey passed: ").concat(usedKey, "\n"));
  }

  if (isValuePassed && typeof value !== 'string') {
    if (value == null) {
      throw new Error("[AsyncStorage] Passing null/undefined as value is not supported. If you want to remove value, Use .remove method instead.\nPassed value: ".concat(value, "\nPassed key: ").concat(usedKey, "\n"));
    } else {
      console.warn("[AsyncStorage] The value for key \"".concat(usedKey, "\" is not a string. This can lead to unexpected behavior/errors. Consider stringifying it.\nPassed value: ").concat(value, "\nPassed key: ").concat(usedKey, "\n"));
    }
  }
}

function checkValidArgs(keyValuePairs, callback) {
  if (!Array.isArray(keyValuePairs) || keyValuePairs.length === 0 || !Array.isArray(keyValuePairs[0])) {
    throw new Error('[AsyncStorage] Expected array of key-value pairs as first argument to multiSet');
  }

  if (callback && typeof callback !== 'function') {
    if (Array.isArray(callback)) {
      throw new Error('[AsyncStorage] Expected function as second argument to multiSet. Did you forget to wrap key-value pairs in an array for the first argument?');
    }

    throw new Error('[AsyncStorage] Expected function as second argument to multiSet');
  }
}
/**
 * `AsyncStorage` is a simple, unencrypted, asynchronous, persistent, key-value
 * storage system that is global to the app.  It should be used instead of
 * LocalStorage.
 *
 * See http://reactnative.dev/docs/asyncstorage.html
 */


const AsyncStorage = {
  _getRequests: [],
  _getKeys: [],
  _immediate: null,

  /**
   * Fetches an item for a `key` and invokes a callback upon completion.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#getitem
   */
  getItem: function (key, callback) {
    return new Promise((resolve, reject) => {
      checkValidInput(key);

      _RCTAsyncStorage.default.multiGet([key], function (errors, result) {
        // Unpack result to get value from [[key,value]]
        const value = result && result[0] && result[0][1] ? result[0][1] : null;
        const errs = convertErrors(errors);
        callback && callback(errs && errs[0], value);

        if (errs) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  },

  /**
   * Sets the value for a `key` and invokes a callback upon completion.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#setitem
   */
  setItem: function (key, value, callback) {
    return new Promise((resolve, reject) => {
      checkValidInput(key, value);

      _RCTAsyncStorage.default.multiSet([[key, value]], function (errors) {
        const errs = convertErrors(errors);
        callback && callback(errs && errs[0]);

        if (errs) {
          reject(errs[0]);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Removes an item for a `key` and invokes a callback upon completion.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#removeitem
   */
  removeItem: function (key, callback) {
    return new Promise((resolve, reject) => {
      checkValidInput(key);

      _RCTAsyncStorage.default.multiRemove([key], function (errors) {
        const errs = convertErrors(errors);
        callback && callback(errs && errs[0]);

        if (errs) {
          reject(errs[0]);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Merges an existing `key` value with an input value, assuming both values
   * are stringified JSON.
   *
   * **NOTE:** This is not supported by all native implementations.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#mergeitem
   */
  mergeItem: function (key, value, callback) {
    return new Promise((resolve, reject) => {
      checkValidInput(key, value);

      _RCTAsyncStorage.default.multiMerge([[key, value]], function (errors) {
        const errs = convertErrors(errors);
        callback && callback(errs && errs[0]);

        if (errs) {
          reject(errs[0]);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Erases *all* `AsyncStorage` for all clients, libraries, etc. You probably
   * don't want to call this; use `removeItem` or `multiRemove` to clear only
   * your app's keys.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#clear
   */
  clear: function (callback) {
    return new Promise((resolve, reject) => {
      _RCTAsyncStorage.default.clear(function (error) {
        const err = convertError(error);
        callback && callback(err);

        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Gets *all* keys known to your app; for all callers, libraries, etc.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#getallkeys
   */
  getAllKeys: function (callback) {
    return new Promise((resolve, reject) => {
      _RCTAsyncStorage.default.getAllKeys(function (error, keys) {
        const err = convertError(error);
        callback && callback(err, keys);

        if (err) {
          reject(err);
        } else {
          resolve(keys);
        }
      });
    });
  },

  /**
   * The following batched functions are useful for executing a lot of
   * operations at once, allowing for native optimizations and provide the
   * convenience of a single callback after all operations are complete.
   *
   * These functions return arrays of errors, potentially one for every key.
   * For key-specific errors, the Error object will have a key property to
   * indicate which key caused the error.
   */

  /**
   * Flushes any pending requests using a single batch call to get the data.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#flushgetrequests
   * */
  flushGetRequests: function () {
    const getRequests = this._getRequests;
    const getKeys = this._getKeys;
    this._getRequests = [];
    this._getKeys = [];

    _RCTAsyncStorage.default.multiGet(getKeys, function (errors, result) {
      // Even though the runtime complexity of this is theoretically worse vs if we used a map,
      // it's much, much faster in practice for the data sets we deal with (we avoid
      // allocating result pair arrays). This was heavily benchmarked.
      //
      // Is there a way to avoid using the map but fix the bug in this breaking test?
      // https://github.com/facebook/react-native/commit/8dd8ad76579d7feef34c014d387bf02065692264
      const map = {};
      result && result.forEach(([key, value]) => {
        map[key] = value;
        return value;
      });
      const reqLength = getRequests.length;

      for (let i = 0; i < reqLength; i++) {
        const request = getRequests[i];
        const requestKeys = request.keys;
        const requestResult = requestKeys.map(key => [key, map[key]]);
        request.callback && request.callback(null, requestResult);
        request.resolve && request.resolve(requestResult);
      }
    });
  },

  /**
   * This allows you to batch the fetching of items given an array of `key`
   * inputs. Your callback will be invoked with an array of corresponding
   * key-value pairs found.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#multiget
   */
  multiGet: function (keys, callback) {
    if (!this._immediate) {
      this._immediate = setImmediate(() => {
        this._immediate = null;
        this.flushGetRequests();
      });
    }

    const getRequest = {
      keys: keys,
      callback: callback,
      // do we need this?
      keyIndex: this._getKeys.length,
      resolve: null,
      reject: null
    };
    const promiseResult = new Promise((resolve, reject) => {
      getRequest.resolve = resolve;
      getRequest.reject = reject;
    });

    this._getRequests.push(getRequest); // avoid fetching duplicates


    keys.forEach(key => {
      if (this._getKeys.indexOf(key) === -1) {
        this._getKeys.push(key);
      }
    });
    return promiseResult;
  },

  /**
   * Use this as a batch operation for storing multiple key-value pairs. When
   * the operation completes you'll get a single callback with any errors.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#multiset
   */
  multiSet: function (keyValuePairs, callback) {
    checkValidArgs(keyValuePairs, callback);
    return new Promise((resolve, reject) => {
      keyValuePairs.forEach(([key, value]) => {
        checkValidInput(key, value);
      });

      _RCTAsyncStorage.default.multiSet(keyValuePairs, function (errors) {
        const error = convertErrors(errors);
        callback && callback(error);

        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Call this to batch the deletion of all keys in the `keys` array.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#multiremove
   */
  multiRemove: function (keys, callback) {
    return new Promise((resolve, reject) => {
      keys.forEach(key => checkValidInput(key));

      _RCTAsyncStorage.default.multiRemove(keys, function (errors) {
        const error = convertErrors(errors);
        callback && callback(error);

        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  },

  /**
   * Batch operation to merge in existing and new values for a given set of
   * keys. This assumes that the values are stringified JSON.
   *
   * **NOTE**: This is not supported by all native implementations.
   *
   * See http://reactnative.dev/docs/asyncstorage.html#multimerge
   */
  multiMerge: function (keyValuePairs, callback) {
    return new Promise((resolve, reject) => {
      _RCTAsyncStorage.default.multiMerge(keyValuePairs, function (errors) {
        const error = convertErrors(errors);
        callback && callback(error);

        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }
}; // Not all native implementations support merge.

if (!_RCTAsyncStorage.default.multiMerge) {
  // $FlowFixMe
  delete AsyncStorage.mergeItem; // $FlowFixMe

  delete AsyncStorage.multiMerge;
}

function convertErrors(errs) {
  if (!errs || Array.isArray(errs) && errs.length === 0) {
    return null;
  }

  return (Array.isArray(errs) ? errs : [errs]).map(e => convertError(e));
}

function convertError(error) {
  if (!error) {
    return null;
  }

  const out = new Error(error.message); // $FlowFixMe: adding custom properties to error.

  out.key = error.key;
  return out;
}

var _default = AsyncStorage;
exports.default = _default;
//# sourceMappingURL=AsyncStorage.native.js.map