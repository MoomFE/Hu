(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  /*!
   * Zen.js v5.0.0-beta.5
   * https://github.com/MoomFE/ZenJS
   * 
   * (c) 2018 Wei Zhang
   * Released under the MIT License.
   */
  var defineProperty = Object.defineProperty;
  var keys = Object.keys;
  /**
   * 方法返回一个给定对象自身可枚举属性的键值对数组.
   * Object.entries polyfill
   */

  function entries(obj) {
    var index, key;
    var ownKeys = keys(obj);
    var result = Array(index = ownKeys.length);

    while (index--) {
      result[index] = [key = ownKeys[index], obj[key]];
    }

    return result;
  }

  var ObjectProto = Object.prototype;
  var toString = ObjectProto.toString;
  var getPrototypeOf = Object.getPrototypeOf;
  var hasOwnProperty = Object.hasOwnProperty;
  /**
   * 判断传入对象是否是 Function 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isFunction(obj) {
    return typeof obj === 'function';
  }
  /**
   * Transplant from jQuery
   * Version: 3.3.1
   * Homepage: https://jquery.com
   */


  var fnToString = hasOwnProperty.toString,
      ObjectFunctionString = fnToString.call(Object);
  /**
   * 判断传入对象是否是纯粹的对象
   * @param {any} obj 需要判断的对象
   */

  function isPlainObject(obj) {
    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }

    var proto = getPrototypeOf(obj);

    if (!proto) {
      return true;
    }

    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return isFunction(Ctor) && fnToString.call(Ctor) === ObjectFunctionString;
  }

  var create = Object.create;
  var StringProto = String.prototype;
  var BooleanProto = Boolean.prototype;
  var ArrayProto = Array.prototype;
  var FunctionProto = Function.prototype;
  [['String', StringProto], ['Boolean', BooleanProto], ['Array', ArrayProto], ['Function', FunctionProto]].forEach(function (obj) {
    defineProperty(obj[1], "__is" + obj[0] + "__", {
      value: true,
      configurable: false,
      // 删除/定义
      enumerable: false,
      // 枚举
      writable: false // 写入

    });
  });
  var isString = '__isString__';
  var isBoolean = '__isBoolean__';
  var isArray = '__isArray__';
  var isFunction$1 = '__isFunction__';
  var slice = ArrayProto.slice;
  /**
   * 将多个源对象的可枚举属性合并到第一个对象中
   * @param {Boolean} shallow 是否使用浅拷贝模式, 类似于使用 Object.assign
   */

  function assign(shallow, args, parent, noProto) {
    var length = args.length;
    /** 首个源对象下标 */

    var index = 1;
    /** 目标对象 */

    var target = args[0] || (args[0] !== null ? {} : (noProto = true, create(null)));
    /** 当前源对象 */

    var options;
    /** 当前源对象所有可枚举属性名及属性 */

    var ownEntries;
    var ownLength, ownIndex, ownEntrie, ownEntrieName;
    var ownValue, targetValue, cloneValue; // 遍历参数

    for (; index < length; index++) {
      // 无用参数
      if ((options = args[index]) == null) continue; // 所有可枚举属性
      // [ [ key, value ], [ key, value ], [ key, value ] ]

      ownEntries = entries(options);
      ownLength = ownEntries.length;
      ownIndex = 0;

      for (; ownIndex < ownLength; ownIndex++) {
        // [ key, value ]
        ownEntrie = ownEntries[ownIndex];
        ownEntrieName = ownEntrie[0];
        ownValue = ownEntrie[1]; // 非浅拷贝模式下, 当前值是原生对象或数组, 则进行深拷贝

        if (!shallow && ownValue && (isPlainObject(ownValue) || ownValue[isArray])) {
          // 防御下面这种无限引用
          // var target = {};
          // var source = { infiniteLoop: target };
          // 
          // Object.$assign( target, source );
          if (ownValue === target) continue; // 防御下面这种无限引用
          // var target = {};
          // var source = {};
          // target.source = source;
          // source.target = target;
          // 
          // Object.$assign( {}, target )
          else if (parent && parent === ownValue) {
              if (ownLength === 1) return undefined;
              continue;
            }
          targetValue = target[ownEntrieName];

          if (ownValue[isArray]) {
            cloneValue = [];
          } else {
            cloneValue = targetValue && isPlainObject(targetValue) ? targetValue : noProto ? create(null) : {};
          }

          if (assign(false, [cloneValue, ownValue], options, noProto) !== undefined) {
            target[ownEntrieName] = cloneValue;
          }
        } else if (ownValue !== undefined || hasOwnProperty.call(target, ownEntrieName) === false) {
          target[ownEntrieName] = ownValue;
        }
      }
    }

    return target;
  }
  /**
   * 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象. 它将返回目标对象.
   * Object.assign polyfill
   */


  var assign$1 = Object.assign || function () {
    return assign(true, arguments);
  };

  var isArray$1 = Array.isArray;
  /**
   * 在一个对象上定义/修改一个新属性 ( 对 Object.defineProperty 的封装 )
   * @param {any} obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param {String} name 要定义或修改的属性的名称
   * @param {any} options 将被定义或修改的属性描述符
   * @param {any} options2 将被定义或修改的属性描述符, 会覆盖前一个 options
   */

  function define(obj, name, options, options2) {
    if (obj == null) {
      return;
    } // define( [ window, document ], name, options )


    if (isArray$1(obj) && obj instanceof Array) {
      obj.forEach(function (obj) {
        return define(obj, name, options, options2);
      });
      return;
    }

    name.split(' ').forEach(function (name) {
      defineProperty(obj, name, assign$1({}, options, options2));
    });
  }

  var definePropertyOptions = {
    configurable: true,
    // 删除/定义
    enumerable: false,
    // 枚举
    writable: true // 写入

  };
  var defineGetPropertyOptions = {
    configurable: true,
    // 删除/定义
    enumerable: false // 枚举

  };
  /**
   * 在一个对象上定义/修改一个新属性的 value 描述符
   * @param {any} obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param {String} name 要定义或修改的属性的名称
   * @param {Function} value 将被定义或修改的 value 描述符
   * @param {any} options 将被定义或修改的属性描述符
   */

  function defineValue(obj, name, value, options) {
    define(obj, name, {
      value: value
    }, options || definePropertyOptions);
    return value;
  }
  /**
   * 判断传入对象是否是 String 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function isString$1(obj) {
    return typeof obj === 'string';
  }
  /**
   * 判断传入对象是否是 Number 类型, 并且不为 NaN
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function isNumber(obj) {
    return typeof obj === 'number' && obj === obj;
  }
  /**
   * 判断传入对象是否是数字类型或可转为数字
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function $isNumber(obj) {
    var num = obj;

    if ((isNumber(obj) || isString$1(obj) && !isNaN(obj - (num = parseFloat(obj)))) && isFinite(num)) {
      return true;
    }

    return false;
  }
  /**
   * 快捷创建数组
   * @param length 需要创建的数组的长度
   * @param insert 需要填充到数组中的内容, 若传入方法, 将会向方法内传入当前 index, 然后将方法的返回值填充到数组中
   * @param isInsert 若值为真, 即使二个参数 insert 是方法, 都会直接进行插入
   */


  function create$1(length, insert, isInsert) {
    if (!isNumber(length) || length < 1) {
      return [];
    }

    var i = 0;
    var result = Array(length);

    if (!isInsert && isFunction(insert)) {
      for (; i < length; i++) {
        result[i] = insert(i);
      }
    } else {
      for (; i < length; i++) {
        result[i] = insert;
      }
    }

    return result;
  }

  var ceil = Math.ceil;
  /**
   * 创建一个新的数组, 将传入数组按照指定的长度进行分割, 如果数组不能均分, 则最后的数组中是数组剩余的元素
   * @param array 需要进行分割的数组
   * @param size 分割的长度
   */

  function chunk(array, size) {
    var length;

    if (!array || size < 1 || !(length = array.length)) {
      return [];
    }

    return create$1(ceil(length / size), function (index) {
      var start = index * size;
      return array.slice(start, start + size);
    });
  }

  defineValue(Array, '$chunk', chunk);
  defineValue(ArrayProto, '$chunk', function (size) {
    return chunk(this, size);
  });
  defineValue(Array, '$copy', function (source, array) {
    if (!source || !source.length) {
      return [];
    }

    if (isArray$1(array)) {
      return array.concat(source);
    }

    return slice.call(source);
  });
  defineValue(Array, '$create', create$1);

  function $each(array, callback) {
    if (!array || !array.length || !isFunction(callback)) {
      return array;
    }

    var length = array.length;
    var index = 0,
        value;

    for (; index < length; index++) {
      value = array[index];

      if (callback.call(value, value, index, array) === false) {
        break;
      }
    }

    return array;
  }

  defineValue(Array, '$each', $each);
  defineValue(ArrayProto, '$each', function (callback) {
    return $each(this, callback);
  });
  var MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * 判断传入对象是否是一个类数组对象
   * @param value 需要判断的对象
   */

  function isArrayLike(value) {
    if (value == null || value[isFunction$1]) {
      return false;
    }

    if (value[isArray]) {
      return true;
    }

    var length = value.length;

    if (isNumber(length) && length > -1 && length % 1 === 0 && length <= MAX_SAFE_INTEGER) {
      return true;
    }

    return false;
  }
  /**
   * 获取方法指定位参数, 若未传入参数, 则取默认值
   * @param {IArguments} args arguments
   * @param {Number} index 需要在 argument 中取得默认值的下标
   * @param {any} defaultValue 若未传入值时取得默认值
   * @returns {any}
   */


  function parametersDefault(args, index, defaultValue) {
    var arg;

    if (args.length > index && (arg = args[index]) !== undefined) {
      return arg;
    }

    return defaultValue;
  }
  /**
   * 判断传入的两个参数是否相等 ( == )
   * @param {any} one 需要判断的第一参数
   * @param {any} two 需要判断的第二参数
   * @returns {Boolean}
   */


  function equals(one, two) {
    return one == two;
  }
  /**
   * 判断传入的两个参数是否全等 ( === )
   * @param {any} one 需要判断的第一参数
   * @param {any} two 需要判断的第二参数
   * @returns {Boolean}
   */


  function congruence(one, two) {
    return one === two;
  }
  /**
   * 返回一个可以判断两个值的方法.
   * 如果传入值为 Function 类型, 说明是用户传的方法, 则直接返回;
   * 如果传入值不为 Function 类型, 则值是真值, 则返回全等判断方法, 否则返回双等判断方法
   * 
   * @param {*} predicate 
   */


  function getPredicate(predicate) {
    if (isFunction(predicate)) {
      return predicate;
    }

    return predicate ? congruence : equals;
  }

  function autoGetPredicate(args, value, predicateIndex, predicate) {
    if (args.length > 1) {
      predicate = getPredicate(parametersDefault(args, predicateIndex, true));
    } else if (isFunction(value)) {
      predicate = value;
      value = undefined;
    } else {
      predicate = congruence;
    }

    return [value, predicate];
  }

  function equals$1(array, array2) {
    // 可比较数组及类数组的内容
    if (!(isArrayLike(array) && isArrayLike(array2))) {
      return false;
    }

    var length = array.length;

    if (length !== array2.length) {
      return false;
    }

    var predicate = getPredicate(parametersDefault(arguments, 2, true));

    for (var index = 0; index < length; index++) {
      if (!predicate(array[index], array2[index])) {
        return false;
      }
    }

    return true;
  }

  defineValue(Array, '$equals', equals$1);
  defineValue(ArrayProto, '$equals', function (obj, predicate) {
    return equals$1(this, obj, predicate);
  });
  defineValue(Array, '$isArrayLike', isArrayLike);
  var reHasUnicode = /[\u200d\ud800-\udfff\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff\ufe0e\ufe0f]/;
  var reUnicode = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]?|[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
  /**
   * 判断传入对象是否是 Map 对象
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isMap(obj) {
    return isFunction(Map) && obj instanceof Map;
  }
  /**
   * 判断传入对象是否是 Set 对象
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */


  function isSet(obj) {
    return isFunction(Set) && obj instanceof Set;
  }
  /**
   * 将 Map 或 Set 类型转换为数组类型,
   * 执行到这之前必须确定传进来的是 Map 或 Set 类型
   * @param { Map | Set } map 
   */


  function mapSetToArray(map) {
    var result = [];

    if (map instanceof Map) {
      map.forEach(function (key, value) {
        return result.push([value, key]);
      });
    } else {
      map.forEach(function (value) {
        return result.push(value);
      });
    }

    return result;
  }
  /**
   * 方法返回一个给定对象自身的所有可枚举属性值的数组.
   * Object.values polyfill
   */


  function values(obj) {
    return keys(obj).map(function (key) {
      return obj[key];
    });
  }

  function $toArray(value, transKey) {
    // 不可转为数组的, 直接返回空数组
    if (!value || value[isBoolean]) {
      return [];
    } // 是字符串类型


    if (value[isString]) {
      if (reHasUnicode.test(value)) {
        return value.match(reUnicode) || [];
      } else {
        return value.split('');
      }
    } // 是数组类型, 那就直接返回一个副本


    if (isArrayLike(value)) {
      return slice.call(value);
    } // 转换 Map, Set 类型


    if (isMap(value) || isSet(value)) {
      return mapSetToArray(value);
    } // 转换 JSON


    if (isPlainObject(value)) {
      return transKey ? keys(value) : values(value);
    }

    return [];
  }

  defineValue(Array, '$toArray', $toArray);
  /**
   * 获取方法从指定位开始的剩余参数
   * @param { IArguments } args arguments
   * @param { Number } index 需要在 arguments 中开始取参数的下标 - default: 0
   * @returns {any[]}
   */

  function parametersRest(args, index) {
    return slice.call(args, index || 0);
  }
  /**
   * 将一个传入的数组的下标修复到正确的位置上,
   * 下标不是数字则返回 0,
   * 下标为负数, 则计算出在数组中应有的下标,
   * 下标为负数且计算完后的下标依旧小于 0, 则返回 0
   * 
   * @param {Array} array 原数组
   * @param {Number} index 传入的下标, 可为负数
   * @param {Number} add 额外值
   * @returns {Number}
   */


  function fixArrayIndex(array, index, add) {
    if (!$isNumber(index) || index < 0 && (index = array.length + Number(index) + (add || 0)) < 0) {
      index = 0;
    }

    return index;
  }

  function $add(self, index, args) {
    var length = args.length;

    if (!length) {
      return self;
    }

    index = fixArrayIndex(self, index, 1);

    for (var i = 0; i < length; i++) {
      self.splice(index++, 0, args[i]);
    }

    return self;
  }

  defineValue(ArrayProto, '$add', function (index) {
    return $add(this, index, parametersRest(arguments, 1));
  });
  defineValue(ArrayProto, '$delete $remove', function (index, noop, returnDeleted) {
    var length = this.length;

    if ((index = fixArrayIndex(this, index)) >= length) {
      index = length - 1;
    }

    var num = parametersDefault(arguments, 1, 1);
    var deleted = this.splice(index, num);
    return returnDeleted ? deleted : this;
  });
  defineValue(ArrayProto, '$deleteValue $removeValue', function (_value) {
    var length = this.length,
        index;

    if (!length) {
      return this;
    }

    var args = autoGetPredicate(arguments, _value, 1);
    var value = args[0];
    var predicate = args[1];

    for (index = 0; index < length;) {
      if (predicate(this[index], value)) {
        this.$delete(index);
        length--;
      } else {
        index++;
      }
    }

    return this;
  });
  defineValue(ArrayProto, '$concat', function () {
    var _this = this;

    slice.call(arguments).forEach(function (arg) {
      $add(_this, -1, isArray$1(arg) ? arg : [arg]);
    });
    return this;
  });
  defineValue(ArrayProto, '$concatTo', function (index) {
    var _this2 = this;

    var args = parametersRest(arguments, 1);

    if (!args.length) {
      return this;
    }

    var originLength = this.length;
    var increasedLength = 0;
    index = fixArrayIndex(this, index, 1);
    args.forEach(function (arg) {
      $add(_this2, increasedLength + index, isArray$1(arg) ? arg : [arg]); // 用于修正 index, 后续的 arg 需要插入到前面的 arg 后面

      increasedLength = _this2.length - originLength;
    });
    return this;
  });
  /**
   * 判断传入对象是否是 Boolean 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isBoolean$1(obj) {
    return typeof obj === 'boolean';
  }
  /**
   * 判断传入对象是否是空对象
   * @param {*} obj 需要判断的对象
   */


  function isEmptyObject(obj) {
    for (var a in obj) {
      return false;
    }

    return true;
  }
  /**
   * 方法返回对象的遍历方法
   * @param {*} obj 
   * @param {*} predicate 
   */


  function getTraversal(obj, predicate) {
    var objIsArray = obj[isArray];
    return function (object) {
      if (obj == null || isEmptyObject(object)) {
        return false;
      }

      return (objIsArray ? checkArray : checkObject)(obj, object, predicate);
    };
  }

  function checkArray(source, object, predicate) {
    var length = source.length;
    var index = 0,
        chunk,
        key; // 遍历检测对象

    for (; index < length; index++) {
      chunk = source[index];
      key = chunk[0];

      if (!(key in object && (chunk.length === 1 || predicate(chunk[1], object[key])))) {
        return false;
      }
    }

    return true;
  }

  function checkObject(source, object, predicate) {
    var sKeys = keys(source),
        sLength = sKeys.length;
    var index = 0,
        key; // 遍历检测对象

    for (; index < sLength; index++) {
      key = sKeys[index];

      if (!(key in object && predicate(source[key], object[key]))) {
        return false;
      }
    }

    return true;
  }

  function each(obj, callback) {
    if (obj == null) {
      return obj;
    }

    var oKeys = keys(obj),
        length = oKeys.length;
    var index = 0,
        key,
        value;

    for (; index < length; index++) {
      key = oKeys[index];
      value = obj[key];

      if (callback.call(value, key, value, obj) === false) {
        break;
      }
    }

    return obj;
  }

  defineValue(Object, '$each', each);
  defineValue(ObjectProto, '$each', function (callback) {
    return each(this, callback);
  });
  /**
   * @param {Array} self 进行遍历的数组
   * @param {Boolean} reverse 是否反向查询
   * @param {Number} count 保存的查找结果数量
   * @param {Boolean} not 返回 NOT 结果集 ( 非 )
   */

  function find(self, reverse, count, not,
  /**/
  obj, predicate, fromIndex
  /**/
  ) {
    /** 返回值 */
    var result = [];
    /** 当前数组长度 */

    var length; // 1. 传入的内容不可检索
    // 2. 数组为空
    // 3. 结果集过小

    if (obj == null || !(length = self.length) || count < 1) {
      return result;
    }
    /** 遍历方法 */


    var traversal; // 首个参数是方法或布尔值
    // $findIndex( Function, fromIndex? )

    if (isFunction(obj)) {
      traversal = obj;
      fromIndex = predicate;
    } // $findIndex( Array | Object )
    // $findIndex( Array | Object, fromIndex )
    // $findIndex( Array | Object, Function | Boolean )
    // $findIndex( Array | Object, Function | Boolean, fromIndex )
    else {
        // $findIndex( Array | Object, fromIndex )
        if (isNumber(predicate)) {
          fromIndex = predicate;
          predicate = congruence;
        } // $findIndex( Array | Object )
        // $findIndex( Array | Object, Boolean )
        // $findIndex( Array | Object, Boolean, fromIndex )
        else if (!isFunction(predicate)) {
            // $findIndex( Array | Object, Boolean )
            // $findIndex( Array | Object, Boolean, fromIndex )
            if (isBoolean$1(predicate)) {
              predicate = predicate ? congruence : equals;
            } // $findIndex( Array | Object )
            else {
                predicate = congruence;
              }
          }
      } // 指定值遍历时的检测方法


    if (!traversal) {
      if (isArrayLike(obj)) {
        obj = chunk(obj, 2);
      }

      traversal = getTraversal(obj, predicate);
    } // 矫正 fromIndex


    fromIndex = fromIndex || (reverse ? -1 : 0);
    /** 初始开始遍历的 index */

    var index = isNumber(fromIndex) ? fixArrayIndex(self, fromIndex) : reverse ? length - 1 : 0;
    /** 值, 缓存 */

    var value;
    /** 每次自增的值 */

    var add = reverse ? -1 : 1;

    for (; index >= 0 && index <= length - 1; index += add) {
      if ((!!traversal(value = self[index]) ? !not : not) && result.$push([index, value]).length >= count) {
        return result;
      }
    }

    return result;
  }

  each({
    $find: [false, 1],
    $findLast: [true, 1],
    $findAll: [false, Infinity],
    $findSome: [false],
    $findLastSome: [true]
  }, function (name, args) {
    /** 是否反向查询 */
    var reverse = args[0];
    /** 保存的查找结果数量 */

    var count = args[1];
    /** 是否是返回全部结果集 */

    var returnAll = name.indexOf('All') > -1 || !count; // Index, Not, Chunk

    ['', 'Index', 'Chunk'].forEach(function (suffix2, index) {
      /** 是否是返回 index */
      var returnIndex = index === 1 ? 0 : 1;
      /** 是否直接返回 chunk */

      var returnChunk = index === 2;
      ['', 'Not'].forEach(function (suffix, index) {
        /** 全名 */
        var fullname = name + suffix + suffix2;
        /** 是否是返回 NOT 结果集 */

        var not = !!index;
        defineValue(ArrayProto, fullname, function (obj, predicate, fromIndex) {
          var some;

          if (!count) {
            if (isNumber(obj)) {
              some = obj;
              obj = predicate;
              predicate = fromIndex;
              fromIndex = arguments[3];
            } else {
              some = Infinity;
            }
          } // 获取结果集


          var result = find(this, reverse, count || some, not, obj, predicate, fromIndex); // 返回全部结果集

          if (returnAll) {
            return returnChunk ? result : result.map(function (arr) {
              return arr[returnIndex];
            });
          } // 返回单个结果集


          if (result.length) {
            return returnChunk ? result[0] : result[0][returnIndex];
          } else {
            // 返回 chunk 时, 没找到结果也返回 undefined
            return returnIndex || returnChunk ? undefined : -1;
          }
        });
      });
    });
  });
  defineValue(ArrayProto, '$get', function () {
    var args = arguments;
    var index = fixArrayIndex(this, parametersDefault(args, 0, 0));

    if (args.length <= 1) {
      return this[index];
    }

    var num = parametersDefault(args, 1, 1);
    return this.slice(index, num + index);
  });
  /**
   * 判断传入对象是否是 Object 类型, 并且不为 null
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  function set(array, index, value) {
    index = fixArrayIndex(array, index); // 占位, 如果位数超过数组长度, 使用 splice 不会创建多余空间
    // [ 1, 2, 3 ].$splice( 99, 1, 4 );
    // [ 1, 2, 3, 4 ]

    array[index] = undefined; // 使 Vue 能够刷新数据

    array.splice(index, 1, value);
  }

  function edit(array, index, value) {
    var length = array.length;

    if ((index = fixArrayIndex(array, index)) >= length) {
      index = length - 1;
    }

    array.splice(index, 1, value);
  }

  ['$set', '$edit'].forEach(function (name, index) {
    var fn = index ? edit : set;
    defineValue(ArrayProto, name, function (index, value) {
      var _this = this;

      if (isObject(index)) {
        entries(index).forEach(function (arr) {
          fn(_this, arr[0], arr[1]);
        });
      } else {
        fn(this, index, value);
      }

      return this;
    });
  });
  defineValue(ArrayProto, '$inArray', function (_value) {
    var index,
        length = this.length;

    if (!length) {
      return false;
    }

    var args = autoGetPredicate(arguments, _value, 1);
    var value = args[0];
    var predicate = args[1];

    for (index = 0; index < length; index++) {
      if (predicate(this[index], value)) {
        return true;
      }
    }

    return false;
  });
  defineValue(ArrayProto, '$move', function (from, to) {
    this.splice(fixArrayIndex(this, to), 0, this.splice(from, 1)[0]);
    return this;
  });
  defineValue(ArrayProto, '$moveRange', function (start, moveCount, toIndex) {
    return $add(this, fixArrayIndex(this, toIndex), this.splice(start, moveCount));
  });
  ['push', 'pop', 'unshift', 'shift', 'splice'].forEach(function (key) {
    defineValue(ArrayProto, '$' + key, function () {
      this[key].apply(this, arguments);
      return this;
    });
  });
  defineValue(Object, '$assign', function (shallow) {
    if (isBoolean$1(shallow)) {
      return assign(shallow, parametersRest(arguments, 1));
    }

    return assign(false, arguments);
  });
  defineValue(ObjectProto, '$assign', function (shallow) {
    if (isBoolean$1(shallow)) {
      return assign(shallow, [this].concat(parametersRest(arguments, 1)));
    }

    return assign(false, [this].concat(slice.call(arguments)));
  });
  /**
   * @type {Boolean} 当前是否是浏览器环境
   */

  var inBrowser = typeof window !== 'undefined';
  /**
   * @type {Element}
   */

  var DomElement = inBrowser ? window.Element : undefined;
  var rType = /^\[object\s([^\]]+)]$/;
  /**
   * 判断一个对象是否是引用类型
   * @param {any} obj 需要判断的对象
   */

  function isReferenceType(obj) {
    var type = typeof obj;
    return type === 'object' || type === 'function';
  }

  function equals$2(obj, obj2, parent, parent2) {
    if (obj === obj2) {
      return true;
    } // 其中一个是假值 ( undefined, null, false, '', 0, NaN )


    if (!obj || !obj2) {
      // 对付 NaN 用的, 要不然直接就返回 false 了
      return obj !== obj && obj2 !== obj2;
    }

    var oString = toString.call(obj); // 实际类型不一样 ( RegExp, Element, ... )
    // 比如上面两种类型都是 object, 但是实际上却是不一样的
    // 过了这一步骤, 类型比对时就只需要比对一个值, 因为类型是完全相同的

    if (oString !== toString.call(obj2)) {
      return false;
    } // 非引用类型 ( String, Boolean, Number )


    if (!isReferenceType(obj)) {
      return false;
    } // 对于 object 更加细致点的比对 ( Map, Set, ... )
    // 它们两都是 [object Object]


    if (obj.constructor !== obj2.constructor) {
      return false;
    } // 是数组类型或类数组类型 ( Array, LikeArray )


    if (isArrayLike(obj)) {
      return types.array(obj, obj2, parent, parent2);
    } // 原始对象类型 ( JSON )


    if (isPlainObject(obj)) {
      return types.object(obj, obj2, parent, parent2);
    }

    var oType = oString.match(rType)[1].toLowerCase(); // 有针对性的比对方法 ( Regexp, Date, Function )

    if (oType in types) {
      return types[oType](obj, obj2, parent, parent2);
    } // ( Elemnet )


    if (DomElement && obj instanceof DomElement) {
      return types.element(obj, obj2);
    } // ( Map, Set )


    if (isMap(obj) || isSet(obj)) {
      return equals$2(mapSetToArray(obj), mapSetToArray(obj2));
    }

    return types.object(obj, obj2, parent, parent2);
  }

  var types = {
    /**
     * @param {Array} obj 
     * @param {Array} obj2 
     */
    array: function (obj, obj2, parent, parent2) {
      var length = obj.length,
          i;

      if (length !== obj2.length) {
        return false;
      }

      for (i = 0; i < length; i++) {
        switch (checkInfiniteLoop(obj[i], obj2[i], parent, parent2, obj, obj2)) {
          case 0:
            return false;

          case 1:
            continue;
        }
      }

      return true;
    },

    /**
     * @param {Object} obj 
     * @param {Object} obj2 
     */
    object: function (obj, obj2, parent, parent2) {
      var _keys = keys(obj);

      var length = _keys.length;
      var i, key;

      if (length !== keys(obj2).length) {
        return false;
      }

      for (i = 0; i < length; i++) {
        key = _keys[i];

        switch (checkInfiniteLoop(obj[key], obj2[key], parent, parent2, obj, obj2)) {
          case 0:
            return false;

          case 1:
            continue;
        }
      }

      return true;
    },

    /**
     * @param {Element} obj 
     * @param {Element} obj2 
     */
    element: function (obj, obj2) {
      return obj.outerHTML === obj2.outerHTML;
    },

    /**
     * @param {RegExp} obj 
     * @param {RegExp} obj2 
     */
    regexp: function (obj, obj2) {
      return obj.toString() === obj2.toString();
    },

    /**
     * @param {Date} obj 
     * @param {Date} obj2 
     */
    date: function (obj, obj2) {
      return +obj === +obj2;
    },

    /**
     * @param {Function} obj 
     * @param {Function} obj2 
     */
    'function': function (obj, obj2) {
      return obj.toString() === obj2.toString();
    }
  };
  /**
   * 检查是否无限引用, 然后继续进行下一步判断
   * @returns {Number} 0: 执行 return;
   *                   1: 执行 continue;
   */

  function checkInfiniteLoop(value, value2, parent, parent2, obj, obj2) {
    // 避免无限引用
    if (parent && (parent === value || parent2 === value2)) {
      return parent === value ? parent2 === value2 ? 1 : 0 : parent === value ? 1 : 0;
    } // 进行下一步判断


    if (!equals$2(value, value2, obj, obj2)) {
      return 0;
    }
  }

  defineValue(Object, '$equals', function (obj, obj2) {
    return equals$2(obj, obj2);
  });
  defineValue(ObjectProto, '$equals', function (obj2) {
    return equals$2(this, obj2);
  });
  defineValue(Object, '$isEmptyObject', isEmptyObject);
  defineValue(Object, '$isPlainObject', isPlainObject); // import './$delete/index';
  // import './$deleteValue/index';
  // import './$each/index';
  // import './$get/index';
  // import './$isEmptyObject/index';
  // import './$isPlainObject/index';
  // import './$self/index';
  // import './$set/index';

  defineValue(ObjectProto, '$get', function (key) {
    var _this = this;

    if (arguments.length < 2) {
      return this[key];
    }

    var result = {};
    slice.call(arguments).forEach(function (key) {
      result[key] = _this[key];
    });
    return result;
  });
  defineValue(ObjectProto, '$set $edit', function (key, value) {
    var _this = this;

    if (isObject(key)) {
      each(key, function (key, value) {
        _this[key] = value;
      });
      return this;
    }

    this[key] = value;
    return this;
  });
  var concat = ArrayProto.concat;
  defineValue(ObjectProto, '$delete $remove', function () {
    var _this = this;

    concat.apply([], arguments).forEach(function (key) {
      delete _this[key];
    });
    return this;
  });
  defineValue(ObjectProto, '$deleteValue $removeValue', function (_value) {
    var _this = this;

    var args = autoGetPredicate(arguments, _value, 1);
    var value = args[0];
    var predicate = args[1];
    entries(this).forEach(function (obj) {
      if (predicate(obj[1], value)) {
        delete _this[obj[0]];
      }
    });
    return this;
  });

  function self() {
    return this;
  }

  defineValue(ObjectProto, '$self', self);
  defineValue(Number, '$isNumber', $isNumber);
  var floor = Math.floor;
  var random = Math.random;
  /**
   * 在传入的两个正整数中随机一个数字
   * @param {Number} from 
   * @param {Number} to 
   */

  function intRandom(from, to) {
    return floor(random() * (to - from + 1) + from);
  }

  var abs = Math.abs;
  defineValue(Math, '$random', function () {
    var args = arguments;
    var from = parametersDefault(args, 0, 0);
    var to = args.length !== 1 ? parametersDefault(args, 1, 9) : 0;

    if (from > to) {
      var _ref = [to, from];
      from = _ref[0];
      to = _ref[1];
    }

    if (from > 0) {
      return intRandom(from, to);
    }

    var result = intRandom(0, to + abs(from));
    return result > to ? to - result : result;
  });
  /**
   * 获取传入数字的小数位长度
   * @param {Number} num
   * @returns {Number}
   */

  function getDecimalLength(num) {
    return (('' + num).split('.')[1] || '').length;
  }

  var max = Math.max;
  var pow = Math.pow;
  /**
   * 构造并返回一个新字符串, 该字符串包含被连接在一起的指定数量的字符串的副本.
   * 是 String.prototype.repeat 的降级方案
   * @param {String} str 需要重复的字符串
   * @param {Number} count 需要重复的次数
   */

  function repeat(str, count) {
    var result = '';

    while (count--) {
      result += str;
    }

    return result;
  }

  var NumberProto = Number.prototype;

  function defineOperation(name, handlerFn) {
    defineValue(Math, name, handlerFn);
    defineValue(NumberProto, name, function (num) {
      return handlerFn(this, num);
    });
  }
  /**
   * 
   * @param {Number} num1 
   * @param {Number} num2 
   * @param {Function} handlerFn 
   * @param {Function} lastHandlerFn 
   */


  function handler(num1, num2, handlerFn, lastHandlerFn) {
    var decimal1 = getDecimalLength(num1 = num1 || 0);
    var decimal2 = getDecimalLength(num2 = num2 || 0);
    var maxDecimal = max(decimal1, decimal2);
    var exponent = maxDecimal ? pow(10, maxDecimal) : 1;

    if (maxDecimal) {
      num1 = integer(num1, decimal1, maxDecimal);
      num2 = integer(num2, decimal2, maxDecimal);
    }

    var result = handlerFn(num1, num2);

    if (lastHandlerFn) {
      return lastHandlerFn(result, exponent);
    }

    return result / exponent;
  }
  /**
   * 将传入数字乘以一定的倍数, 不使用乘法的方式, 防止出现乘法精度不准的问题
   * @param {Number} num 需要处理的数字
   * @param {Number} decimal 当前数字的小数位
   * @param {Number} maxDecimal 最大小数位
   */


  function integer(num, decimal, maxDecimal) {
    num = ('' + num).replace('.', '');

    if (decimal !== maxDecimal) {
      num += repeat('0', maxDecimal - decimal);
    }

    return Number(num);
  } // add


  defineOperation('$jia $add', $add$1);

  function $add$1(num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 + num2;
    });
  } // subtract


  defineOperation('$jian $subtract', function (num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 - num2;
    });
  }); // multiply

  defineOperation('$cheng $multiply', function (num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 * num2;
    }, function (result, exponent) {
      return result / pow(exponent, 2);
    });
  }); // divide

  defineOperation('$chu $divide', $divide);

  function $divide(num1, num2) {
    return handler(num1, num2, function (num1, num2) {
      return num1 / num2;
    }, function (result) {
      return result;
    });
  }

  defineValue(Math, '$mean', function () {
    var count = slice.call(arguments).reduce(function (count, next) {
      return $add$1(count, next);
    });
    return $divide(count, arguments.length);
  });
  var fromCharCode = String.fromCharCode;

  function stringRandom()
  /* uppercase */
  {
    var uppercase = parametersDefault(arguments, 0, false);
    return fromCharCode(uppercase ? intRandom(65, 90) : intRandom(97, 122));
  }

  defineValue(String, '$random', stringRandom);
  defineValue(String, '$someRandom', function ()
  /* length, uppercase, number */
  {
    var args = arguments;
    var uppercase = parametersDefault(args, 1, false);
    var number = parametersDefault(args, 2, false);
    var result = '';
    var length = parametersDefault(args, 0, 12);

    while (length-- > 0) {
      // 指定了也随机大写字母, 则几率是三分之一
      // 否则只是随机小写字母及数字, 则几率是二分之一
      if (number && intRandom(0, uppercase ? 2 : 1) === 0) {
        result += intRandom(0, 9);
      } // 随机大小写字母
      else {
          result += stringRandom(uppercase && intRandom(0, 1) === 0);
        }
    }

    return result;
  });
  var rkeyword = /([\.\*\+\?\|\(\)\[\]\{\}\^\$\\])/g;
  /**
   * 判断传入对象是否是 RegExp 类型
   * @param {any} obj 需要判断的对象
   * @returns {Boolean}
   */

  function isRegExp(obj) {
    return toString.call(obj) === '[object RegExp]';
  }

  var RegExpProto = RegExp.prototype;
  /**
   * 在一个对象上定义/修改一个新属性的 get 描述符
   * @param {any} obj 要在其上定义属性的对象, 为数组时将对数组内对象都进行属性定义
   * @param {String} name 要定义或修改的属性的名称
   * @param {Function} get 将被定义或修改的 get 描述符
   * @param {any} options 将被定义或修改的属性描述符
   */

  function defineGet(obj, name, get, options) {
    define(obj, name, {
      get: get
    }, options || defineGetPropertyOptions);
    return get;
  }

  var rflags = /[gimsuy]*$/;

  if (RegExpProto.flags === undefined) {
    defineGet(RegExpProto, 'flags', function () {
      return this.toString().match(rflags)[0];
    });
  }

  defineValue(StringProto, '$replaceAll', function (searchValue, replaceValue) {
    var flags = 'g';

    if (searchValue == null) {
      return this;
    }

    if (searchValue[isString]) {
      searchValue = searchValue.replace(rkeyword, '\\$1');
    } else if (isRegExp(searchValue)) {
      if (searchValue.global) {
        flags = searchValue.flags;
      } else {
        flags += searchValue.flags;
      }

      searchValue = searchValue.source;
    }

    return this.replace(new RegExp(searchValue, flags), replaceValue || '');
  });
  ['$toCapitalize', ''].forEach(function (name, index) {
    var fn = ['toUpperCase', 'toLowerCase'][index ? 'reverse' : '$self']();
    var toUpperCase = fn[0];
    var toLowerCase = fn[1];
    defineValue(StringProto, name + " $" + toUpperCase.replace('C', 'FirstC'), function (ignoreNext) {
      return this.substr(0, 1)[toUpperCase]() + this.substr(1)[ignoreNext ? '$self' : toLowerCase]();
    });
  });
  var SECONDS_A_MINUTE = 60;
  var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
  var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
  var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
  var MILLISECONDS_A_SECOND = 1e3;
  var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND; // English locales

  var MS = 'millisecond';
  var S = 'second';
  var MIN = 'minute';
  var H = 'hour';
  var D = 'day';
  var W = 'week';
  var M = 'month';
  var Q = 'quarter';
  var Y = 'year';
  var DATE = 'date';
  var FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'; // regex

  var REGEX_PARSE = /^(\d{4})-?(\d{1,2})-?(\d{0,2})(.*?(\d{1,2}):(\d{1,2}):(\d{1,2}))?.?(\d{1,3})?$/;
  var REGEX_FORMAT = /\[.*?\]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
  var en = {
    name: 'en',
    weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_')
  };

  var padStart = function padStart(string, length, pad) {
    var s = String(string);
    if (!s || s.length >= length) return string;
    return "" + Array(length + 1 - s.length).join(pad) + string;
  };

  var padZoneStr = function padZoneStr(negMinuts) {
    var minutes = Math.abs(negMinuts);
    var hourOffset = Math.floor(minutes / 60);
    var minuteOffset = minutes % 60;
    return "" + (negMinuts <= 0 ? '+' : '-') + padStart(hourOffset, 2, '0') + ":" + padStart(minuteOffset, 2, '0');
  };

  var monthDiff = function monthDiff(a, b) {
    // function from moment.js in order to keep the same result
    var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    var anchor = a.clone().add(wholeMonthDiff, 'months');
    var c = b - anchor < 0;
    var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), 'months');
    return Number(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)));
  };

  var absFloor = function absFloor(n) {
    return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
  };

  var prettyUnit = function prettyUnit(u) {
    var special = {
      M: M,
      y: Y,
      w: W,
      d: D,
      h: H,
      m: MIN,
      s: S,
      ms: MS
    };
    return special[u] || String(u || '').toLowerCase().replace(/s$/, '');
  };

  var isUndefined = function isUndefined(s) {
    return s === undefined;
  };

  var U = {
    padStart: padStart,
    padZoneStr: padZoneStr,
    monthDiff: monthDiff,
    absFloor: absFloor,
    prettyUnit: prettyUnit,
    isUndefined: isUndefined
  };
  var L = 'en'; // global locale

  var Ls = {}; // global loaded locale

  Ls[L] = en;

  var isDayjs = function isDayjs(d) {
    return d instanceof Dayjs;
  }; // eslint-disable-line no-use-before-define


  var parseLocale = function parseLocale(preset, object, isLocal) {
    var l;
    if (!preset) return null;

    if (typeof preset === 'string') {
      if (Ls[preset]) {
        l = preset;
      }

      if (object) {
        Ls[preset] = object;
        l = preset;
      }
    } else {
      var name = preset.name;
      Ls[name] = preset;
      l = name;
    }

    if (!isLocal) L = l;
    return l;
  };

  var dayjs = function dayjs(date, c) {
    if (isDayjs(date)) {
      return date.clone();
    }

    var cfg = c || {};
    cfg.date = date;
    return new Dayjs(cfg); // eslint-disable-line no-use-before-define
  };

  var wrapper = function wrapper(date, instance) {
    return dayjs(date, {
      locale: instance.$L
    });
  };

  var Utils = U; // for plugin use

  Utils.parseLocale = parseLocale;
  Utils.isDayjs = isDayjs;
  Utils.wrapper = wrapper;

  var parseDate = function parseDate(date) {
    var reg;
    if (date === null) return new Date(NaN); // Treat null as an invalid date

    if (Utils.isUndefined(date)) return new Date();
    if (date instanceof Date) return date; // eslint-disable-next-line no-cond-assign

    if (typeof date === 'string' && /.*[^Z]$/i.test(date) // looking for a better way
    && (reg = date.match(REGEX_PARSE))) {
      // 2018-08-08 or 20180808
      return new Date(reg[1], reg[2] - 1, reg[3] || 1, reg[5] || 0, reg[6] || 0, reg[7] || 0, reg[8] || 0);
    }

    return new Date(date); // timestamp
  };

  var Dayjs =
  /*#__PURE__*/
  function () {
    function Dayjs(cfg) {
      this.parse(cfg); // for plugin
    }

    var _proto = Dayjs.prototype;

    _proto.parse = function parse(cfg) {
      this.$d = parseDate(cfg.date);
      this.init(cfg);
    };

    _proto.init = function init(cfg) {
      var $d = this.$d;
      this.$y = $d.getFullYear();
      this.$M = $d.getMonth();
      this.$D = $d.getDate();
      this.$W = $d.getDay();
      this.$H = $d.getHours();
      this.$m = $d.getMinutes();
      this.$s = $d.getSeconds();
      this.$ms = $d.getMilliseconds();
      this.$L = this.$L || parseLocale(cfg.locale, null, true) || L;
    } // eslint-disable-next-line class-methods-use-this
    ;

    _proto.$utils = function $utils() {
      return Utils;
    };

    _proto.isValid = function isValid() {
      return !(this.$d.toString() === 'Invalid Date');
    };

    _proto.isSame = function isSame(that, units) {
      var other = dayjs(that);
      return this.startOf(units) <= other && other <= this.endOf(units);
    };

    _proto.isAfter = function isAfter(that, units) {
      return dayjs(that) < this.startOf(units);
    };

    _proto.isBefore = function isBefore(that, units) {
      return this.endOf(units) < dayjs(that);
    };

    _proto.year = function year() {
      return this.$y;
    };

    _proto.month = function month() {
      return this.$M;
    };

    _proto.day = function day() {
      return this.$W;
    };

    _proto.date = function date() {
      return this.$D;
    };

    _proto.hour = function hour() {
      return this.$H;
    };

    _proto.minute = function minute() {
      return this.$m;
    };

    _proto.second = function second() {
      return this.$s;
    };

    _proto.millisecond = function millisecond() {
      return this.$ms;
    };

    _proto.unix = function unix() {
      return Math.floor(this.valueOf() / 1000);
    };

    _proto.valueOf = function valueOf() {
      // timezone(hour) * 60 * 60 * 1000 => ms
      return this.$d.getTime();
    };

    _proto.startOf = function startOf(units, _startOf) {
      var _this = this; // startOf -> endOf


      var isStartOf = !Utils.isUndefined(_startOf) ? _startOf : true;
      var unit = Utils.prettyUnit(units);

      var instanceFactory = function instanceFactory(d, m) {
        var ins = wrapper(new Date(_this.$y, m, d), _this);
        return isStartOf ? ins : ins.endOf(D);
      };

      var instanceFactorySet = function instanceFactorySet(method, slice) {
        var argumentStart = [0, 0, 0, 0];
        var argumentEnd = [23, 59, 59, 999];
        return wrapper(_this.toDate()[method].apply( // eslint-disable-line prefer-spread
        _this.toDate(), (isStartOf ? argumentStart : argumentEnd).slice(slice)), _this);
      };

      switch (unit) {
        case Y:
          return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);

        case M:
          return isStartOf ? instanceFactory(1, this.$M) : instanceFactory(0, this.$M + 1);

        case W:
          return isStartOf ? instanceFactory(this.$D - this.$W, this.$M) : instanceFactory(this.$D + (6 - this.$W), this.$M);

        case D:
        case DATE:
          return instanceFactorySet('setHours', 0);

        case H:
          return instanceFactorySet('setMinutes', 1);

        case MIN:
          return instanceFactorySet('setSeconds', 2);

        case S:
          return instanceFactorySet('setMilliseconds', 3);

        default:
          return this.clone();
      }
    };

    _proto.endOf = function endOf(arg) {
      return this.startOf(arg, false);
    };

    _proto.$set = function $set(units, int) {
      var _C$D$C$DATE$C$M$C$Y$C; // private set


      var unit = Utils.prettyUnit(units);
      var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C[D] = 'setDate', _C$D$C$DATE$C$M$C$Y$C[DATE] = 'setDate', _C$D$C$DATE$C$M$C$Y$C[M] = 'setMonth', _C$D$C$DATE$C$M$C$Y$C[Y] = 'setFullYear', _C$D$C$DATE$C$M$C$Y$C[H] = 'setHours', _C$D$C$DATE$C$M$C$Y$C[MIN] = 'setMinutes', _C$D$C$DATE$C$M$C$Y$C[S] = 'setSeconds', _C$D$C$DATE$C$M$C$Y$C[MS] = 'setMilliseconds', _C$D$C$DATE$C$M$C$Y$C)[unit];
      var arg = unit === D ? this.$D + (int - this.$W) : int;
      if (this.$d[name]) this.$d[name](arg);
      this.init();
      return this;
    };

    _proto.set = function set(string, int) {
      return this.clone().$set(string, int);
    };

    _proto.add = function add(number, units) {
      var _this2 = this,
          _C$MIN$C$H$C$S$unit;

      number = Number(number); // eslint-disable-line no-param-reassign

      var unit = Utils.prettyUnit(units);

      var instanceFactory = function instanceFactory(u, n) {
        var date = _this2.set(DATE, 1).set(u, n + number);

        return date.set(DATE, Math.min(_this2.$D, date.daysInMonth()));
      };

      var instanceFactorySet = function instanceFactorySet(n) {
        var date = new Date(_this2.$d);
        date.setDate(date.getDate() + n * number);
        return wrapper(date, _this2);
      };

      if (unit === M) {
        return instanceFactory(M, this.$M);
      }

      if (unit === Y) {
        return instanceFactory(Y, this.$y);
      }

      if (unit === D) {
        return instanceFactorySet(1);
      }

      if (unit === W) {
        return instanceFactorySet(7);
      }

      var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE, _C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR, _C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND, _C$MIN$C$H$C$S$unit)[unit] || 1; // ms

      var nextTimeStamp = this.valueOf() + number * step;
      return wrapper(nextTimeStamp, this);
    };

    _proto.subtract = function subtract(number, string) {
      return this.add(number * -1, string);
    };

    _proto.format = function format(formatStr) {
      var _this3 = this;

      var str = formatStr || FORMAT_DEFAULT;
      var zoneStr = Utils.padZoneStr(this.$d.getTimezoneOffset());
      var locale = this.$locale();
      var weekdays = locale.weekdays,
          months = locale.months;

      var getShort = function getShort(arr, index, full, length) {
        return arr && arr[index] || full[index].substr(0, length);
      };

      var get$H = function get$H(match) {
        if (_this3.$H === 0) return 12;
        return Utils.padStart(_this3.$H < 13 ? _this3.$H : _this3.$H - 12, match === 'hh' ? 2 : 1, '0');
      };

      return str.replace(REGEX_FORMAT, function (match) {
        if (match.indexOf('[') > -1) return match.replace(/\[|\]/g, '');
        return {
          YY: String(_this3.$y).slice(-2),
          YYYY: String(_this3.$y),
          M: String(_this3.$M + 1),
          MM: Utils.padStart(_this3.$M + 1, 2, '0'),
          MMM: getShort(locale.monthsShort, _this3.$M, months, 3),
          MMMM: months[_this3.$M],
          D: String(_this3.$D),
          DD: Utils.padStart(_this3.$D, 2, '0'),
          d: String(_this3.$W),
          dd: getShort(locale.weekdaysMin, _this3.$W, weekdays, 2),
          ddd: getShort(locale.weekdaysShort, _this3.$W, weekdays, 3),
          dddd: weekdays[_this3.$W],
          H: String(_this3.$H),
          HH: Utils.padStart(_this3.$H, 2, '0'),
          h: get$H(match),
          hh: get$H(match),
          a: _this3.$H < 12 ? 'am' : 'pm',
          A: _this3.$H < 12 ? 'AM' : 'PM',
          m: String(_this3.$m),
          mm: Utils.padStart(_this3.$m, 2, '0'),
          s: String(_this3.$s),
          ss: Utils.padStart(_this3.$s, 2, '0'),
          SSS: Utils.padStart(_this3.$ms, 3, '0'),
          Z: zoneStr
        }[match] || zoneStr.replace(':', ''); // 'ZZ'
      });
    };

    _proto.diff = function diff(input, units, float) {
      var _C$Y$C$M$C$Q$C$W$C$D$;

      var unit = Utils.prettyUnit(units);
      var that = dayjs(input);
      var diff = this - that;
      var result = Utils.monthDiff(this, that);
      result = (_C$Y$C$M$C$Q$C$W$C$D$ = {}, _C$Y$C$M$C$Q$C$W$C$D$[Y] = result / 12, _C$Y$C$M$C$Q$C$W$C$D$[M] = result, _C$Y$C$M$C$Q$C$W$C$D$[Q] = result / 3, _C$Y$C$M$C$Q$C$W$C$D$[W] = diff / MILLISECONDS_A_WEEK, _C$Y$C$M$C$Q$C$W$C$D$[D] = diff / MILLISECONDS_A_DAY, _C$Y$C$M$C$Q$C$W$C$D$[H] = diff / MILLISECONDS_A_HOUR, _C$Y$C$M$C$Q$C$W$C$D$[MIN] = diff / MILLISECONDS_A_MINUTE, _C$Y$C$M$C$Q$C$W$C$D$[S] = diff / MILLISECONDS_A_SECOND, _C$Y$C$M$C$Q$C$W$C$D$)[unit] || diff; // milliseconds

      return float ? result : Utils.absFloor(result);
    };

    _proto.daysInMonth = function daysInMonth() {
      return this.endOf(M).$D;
    };

    _proto.$locale = function $locale() {
      // get locale object
      return Ls[this.$L];
    };

    _proto.locale = function locale(preset, object) {
      var that = this.clone();
      that.$L = parseLocale(preset, object, true);
      return that;
    };

    _proto.clone = function clone() {
      return wrapper(this.toDate(), this);
    };

    _proto.toDate = function toDate() {
      return new Date(this.$d);
    };

    _proto.toArray = function toArray() {
      return [this.$y, this.$M, this.$D, this.$H, this.$m, this.$s, this.$ms];
    };

    _proto.toJSON = function toJSON() {
      return this.toISOString();
    };

    _proto.toISOString = function toISOString() {
      // ie 8 return
      // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
      // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      return this.$d.toISOString();
    };

    _proto.toObject = function toObject() {
      return {
        years: this.$y,
        months: this.$M,
        date: this.$D,
        hours: this.$H,
        minutes: this.$m,
        seconds: this.$s,
        milliseconds: this.$ms
      };
    };

    _proto.toString = function toString() {
      return this.$d.toUTCString();
    };

    return Dayjs;
  }();

  dayjs.extend = function (plugin, option) {
    plugin(option, Dayjs, dayjs);
    return dayjs;
  };

  dayjs.locale = parseLocale;
  dayjs.isDayjs = isDayjs;

  dayjs.unix = function (timestamp) {
    return dayjs(timestamp * 1e3);
  };

  dayjs.en = Ls[L];
  var DateProto = Date.prototype;
  var DAYJS = '__ZENJS_DAYJS__';
  defineValue(DateProto, '$dayjs', function () {
    var $dayjs = this[DAYJS];

    if (!$dayjs || $dayjs.valueOf() !== +this) {
      return this[DAYJS] = dayjs(this);
    }

    return $dayjs;
  });
  defineValue(Date, '$parse', function (date) {
    var $dayjs = dayjs(date);
    var $date = $dayjs.toDate().$set(DAYJS, $dayjs);
    return $date;
  });
  defineValue(Date, '$format', function (date, formatStr) {
    return dayjs(date).format(formatStr);
  });
  /**
   * @type {Boolean} 当前是否是 Node 环境
   */

  var inNode = typeof global !== 'undefined';
  var root = inBrowser ? window : inNode ? global : {};
  defineValue(root, 'dayjs', dayjs);

  var index = function (o, c, d) {
    c.prototype.isBetween = function (a, b, u) {
      var dA = d(a);
      var dB = d(b);
      return this.isAfter(dA, u) && this.isBefore(dB, u) || this.isBefore(dA, u) && this.isAfter(dB, u);
    };
  };

  var index$1 = function (o, c) {
    c.prototype.isSameOrBefore = function (that, units) {
      return this.isSame(that, units) || this.isBefore(that, units);
    };
  };

  var index$2 = function (o, c) {
    c.prototype.isSameOrAfter = function (that, units) {
      return this.isSame(that, units) || this.isAfter(that, units);
    };
  };

  var index$3 = function (o, c) {
    var proto = c.prototype;

    proto.isLeapYear = function () {
      return this.$y % 4 === 0 && this.$y % 100 !== 0 || this.$y % 400 === 0;
    };
  };

  [index, index$1, index$2, index$3].forEach(dayjs.extend);
  var ignore = 'clone_init_parse_toDate_toISOString_toJSON_toString_locale'.split('_');
  var isDayjs$1 = dayjs.isDayjs;
  dayjs.extend(function (option, Dayjs) {
    entries(Dayjs.prototype).forEach(function (obj) {
      obj[0].indexOf('$') === 0 || ignore.indexOf(obj[0]) > -1 || install(obj[0], obj[1]);
    });
  });

  function install(name, fn) {
    defineValue(DateProto, '$' + name, function () {
      var result = fn.apply(this.$dayjs(), arguments);

      if (isDayjs$1(result)) {
        this.setTime(result.valueOf());
        this[DAYJS] = result;
        return this;
      }

      return result;
    });
    ['isValid', 'format'].$inArray(name) || defineValue(Date, '$' + name, function () {
      var result = fn.apply(dayjs(), arguments);
      return isDayjs$1(result) ? result.$d.$set(DAYJS, result) : result;
    });
  }

  defineValue(FunctionProto, '$after', function () {
    var func = this;
    var num = parametersDefault(arguments, 0, 1);
    return function () {
      num-- < 1 && func.apply(this, arguments);
    };
  });
  defineValue(FunctionProto, '$args', function (oArgs) {
    var func = this;
    return function () {
      var args = [];
      var currentArgs = arguments;
      var oArgsKeys = keys(oArgs);
      var length = oArgsKeys.length + currentArgs.length;
      var currentIndex = 0;
      var index = 0;

      for (; index < length; index++) {
        args[index] = index in oArgs ? oArgs[index] : currentArgs[currentIndex++];
      }

      oArgsKeys.forEach(function (index) {
        index in args || args.$set(index, oArgs[index]);
      });
      return func.apply(this, args);
    };
  });
  defineValue(FunctionProto, '$one $once', function () {
    var func = this;
    var num = parametersDefault(arguments, 0, 1);
    var index = 1;
    return function () {
      index++ === num && func.apply(this, arguments);
    };
  });
  defineValue(RegExp, '$parse', function (keyword, flags) {
    return new RegExp(keyword.replace(rkeyword, '\\$1'), flags);
  });
  defineValue(root, '$typeof', function (obj) {
    if (obj == null) return obj + '';
    return obj[isArray] ? 'array' : typeof obj;
  });
  var rBackSlant = /\+/g;

  function toString$1(obj) {
    switch (typeof obj) {
      case 'string':
        return obj;

      case 'boolean':
        return obj ? 'true' : 'false';

      case 'number':
        return isFinite(obj) ? obj : '';

      default:
        return '';
    }
  }

  function stringify(obj) {
    var args = arguments;
    var sep = parametersDefault(args, 1, '&');
    var eq = parametersDefault(args, 2, '=');

    if (isObject(obj)) {
      return keys(obj).map(function (key) {
        return encodeURIComponent(toString$1(key)) + eq + encodeURIComponent(toString$1(obj[key]));
      }).join(sep);
    }

    return '';
  }

  function parse(str) {
    var result = {};

    if (!str || !isString$1(str)) {
      return result;
    }

    var args = arguments;
    var sep = parametersDefault(args, 1, '&');
    var eq = parametersDefault(args, 2, '=');
    str.split(sep).forEach(function (_value) {
      var cache = _value.replace(rBackSlant, '%20');

      var index = cache.indexOf(eq);
      var key,
          value = '';

      if (index > -1) {
        key = cache.substr(0, index);
        value = cache.substr(index + 1);
      } else {
        key = cache;
      }

      result[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return result;
  }

  defineValue(root, '$querystring', assign(false, [null, {
    stringify: stringify,
    parse: parse
  }]));
  /**
   * 传入一个键值对的列表, 并返回一个带有这些键值对的新对象 ( 是 Object.entries 的反转 )
   * Object.fromEntries polyfill
   */

  function fromEntries(iterable) {
    var result = {};
    var newIterable = $toArray(iterable);
    var item;
    var index = newIterable.length;

    while (index--) {
      item = newIterable[index];

      if (item && item.length) {
        result[item[0]] = item[1];
      }
    }

    return result;
  }
  /**
   * 返回传入的第一个参数
   * @param {any} arg 
   * @returns {any} arg
   */


  function returnArg(arg) {
    return arg;
  }
  /**
   * 始终返回 true
   * @returns {Boolean} true
   */


  function returnTrue() {
    return true;
  }
  /**
   * 始终返回 false
   * @returns {Boolean} false
   */


  function returnFalse() {
    return false;
  }
  /**
   * 一个空方法
   */


  function noop() {}

  var ZenJS$1 = root.ZenJS = assign(false, [null, {
    assign: assign$1,
    repeat: repeat,
    keys: keys,
    values: values,
    entries: entries,
    fromEntries: fromEntries,
    congruence: congruence,
    equals: equals,
    define: define,
    defineValue: defineValue,
    defineGet: defineGet,
    intRandom: intRandom,
    returnArg: returnArg,
    returnTrue: returnTrue,
    returnFalse: returnFalse,
    noop: noop,
    parametersDefault: parametersDefault,
    parametersRest: parametersRest,
    isString: isString$1,
    isBoolean: isBoolean$1,
    isArray: isArray$1,
    isNumber: isNumber,
    isRegExp: isRegExp,
    isSet: isSet,
    isMap: isMap,
    isFunction: isFunction,
    isObject: isObject,
    isReferenceType: isReferenceType,
    mapSetToArray: mapSetToArray,
    config: {
      event: {
        modifiers: true,
        returnFalse: true
      }
    }
  }]);
  var guid = 1;
  defineProperty(ZenJS$1, 'guid', {
    get: function () {
      return guid++;
    }
  });

  if (inBrowser) {
    defineValue(document, '$id', document.getElementById);
  }

  var addEventListener = 'addEventListener';
  var removeEventListener = 'removeEventListener';
  var DOMContentLoaded = 'DOMContentLoaded';
  var load = 'load';

  if (inBrowser) {
    defineValue(document, '$ready', function (func, data) {
      if (document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll) {
        func.apply(window, data);
      } else {
        document[addEventListener](DOMContentLoaded, function callback() {
          document[removeEventListener](DOMContentLoaded, callback);
          func.apply(window, data);
        });
      }
    });
  }

  if (inBrowser) {
    defineValue(window, '$ready', function (func, data) {
      if (document.readyState === 'complete') {
        func.apply(window, data);
      } else {
        window[addEventListener](load, function callback() {
          window[removeEventListener](load, callback);
          func.apply(window, data);
        });
      }
    });
  }
  /**
   * @type {Element}
   */


  var ElementProto = inBrowser ? DomElement.prototype : undefined;
  var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

  function access(elem, _className, handle) {
    var classList = elem.classList;
    var className = (_className || '').match(rnothtmlwhite) || []; // 判断是 class 否存在

    if (handle === 'has') {
      var length = className.length;
      var index = 0;

      for (; index < length; index++) {
        if (classList.contains(className[index]) === false) {
          return false;
        }
      } // 以防传入空等值时返回 true


      return length !== 0;
    } // 切换 class
    else if (handle === null) {
        className.forEach(function (name) {
          classList[classList.contains(name) ? 'remove' : 'add'](name);
        });
      } // 正常添加删除
      else {
          className.forEach(function (name) {
            return classList[handle](name);
          });
        }

    return elem;
  }

  if (inBrowser) {
    defineValue(ElementProto, '$addClass', function (className) {
      return access(this, className, 'add');
    });
    defineValue(ElementProto, '$removeClass $deleteClass', function (className) {
      // 移除所有 class
      if (!className && className !== '') {
        return this.className = '', this;
      } // 移除指定 class


      return access(this, className, 'remove');
    });
    defineValue(ElementProto, '$hasClass', function (className) {
      return access(this, className, 'has');
    });
    defineValue(ElementProto, '$toggleClass', function (className, tSwitch) {
      var handle = arguments.length > 1 ? tSwitch ? 'add' : 'remove' : null;
      return access(this, className, handle);
    });
  }

  if (inBrowser && !ElementProto.matches) {
    ['webkit', 'o', 'ms', 'moz'].$each(function (core) {
      var matchesKey = core + 'MatchesSelector';
      var matchesValue = ElementProto[matchesKey];

      if (matchesValue) {
        ElementProto.matches = matchesValue;
        return false;
      }
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$is', function (selector) {
      if (selector.nodeType) return this === selector;else if (isString$1(selector)) return this.matches(selector);else if (isFunction(selector)) return !!selector(this);
      return false;
    });
    defineValue(ElementProto, '$not', function (selector) {
      return !this.$is(selector);
    });
  }
  /**
   * 
   * @param {Element} node 当前 DOM 元素, 也可是 DOM 元素数组
   * @param {String} filter 过滤元素的 CSS 选择器和方法
   * @param {String} handler 获取下一个 DOM 元素的属性名
   * @param {Boolean} checkSelf 检测完当前 DOM 元素后再检测其他 DOM 元素
   */


  function Filter(node, filter, handler, checkSelf) {
    // 没有可过滤的元素
    if (node == null || node.length === 0) return node; // 没有过滤条件

    if (filter == null) {
      if (node.nodeType) {
        return checkSelf ? node : node[handler];
      }

      return node;
    } // 传入的 filter 是否是方法
    // 传入了方法则使用传入的方法进行过滤
    // 否则使用 $is 来进行过滤


    var filterIsFunction = filter[isFunction$1]; // Node

    if (node.nodeType) {
      // 首先检测当前 DOM 元素, 检测通过就直接返回
      if (checkSelf && (filterIsFunction ? filter(node) : node.$is(filter))) {
        return node;
      } // 检测没通过就去获取下一个 DOM 元素再进行检测


      if (filterIsFunction) {
        while ((node = node[handler]) && !filter(node)) {}
      } else {
        while ((node = node[handler]) && !node.$is(filter)) {}
      }

      return node;
    } // Node Array


    return node.filter(filterIsFunction ? filter : function (elem) {
      return elem.$is(filter);
    });
  }

  function dir(elem, handler) {
    var matched = [];
    var index = 0;

    while (elem = elem[handler]) {
      matched[index++] = elem;
    }

    return matched;
  }

  if (inBrowser) {
    defineValue(ElementProto, '$first $firstChild', function (filter) {
      return Filter(this.firstElementChild, filter, 'nextElementSibling', true);
    });
    defineValue(ElementProto, '$last $lastChild', function (filter) {
      return Filter(this.lastElementChild, filter, 'previousElementSibling', true);
    });
  }

  inBrowser && [['$next', 'nextElementSibling'], ['$prev', 'previousElementSibling']].forEach(function (arr) {
    var name = arr[0];
    var fn = arr[1];
    defineValue(ElementProto, name, function (filter) {
      return Filter(this, filter, fn);
    });
    defineValue(ElementProto, name + 'All', function (filter) {
      return Filter(dir(this, fn), filter);
    });
  });

  if (inBrowser) {
    defineValue(ElementProto, '$child $children', function (filter) {
      return Filter(slice.call(this.children), filter);
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$parent', function (filter) {
      return Filter(this.parentElement, filter, null, true);
    });
    defineValue(ElementProto, '$parents', function (filter, checkSelf) {
      return Filter(this, filter, 'parentElement', checkSelf);
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$siblings', function (filter) {
      var parent = this.parentElement;

      if (parent) {
        var children = slice.call(parent.children);
        return Filter(children.$splice(children.indexOf(this), 1), filter);
      }

      return [];
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$append', function (elem) {
      return this.appendChild(elem), this;
    });
    defineValue(ElementProto, '$prepend', function (elem) {
      return this.insertBefore(elem, this.firstElementChild), this;
    });
    defineValue(ElementProto, '$appendTo', function (elem) {
      return elem.appendChild(this), this;
    });
    defineValue(ElementProto, '$prependTo', function (elem) {
      return elem.insertBefore(this, elem.firstElementChild), this;
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$before', function (elem, parent) {
      if (parent = this.parentNode) {
        parent.insertBefore(elem, this);
      }

      return this;
    });
    defineValue(ElementProto, '$after', function (elem, parent) {
      if (parent = this.parentNode) {
        parent.insertBefore(elem, this.nextElementSibling);
      }

      return this;
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$delete $remove', function (parent) {
      if (parent = this.parentNode) {
        parent.removeChild(this);
      }
    });
  }

  if (inBrowser) {
    [document, ElementProto].forEach(function (elem) {
      var querySelectorAll = elem.querySelectorAll;
      defineValue(elem, '$query $find', function () {
        return slice.call(querySelectorAll.apply(this, arguments));
      });
      defineValue(elem, '$queryFirst $findFirst', elem.querySelector);
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$replaceWith $replace', function (elem, parent) {
      if (parent = this.parentNode) {
        parent.replaceChild(elem, this);
      }
    });
  }

  var propFix = {
    "for": "htmlFor",
    "class": "className"
  };
  ["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"].forEach(function (prop) {
    propFix[prop.toLowerCase()] = prop;
  });
  var rfocusable = /^(?:input|select|textarea|button)$/i;
  var rclickable = /^(?:a|area)$/i;
  /**
   * 判断当前浏览器的 option 是否在不激活 selectedIndex 属性时, 是始终返回 false 的
   */

  var supportsSelectedIndex = true;

  if (inBrowser) {
    var select = document.createElement('select');
    var option = document.createElement('option').$appendTo(select); // Support: IE <=11 only
    // Must access selectedIndex to make default options select

    supportsSelectedIndex = option.selected;
  }

  var supportsSelectedIndex$1 = supportsSelectedIndex;
  var propHooks = {
    tabIndex: {
      get: function (elem, name) {
        var tabIndex = elem.getAttribute(name);

        if (tabIndex) {
          return parseInt(tabIndex, 10);
        }

        if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
          return 0;
        }

        return -1;
      }
    }
  };

  if (!supportsSelectedIndex$1) {
    var selected = function (elem) {
      var parent = elem.parentNode;

      if (parent) {
        parent.selectedIndex;
      }
    };

    propHooks.selected = {
      get: selected,
      set: selected
    };
  }

  function access$1(elem, arg, args, func) {
    var name;

    if (isObject(arg)) {
      args = slice.call(args).splice(0, 1);

      for (name in arg) {
        func.apply(elem, [name, arg[name]].concat(args));
      }
    } else {
      return func.apply(elem, args);
    }

    return elem;
  }

  if (inBrowser) {
    defineValue(ElementProto, '$prop', function (prop, value) {
      return access$1(this, prop, arguments, function (prop, value) {
        var name = propFix[prop] || prop;
        var hooks = propHooks[name];
        var result;

        if (arguments.length > 1) {
          if (hooks && 'set' in hooks) hooks.set(this);
          this[name] = value;
          return this;
        }

        if (hooks && 'get' in hooks && (result = hooks.get(this, name)) !== undefined) {
          return result;
        }

        return this[name];
      });
    });
    defineValue(ElementProto, '$hasProp', function (prop) {
      return hasOwnProperty.call(this, propFix[prop] || prop);
    });
    defineValue(ElementProto, '$removeProp $deleteProp', function (props) {
      if (props = props && props.match(rnothtmlwhite)) {
        var prop;
        var index = 0;

        while (prop = props[index++]) {
          prop = propFix[prop] || prop;
          this[prop] = '';
          delete this[prop];
        }
      }

      return this;
    });
  }
  /**
   * 判断当前浏览器将 input 的 type 类型切换到 radio 时, 是否会丢失 value 值
   */


  var supportsRadioValue = true;

  if (inBrowser) {
    var input = document.createElement('input');
    input.value = 't';
    input.type = 'radio'; // Support: IE <=11 only
    // An input loses its value after becoming a radio

    supportsRadioValue = input.value === 't';
  }

  var supportsRadioValue$1 = supportsRadioValue;
  var attrHooks = {
    type: function (elem, value) {
      if (!supportsRadioValue$1 && value === 'radio' && elem._nodeName === 'input') {
        var val = elem.value;
        elem.setAttribute('type', value);

        if (val) {
          elem.value = val;
        }

        return true;
      }
    }
  };

  function boolHook(elem, value, name) {
    if (value === false) elem.$removeAttr(name);else elem.setAttribute(name, name);
    return true;
  }

  var rBool = /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i;

  if (inBrowser) {
    defineValue(ElementProto, '$attr', function (name, value) {
      return access$1(this, name, arguments, function (name, value) {
        var result;

        if (value === undefined) {
          return (result = this.getAttribute(name)) == null ? undefined : result;
        }

        if (value === null) {
          return this.$removeAttr(name);
        }

        var hooks = attrHooks[name.toLowerCase()] || (rBool.test(name) ? boolHook : undefined);

        if (!(hooks && hooks(this, value, name))) {
          this.setAttribute(name, value + '');
        }

        return this;
      });
    });
    defineValue(ElementProto, '$hasAttr', ElementProto.hasAttribute);
    defineValue(ElementProto, '$removeAttr $deleteAttr', function (names) {
      if (names = names && names.match(rnothtmlwhite)) {
        var name;
        var index = 0;

        while (name = names[index++]) {
          this.removeAttribute(name);
        }
      }

      return this;
    });
  }

  var reg = /-([a-z])/g;

  function toUpperCase(all, char) {
    return char.toUpperCase();
  }

  function camelCase(name) {
    return name.replace(reg, toUpperCase);
  }
  /**
   * @param {Element} elem 
   */


  function getStyles(elem) {
    // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    var view = elem.ownerDocument.defaultView;

    if (!view || !view.opener) {
      view = window;
    }

    return view.getComputedStyle(elem);
  }
  /**
   * 判断当前浏览器的 getComputedStyle 方法是否支持返回复合样式
   */


  var supportsCompoundStyle = true;

  if (inBrowser) {
    var div = document.createElement('div').$appendTo(document.documentElement);
    div.style.margin = '10px';
    var margin = getStyles(div).getPropertyValue('margin');
    supportsCompoundStyle = margin !== '';
    div.$remove();
  }

  var supportsCompoundStyle$1 = supportsCompoundStyle;
  var cssSide = ['Top', 'Right', 'Bottom', 'Left'];
  var cssRadius = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'];
  var cssHooks = {};

  if (!supportsCompoundStyle$1) {
    var CreateSideHook = function (styles, cssSide$$1) {
      each(styles, function (name, suffix) {
        cssHooks[name + suffix] = function (elem) {
          var computed = getStyles(elem);
          var result = [];

          for (var index = 0; index < 4; index++) {
            result[index] = computed[name + cssSide$$1[index] + suffix] || '0px';
          }

          var top = result[0];
          var right = result[1];
          var bottom = result[2];
          var left = result[3];

          if (right === left) {
            // 左右边相等
            if (top === bottom) {
              // 上下边相等
              return top === right ? top // 单值语法
              : top + " " + right; // 二值语法
            } else {
              return top + " " + right + " " + bottom; // 三值语法
            }
          }

          return result.join(' '); // 四值语法
        };
      });
    }; // margin
    // padding
    // border-width


    CreateSideHook({
      margin: '',
      padding: '',
      border: 'Width'
    }, cssSide); // border-radius

    CreateSideHook({
      border: 'Radius'
    }, cssRadius);
  }

  var rcustomProp = /^--/;
  var cssPrefixes = ["Webkit", "Moz", "ms"];
  var emptyStyle = document.createElement('div').style;

  function vendorPropName(name) {
    var capName = name.$toCapitalize(true);
    var index = cssPrefixes.length;

    while (index--) {
      name = cssPrefixes[i] + capName;

      if (name in emptyStyle) {
        return name;
      }
    }
  }

  function finalPropName(name) {
    if (name in emptyStyle) {
      return name;
    }

    return vendorPropName(name) || name;
  }

  var cssNumber = {
    "animationIterationCount": true,
    "columnCount": true,
    "fillOpacity": true,
    "flexGrow": true,
    "flexShrink": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "order": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  };
  /**
   * 判断当设置克隆元素的背景相关样式为空时, 是否会清空原元素的样式
   */

  var supportsClearCloneStyle = false;

  if (inBrowser) {
    var div$1 = document.createElement('div');
    div$1.style.backgroundClip = 'content-box';
    div$1.cloneNode(true).style.backgroundClip = '';
    supportsClearCloneStyle = div$1.style.backgroundClip === "content-box";
  }

  var supportsClearCloneStyle$1 = supportsClearCloneStyle;

  function style(elem, name, value) {
    // 转为驼峰写法
    var origName = camelCase(name); // 是否是 css 变量

    var isCustomProp = rcustomProp.test(name); // 

    var style = elem.style; // 转为浏览器兼容写法

    if (!isCustomProp) {
      name = finalPropName(origName);
    } // setter


    if (value !== undefined) {
      if (value == null || value !== value) {
        return;
      }

      if (isNumber(value)) {
        value += cssNumber[origName] ? '' : 'px';
      }

      if (supportsClearCloneStyle$1 && value === '' && name.indexOf("background") === 0) {
        style[name] = 'inherit';
      }

      if (isCustomProp) {
        style.setProperty(name, value);
      } else {
        style[name] = value;
      }
    } else {
      return style[name];
    }
  }

  function getCss(elem, name) {
    var computed = getStyles(elem);
    var result = computed.getPropertyValue(name) || computed[name]; // 元素不在 DOM 树中, 尝试从 style 中取值

    if ((result === '' || result === 'auto') && !elem.$parents(document.documentElement)) {
      result = style(elem, name);
    }

    return result !== undefined ? result + '' : result;
  }

  var cssDefault = {
    opacity: '1'
  };

  if (inBrowser) {
    var css = function (elem, name) {
      // 转为驼峰写法
      var origName = camelCase(name); // 是否是 css 变量

      var isCustomProp = rcustomProp.test(name); // 转为浏览器兼容写法

      if (!isCustomProp) {
        name = finalPropName(origName);
      } // 获取可能的兼容方法


      var hooks = cssHooks[name] || cssHooks[origName];
      var value;

      if (hooks) {
        value = hooks(elem);
      }

      if (value === undefined) {
        value = getCss(elem, name);
      } // 结果为空, 但是有默认值时, 返回默认值


      if (value === '' && name in cssDefault) {
        value = cssDefault[name];
      }

      if (value === 'normal' && name in cssNormalDefault) {
        val = cssNormalDefault[name];
      }

      return value;
    };

    defineValue(ElementProto, '$css', function (name) {
      return access$1(this, name, arguments, function (name, value) {
        return value === undefined ? css(this, name) : style(this, name, value);
      });
    });
  }

  var min = Math.min;

  if (inBrowser) {
    defineValue(ElementProto, '$index', function (toIndex) {
      if (arguments.length) {
        var parent = this.parentElement;

        if (parent) {
          var siblings = parent.children;
          var selfIndex = this.$prevAll().length;
          var currentIndex = min(siblings.length - 1, toIndex);

          if (selfIndex !== currentIndex) {
            var currentElem = siblings[currentIndex];
            parent.insertBefore(this, selfIndex < currentIndex ? currentElem.nextElementSibling : currentElem);
          }
        }

        return this;
      }

      return this.parentElement ? this.$prevAll().length : -1;
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$html', function (value) {
      if (arguments.length) {
        this.innerHTML = value;
        return this;
      }

      return this.innerHTML;
    });
  }

  var valHooks = {
    option: {
      get: function (elem) {
        var value = elem.getAttribute('value');

        if (value == null) {
          return (elem.textContent.match(rnothtmlwhite) || []).join(' ');
        }

        return value;
      }
    },
    select: {
      get: function (elem) {
        var options = elem.options;
        var index = elem.selectedIndex;
        var one = elem.type === 'select-one';
        var max = one ? index + 1 : options.length;
        var values = one ? null : [];
        var value, option, i;

        for (i = index < 0 ? max : one ? index : 0; i < max; i++) {
          option = options[i];

          if ((option.selected || i === index) && !option.disabled && (!option.parentNode.disabled || option.parentNode._nodeName !== 'optgroup')) {
            value = valHooks.option.get(option);

            if (one) {
              return value;
            }

            values.push(value);
          }
        }

        return values;
      },
      set: function (elem, value) {
        var options = elem.options;
        var values = $toArray(value);
        var i = options.length;
        var optionSet, option;

        while (i--) {
          option = options[i];

          if (option.selected = values.$inArray(valHooks.option.get(option))) {
            optionSet = true;
          }
        }

        if (!optionSet) {
          elem.selectedIndex = -1;
        }
      }
    }
  };
  var rreturn = /\r/g;

  if (inBrowser) {
    defineValue(ElementProto, '$val $value', function (value) {
      if (arguments.length) {
        if (value == null) {
          value = '';
        } else if (isNumber(value)) {
          value += '';
        } else if (value[isArray]) {
          value = value.map(function (val) {
            return val == null ? '' : val + '';
          });
        }

        var _hooks = valHooks[this.type] || valHooks[this._nodeName];

        if (_hooks && 'set' in _hooks) _hooks.set(this, value);else {
          this.value = value;
        }
        return this;
      }

      var hooks = valHooks[this.type] || valHooks[this._nodeName];
      var result;

      if (hooks && 'get' in hooks && (result = hooks.get(this)) !== undefined) {
        return result;
      }

      if (isString$1(result = this.value)) {
        return result.replace(rreturn, '');
      }

      if (result == null) {
        return '';
      }

      return result;
    });
  }

  if (inBrowser) {
    ['width', 'height'].forEach(function (prop) {
      defineValue(ElementProto, "$" + prop, function (value) {
        if (arguments.length) {
          this.style.setProperty(prop, $isNumber(value) ? value + "px" : value);
          return this;
        }

        try {
          return this.getBoundingClientRect()[prop];
        } catch (error) {
          return 0;
        }
      });
    });
  }

  if (inBrowser) {
    defineGet(ElementProto, '_nodeName', function () {
      return this.nodeName.toLowerCase();
    });
  }

  if (inBrowser) {
    defineValue(ElementProto, '$clone', ElementProto.cloneNode);
  }
  /**
   * @type {EventTarget}
   */


  var DomEventTarget = inBrowser ? 'EventTarget' in window ? EventTarget.prototype : [window, document, ElementProto] : undefined;
  var DATA = '__ZENJS_DATA__';
  /**
   * 获取存储在元素上的整个数据集, 如数据集不存在则创建
   * @param {Element} elem
   * @returns {Object}
   */

  function getDatas(elem) {
    return elem[DATA] || (defineValue(elem, DATA, {}), elem[DATA]);
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$data', function (name) {
      var self = this || window;
      var Data = getDatas(self);
      return access$1(self, name, arguments, function (name, value, weakRead) {
        // 读取
        // $data( name )
        // $data( name, value, true )
        if (weakRead || arguments.length < 2) {
          if (name == null) return Data;
          if (weakRead && !(name in Data)) return Data[name] = value;
          return Data[name];
        } // $data( name, value )


        Data[name] = value;
        return self;
      });
    });
    defineValue(DomEventTarget, '$hasData', function (name) {
      var Data = getDatas(this || window);

      if (isEmptyObject(Data)) {
        return false;
      }

      if (name == null) {
        return true;
      }

      return name in Data;
    });
    defineValue(DomEventTarget, '$deleteData $removeData', function (names) {
      var self = this || window;

      if (names == null) {
        self[DATA] = {};
        return self;
      }

      var Data = getDatas(self);
      (names.match(rnothtmlwhite) || []).forEach(function (name) {
        delete Data[name];
      });
      return self;
    });
  }
  /**
   * @type {Boolean} 当前环境是否支持 addEventListener 的 passive 属性
   */


  var supportsPassiveEvent = false;

  try {
    var options = defineProperty({}, 'passive', {
      get: function () {
        supportsPassiveEvent = true;
      }
    });
    window[addEventListener]('test', null, options);
  } catch (e) {}

  var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
  /**
   * 事件处理 => 功能性命名空间
   * @private
   * @param {String} name 需要解析哪一块的功能命名空间
   * @param {String[]} namespace 元素的命名空间列表
   * @param {EventTarget} elem 绑定事件的元素
   * @param {String} type 绑定的事件
   * @param {Object} options 其他属性
   */

  function modifiers(name, namespace, elem, type, options) {
    // 没有命名空间
    if (namespace.length === 0) {
      return;
    }

    return CheckForHandlers(ModifiersList[name], name, namespace, elem, type, options);
  }
  /**
   * @param {any} handlers 当前功能的修饰符列表
   */


  function CheckForHandlers(handlers, name, namespace, elem, type, options) {
    var result;
    namespace.filter(function (name) {
      return name in handlers;
    }).$each(function (handler) {
      return result = handlers[handler](elem, type, options, namespace);
    });

    if (result !== false && handlers._next) {
      return CheckForHandlers(handlers._next, name, namespace, elem, type, options);
    }

    return result;
  }

  var ModifiersList = {
    /**
     * 添加事件时
     */
    add: {},

    /**
     * 触发事件时
     */
    dispatch: {
      /**
       * 当事件是从绑定的元素本身触发时才触发回调
       */
      self: function (elem, type, event) {
        return event.target === event.currentTarget;
      }
    },

    /**
     * 触发事件的修饰符通过之后的下一步检测
     */
    dispatched: {
      /**
       * 阻止事件冒泡
       */
      stop: function (elem, type, event) {
        event.stopPropagation();
      },

      /**
       * 阻止浏览器默认事件
       */
      prevent: function (elem, type, event) {
        event.preventDefault();
      }
    }
  };
  var add = ModifiersList.add;
  var dispatch = ModifiersList.dispatch;
  dispatch._next = ModifiersList.dispatched;
  /**
   * .once || .one
   * 当命名空间有 .once 或 .one, 则会去已绑定的事件中进行查找,
   * 如果之前绑定过相同的命名空间 ( 也同样有 .once 或 .one ), 则本次绑定无效
   */

  add.once = add.one = function (elem, type, events, namespace) {
    events = events[type] || [];
    return events.$findIndex({
      namespace: namespace
    }, equals$1) === -1;
  };
  /**
   * .ctrl || .shift || .alt || .meta
   * 当按下了对应键盘按键时才触发回调
   */


  ['ctrlKey', 'shiftKey', 'altKey', 'metaKey'].forEach(function (key) {
    dispatch[key] = function (elem, type, event) {
      return !!event[key];
    };
  });
  /**
   * .left || .middle || .right
   * 当按下了对应鼠标按键时才触发回调
   */

  ['left', 'middle', 'right'].forEach(function (button, index) {
    dispatch[button] = function (elem, type, event) {
      return 'button' in event && event.button === index;
    };
  });
  /**
   * 按下了相应的键盘按键则触发
   */

  each({
    keyEsc: 27,
    keyTab: 9,
    keyEnter: 13,
    keySpace: 32,
    keyUp: 38,
    keyLeft: 37,
    keyRight: 39,
    keyDown: 40,
    keyDelete: [8, 46]
  }, function (key, keyCode) {
    dispatch[key] = function (elem, type, event) {
      if (keyCode[isArray]) {
        return keyCode.indexOf(event.keyCode) === -1;
      }

      return event.keyCode === keyCode;
    };
  });

  function init(elem, types, whileFn, whileEndFn) {
    /** 存放当前元素下的所有事件 */
    var events = elem.$data('events', {}, true);
    /** 事件总数 */

    var length = types.length;
    var tmp, type, namespace, rNamespace, handlers, handlersLength;

    while (length--) {
      /** 分离事件名称和命名空间 */
      tmp = rtypenamespace.exec(types[length]) || [];
      /** 事件名称 */

      type = tmp[1];
      if (!type) continue;
      /** 事件集 */

      handlers = events[type] || [];
      /** 事件集数量 */

      handlersLength = handlers.length;
      if (!handlersLength) continue;
      /** 命名空间 */

      namespace = (tmp[2] || '').split('.').sort().join('.');
      /** 匹配命名空间 */

      rNamespace = tmp[2] && new RegExp('^' + namespace + '$');

      while (handlersLength--) {
        whileFn(handlers[handlersLength], rNamespace, type, handlers, handlersLength);
      }

      whileEndFn && whileEndFn(handlers, events, type);
    }
  }
  /**
   * 所有事件分组的存储
   */


  var GROUPS = {// group1: [
    //   handleOptions1,
    //   handleOptions2
    // ]
  };
  /**
   * 事件分组主分组
   */

  var MAINGROUPS = {// group: [
    //   handleOptions1,
    //   handleOptions2,
    //   handleOptions3,
    //   handleOptions4
    // ]
  };
  /**
   * 事件处理 => 绑定事件
   * @private
   * @param {EventTarget} elem 需要绑定事件的对象
   * @param {String} _type 需要绑定的事件
   * @param {String} selector 事件委托的选择器
   * @param {Function} listener 绑定的事件回调
   * @param {Object} options 事件绑定参数
   * @param {String} mainGroup 事件分组参数 - 主分组, 移除主分组也会同时移除所有次分组
   * @param {String} group 事件分组参数 - 次分组
   * @param {Object} data 传递给事件的数据
   */

  function add$1(elem, _type, selector, listener, options, mainGroup, group, data) {
    /** 存放当前元素下的所有事件 */
    var events = elem.$data('events', {}, true);
    /** 事件 GUID */

    var guid = listener.guid || (listener.guid = ZenJS$1.guid);
    /** 分离事件名称和命名空间 */

    var tmp = rtypenamespace.exec(_type) || [];
    /** 事件名称 */

    var type = tmp[1];
    if (!type) return;
    /** 命名空间 */

    var namespace = (tmp[2] || '').split('.').sort(); // 处理功能性命名空间

    if (ZenJS$1.config.event.modifiers && modifiers('add', namespace, elem, type, events) === false) {
      return;
    }
    /** 该事件所有相关参数 */


    var handleOptions = {
      elem: elem,
      selector: selector,
      type: type,
      namespace: namespace,
      listener: listener,
      guid: guid,
      options: options,
      mainGroup: mainGroup,
      group: group,
      data: data,
      namespaceStr: namespace.join('.'),
      handler: function () {
        return ZenJS$1.EventListener.dispatch(this, arguments, handleOptions);
      }
    }; // 存储相关数据

    (events[type] || (events[type] = [])).push(handleOptions); // 存储分组数据

    if (group) {
      var myGroup = GROUPS[group] || (GROUPS[group] = []);
      myGroup.push(handleOptions);

      if (mainGroup) {
        var myMainGroup = MAINGROUPS[mainGroup] || (MAINGROUPS[mainGroup] = []);
        myMainGroup.push(handleOptions);
      }
    } // 绑定事件


    if (options.passive) {
      elem[addEventListener](type, handleOptions.handler, {
        passive: true,
        capture: options.capture || false
      });
    } else {
      elem[addEventListener](type, handleOptions.handler, options.capture || false);
    }
  }
  /**
   * 事件处理 => 触发事件
   * @private
   * @param {EventTarget} self 触发事件的对象
   * @param {IArguments} oArgs 原生事件触发时方法的 arguments
   * @param {Object} handleOptions 该事件的所有详细参数
   */


  function dispatch$1(self, oArgs, handleOptions) {
    /** 重写的 event 事件对象 */
    var event = new ZenJS$1.Event(oArgs[0]);
    /** 新 argument, 存放了新的 event 事件对象 */

    var args = slice.call(oArgs).$splice(0, 1, event);
    /** 事件委托选择器 */

    var selector = handleOptions.selector;
    /**  */

    var target = event.target,
        type = event.type;
    var elem = handleOptions.elem;
    event.delegateTarget = elem;
    event.handleOptions = handleOptions; // 有事件委托

    if (selector && !(type === 'click' && event.button >= 1)) {
      // 从被点击的元素开始, 一层一层往上找
      for (; target !== elem; target = target.parentNode || elem) {
        // 是元素节点
        // 点击事件, 将不处理禁用的元素
        if (target.nodeType === 1 && !(type === 'click' && target.disabled === true) && target.matches(selector)) {
          elem = event.currentTarget = target;
          break;
        }
      }

      if (event.delegateTarget === elem) {
        return;
      }
    }

    if (!event.currentTarget) {
      event.currentTarget = elem;
    }

    if (!target) {
      event.target = elem;
    } // 处理功能性命名空间


    if (ZenJS$1.config.event.modifiers && modifiers('dispatch', handleOptions.namespace, elem, type, event) === false) {
      return;
    }

    var result = handleOptions.listener.apply(self, args); // 返回 false, 阻止浏览器默认事件和冒泡

    if (result === false && ZenJS$1.config.event.returnFalse) {
      event.preventDefault();
      event.stopPropagation();
    }

    return result;
  }
  /**
   * 事件处理 => 移除事件
   * @private
   * @param {EventTarget} elem 需要移除事件的独享
   * @param {Array} types 需要移除的事件集
   * @param {Function} listener 需要移除的事件回调
   * @param {String} selector 事件委托选择器
   */


  function remove(elem, types, listener, selector) {
    init(elem, types, function (handleOptions, rNamespace, type, handlers, handlersLength) {
      // 检查注入到方法上的 guid 是否相同 ( 如果有 )
      if (!listener || listener.guid === handleOptions.guid) {
        // 检查命名空间是否相同 ( 如果有 )
        if (!rNamespace || rNamespace.test(handleOptions.namespaceStr)) {
          // 检查事件委托
          if (selector // 允许所有绑定的事件通过, 不管有没有事件委托
          ? selector === '**' || // 允许所有有事件委托的事件通过
          selector === '*' && handleOptions.selector || // 事件委托必须相同才能通过
          selector === handleOptions.selector // 允许所有没事件委托的事件通过
          : !handleOptions.selector) {
            // 移除事件
            elem[removeEventListener](type, handleOptions.handler); // 移除事件缓存

            handlers.splice(handlersLength, 1); // 移除分组缓存

            var group = handleOptions.group;
            var mainGroup = handleOptions.mainGroup; // 移除副分组

            if (group && (group = GROUPS[group]) && !group.$deleteValue(handleOptions).length) {
              delete GROUPS[handleOptions.group];
            } // 移除主分组


            if (mainGroup && (mainGroup = MAINGROUPS[mainGroup]) && !mainGroup.$deleteValue(handleOptions).length) {
              delete MAINGROUPS[handleOptions.mainGroup];
            }
          }
        }
      }
    }, function (handlers, events, type) {
      if (!handlers.length) {
        delete events[type];
      }
    });
  }
  /**
   * 事件处理 => 触发事件
   * @private
   * @param {EventTarget} elem 需要触发事件的对象
   * @param {Array} types 需要触发的事件集
   * @param {Array} data 需要传递到事件回调的参数
   */


  function emit(elem, types, data) {
    init(elem, types, function (handleOptions, rNamespace, type) {
      // 检查命名空间是否相同 ( 如果有 )
      if (!rNamespace || rNamespace.test(handleOptions.namespaceStr)) {
        // 检查事件委托 ( 不触发有事件委托的方法 )
        if (!handleOptions.selector) {
          handleOptions.handler.apply(handleOptions.elem, [type].concat(data));
        }
      }
    });
  }

  var EventListener = ZenJS$1.EventListener = assign(false, [null, {
    add: add$1,
    dispatch: dispatch$1,
    modifiers: modifiers,
    remove: remove,
    emit: emit
  }]);
  /**
   * 绑定事件 => 参数处理
   * @param {Element} elem 需要绑定事件的对象
   * @param {String} types 需要绑定的事件集
   * @param {String} selector 事件委托的选择器
   * @param {Function} listener 绑定的事件
   * @param {Object} options 事件绑定参数
   * @param {Boolean} once 事件只执行一次
   */

  function on(elem, types, selector, listener, options, once) {
    var events;
    var mainGroup, group, data; // 1. on( elem, { type: listener || Boolean } )
    // 2. on( elem, { type: listener || Boolean }, options )
    // 3. on( elem, { type: listener || Boolean }, options, selector )
    // 4. on( elem, { type: listener || Boolean }, selector )
    // 5. on( elem, { type: listener || Boolean }, selector, options )

    if (isObject(types)) {
      events = types;

      if (isString$1(selector)) {
        // 4, 5
        options = listener;
      } else {
        // 1, 2, 3
        options = selector;
        selector = listener;
      }
    } // on( elem, selector, { type: listener || Boolean } )
    // on( elem, selector, { type: listener || Boolean }, options )
    else if (isObject(selector)) {
        events = selector;
        selector = types;
        options = listener;
      }

    if (events) {
      for (var type in events) {
        on(elem, type, events[type], selector, options);
      }

      return elem;
    }

    if (!types) return elem;else {
      types = types.match(rnothtmlwhite);

      if (types == null || types.length === 0) {
        return elem;
      }
    } // on( elem, types, listener || Boolean )
    // on( elem, types, listener || Boolean, selector )
    // on( elem, types, listener || Boolean, selector, options )

    if (!isString$1(selector)) {
      var _ref = [listener, selector];
      selector = _ref[0];
      listener = _ref[1]; // on( elem, types, listener || Boolean, options )
      // on( elem, types, listener || Boolean, options, selector )

      if (!isString$1(selector) && (options === undefined || isString$1(options))) {
        var _ref2 = [selector, options];
        options = _ref2[0];
        selector = _ref2[1];
      }
    }

    if (isBoolean$1(listener)) {
      listener = listener ? returnTrue : returnFalse;
    }

    if (!listener) {
      return elem;
    } // useCapture


    if (isBoolean$1(options)) {
      options = {
        capture: options
      };
    } else {
      options = options ? assign$1({}, options) : {};
    } // mainGroup
    // group
    // 事件分组功能, 分到同一组的事件可进行同时移除


    if ('group' in options) {
      group = options.group;

      if (group[isArray]) {
        mainGroup = group[0];
        group = group[1];
      }

      delete options.group;
    }

    if ('data' in options) {
      data = options.data;
      delete options.data;
    }

    keys(options).forEach(function (key) {
      options[key] ? options[key] = true : delete options[key];
    });

    if (once || options.one || options.once) {
      var origListener = listener;

      listener = function (event) {
        elem.$off(event);
        return origListener.apply(this, arguments);
      };

      listener.guid = origListener.guid || (origListener.guid = ZenJS$1.guid);
      delete options.one;
      delete options.once;
    }

    if (options.passive && !supportsPassiveEvent) {
      delete options.passive;
    }

    types.forEach(function (type) {
      EventListener.add(elem, type, selector, listener, options, mainGroup, group, data);
    });
    return elem;
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$on', function (types, selector, listener, options) {
      var elem = this || window;
      return on(elem, types, selector, listener, options);
    });
    defineValue(DomEventTarget, '$one $once', function (types, selector, listener, options) {
      var elem = this || window;
      return on(elem, types, selector, listener, options, true);
    });
  }
  /**
   * 移除事件 => 参数处理
   * @param {*} types 
   * @param {*} selector 
   * @param {*} listener 
   * @param {*} options 
   */


  function off(elem, types, selector, listener) {
    // $off( ZenJS.Event )
    if (types instanceof ZenJS.Event) {
      return offByHandleOptions(types.handleOptions);
    } // $off( object, selector )
    // $off({ group: 'group' })
    // $off({ group: [ 'group', 'group-1' ] })


    if (isObject(types)) {
      if ('group' in types) {
        var group = types.group;
        var groups; // 移除时传入主分组或主分组与副分组时, 始终认为移除所有主分组下的内容

        if (group[isArray]) {
          var mainGroup = group[0];

          if (mainGroup && (mainGroup = MAINGROUPS[mainGroup])) {
            groups = mainGroup.slice();
          }
        } // 只移除副分组
        else if (group && (group = GROUPS[group])) {
            groups = group.slice();
          }

        if (groups) {
          groups.forEach(function (handleOptions) {
            offByHandleOptions(handleOptions);
          });
        }
      } // $off( object, selector )
      else {
          for (var type in types) {
            off(elem, type, selector, types[type]);
          }
        }

      return elem;
    }

    if (!types) return elem;else {
      types = types.match(rnothtmlwhite);

      if (types == null || types.length === 0) {
        return elem;
      }
    } // $off( types, listener )
    // $off( types, listener, selector )

    if (selector !== undefined && !isString$1(selector)) {
      var _ref = [listener, selector];
      selector = _ref[0];
      listener = _ref[1];
    } // $off( types, true || false )


    if (isBoolean$1(listener)) {
      listener = listener ? returnTrue : returnFalse;
    }

    EventListener.remove(elem, types, listener, selector);
    return elem;
  }

  function offByHandleOptions(handleOptions) {
    var namespace = handleOptions.namespaceStr;
    var handleTypes = namespace ? handleOptions.type + "." + namespace : handleOptions.type;
    return off(handleOptions.elem, handleTypes, handleOptions.selector, handleOptions.listener);
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$off', function (types, selector, listener) {
      var elem = this || window;
      return off(elem, types, selector, listener);
    });
  }
  /**
   * 触发事件 => 参数处理
   * @param {String} types 
   * @param {any} args 
   */


  function emit$1(elem, types, args) {
    if (!types) return elem;else {
      types = types.match(rnothtmlwhite);

      if (types == null || types.length === 0) {
        return elem;
      }
    }
    EventListener.emit(elem, types, parametersRest(args, 1));
    return elem;
  }

  if (inBrowser) {
    defineValue(DomEventTarget, '$emit', function (types) {
      var elem = this || window;
      return emit$1(elem, types, arguments);
    });
  }

  var rSearch = /\?.*?(?=#|$)/;

  if (inBrowser) {
    var SetSearch = function (oSearch, name, value) {
      // remove
      if (value == null) delete oSearch[name]; // setter
      else oSearch[name] = value;
    };

    var Search = function (search, name, value, isSet, isObj, isGetAll) {
      var oSearch = parse(search);
      if (isGetAll) return oSearch; // setter
      else if (isSet) {
          if (isObj) {
            each(name, function (name, value) {
              SetSearch(oSearch, name, value);
            });
          } else {
            SetSearch(oSearch, name, value);
          }

          return stringify(oSearch);
        } // getter

      return oSearch[name];
    };

    location.$search = function (name, value) {
      var isObj, isSet, isGetAll;

      if (!(isGetAll = arguments.length < 1)) {
        isSet = arguments.length > 1 || (isObj = isObject(name));
      }

      var newSearch = Search(location.search.substr(1), name, value, isSet, isObj, isGetAll);
      if (isSet) location.search = newSearch;else return newSearch;
    };

    location.$urlSearch = function (url, name, value) {
      if (isString$1(url)) {
        var isObj, isSet, isGetAll;
        var search = ((url.match(rSearch) || [])[0] || '').substr(1);

        if (!(isGetAll = arguments.length < 2)) {
          isSet = arguments.length > 2 || (isObj = isObject(name));
        }

        if (!isSet) {
          return search ? Search(search, name, value, isSet, isObj, isGetAll) : isGetAll ? {} : '';
        }

        var newSearch = '?' + Search(search, name, value, isSet, isObj); // http://www.zenjs.net/?asd=123#xxx

        if (search || url.indexOf('?') > -1) url = url.replace(rSearch, newSearch); // http://www.zenjs.net/#xxx
        else if (url.indexOf('#') > -1) url = url.replace('#', newSearch + '#'); // http://www.zenjs.net/
          else url = url + newSearch;
        return url;
      }
    };
  }
  /*
   * event.target : 触发事件的元素
   * event.originalTarget : 绑定事件的元素, 如果是委托代理, 则为代理的元素
   * event.delegateTarget : 绑定事件的元素
   * event.relatedTarget : 事件的相关节点, mouseover 时移出的节点, mouseout 时移入的节点
   *
   * event.preventDefault() : 阻止浏览器默认行为
   * event.stopPropagation() : 停止将事件冒泡到父节点
   * event.stopImmediatePropagation() : 停止将事件冒泡到父节点且停止当前元素后续事件执行
   */


  var Event = ZenJS$1.Event = function (src, props) {
    if (this instanceof Event === false) {
      return new ZenJS$1.Event(src, props);
    }

    if (src instanceof Event) {
      return src;
    } // Event object


    if (src && src.type) {
      this.originalEvent = src;
      this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
      this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

      for (var key in src) {
        if (!(key in this)) {
          this[key] = src[key];
        }
      }
    } // Event type
    else {
        this.type = src;
      }

    if (props) {
      assign$1(this, props);
    }

    this.timeStamp = src && src.timeStamp || Date.now();
  };

  var EventProto = Event.prototype = {
    constructor: Event
  };
  ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'].forEach(function (fn) {
    EventProto[fn] = function () {
      if (this.originalEvent) {
        this.originalEvent[fn]();
      }
    };
  });

  var addProp = Event.addProp = function (name, get) {
    defineProperty(EventProto, name, {
      enumerable: true,
      configurable: true,
      get: isFunction(get) ? function () {
        if (this.originalEvent) return get(this.originalEvent);
      } : function () {
        return this[name];
      },
      set: function (value) {
        this[name] = value;
      }
    });
  };

  var rkeyEvent = /^key/,
      rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
  addProp('which', function (event) {
    var button;

    if (event.which == null && rkeyEvent.test(event.type)) {
      return event.charCode != null ? event.charCode : event.keyCode;
    }

    if (!event.which && (button = event.button) !== undefined && rmouseEvent.test(event.type)) {
      if (button & 1) return 1;
      if (button & 2) return 3;
      if (button & 4) return 2;
      return 0;
    }

    return event.which;
  });
  addProp('wheelDelta', function (event, wheelDelta) {
    if (wheelDelta = event.wheelDelta) {
      return wheelDelta;
    } else if (wheelDelta = event.detail) {
      return wheelDelta > 0 ? -120 : 120;
    }
  });
  addProp('detail', function (event, detail) {
    if (detail = event.detail) {
      return detail;
    } else if (detail = event.wheelDelta) {
      return detail > 0 ? -3 : 3;
    }
  });

}));
