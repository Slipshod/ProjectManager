/// <reference path="underscore-min.js"/>
/*************************************************
--Ancestry FBI--
file: base.js
notes: Part of the Grapevine framework.
*************************************************/

/*************************/
/* fbi Namespace (start) */
/*************************/
if (!fbi) { var fbi = {}; }
fbi = (function (fbi) {
    ///<summary>Application root</summary>    
    fbi = _.extend(fbi, {
        isList: function (obj) {
            return _.isObject(obj) && ('isList' in obj);
        },
        bus: function () {
            var _on = {},
                _globals = [],
                _defaultName = '_event_',
                _defaultNamespace = '_default_';

            var once = function (action) {
                var hasRun = false;
                return function () {
                    if (!hasRun) {
                        hasRun = true;
                        action.apply(this, arguments);
                    }
                };
            };

            /*
            * Adds event's function with specified name within specified namespace;
            * If namespace isn't specified then default one will be used.
            */
            var add = function (name, namespace, fn) {
                if (!name) {
                    name = _defaultName;
                }
                if (!namespace) {
                    namespace = _defaultNamespace;
                }
                if (!(name in _on)) {
                    _on[name] = {};
                }
                if (!(namespace in _on[name])) {
                    _on[name][namespace] = [];
                }
                _on[name][namespace].push(fn);
            };

            /*
            * Removes event's function by specified name within specified namespace;
            * If name isn't specified then all events within specified namespace will be wiped out;
            * If namespace isn't specified then all events with specified name will be removed.
            */
            var remove = function (name, namespace) {
                if (!name && !namespace) {
                    return null;
                }

                /* name w/o namespace -> rmove all functions inside of such event */
                if (name && !namespace) {
                    if (name in _on) {
                        delete _on[name];
                    }
                }
                /* namespace w/o event -> remove all functions inside of all events with such namespace */
                else if (!name && namespace) {
                    _.each(_on, function (namespaces, evt) {
                        if (namespace in namespaces) {
                            delete namespaces[namespace];
                        }
                    });
                }
                /* name and namespace are specified -> remove all functions inside of event within namespace */
                else {
                    if (name in _on) {
                        if (namespace in _on[name]) {
                            delete _on[name][namespace];
                        }
                    }
                }
            };

            var get = function (name, namespace) {
                if (!name && !namespace) {
                    return null;
                }

                var result = [];
                /* name w/o namespace -> return all functions inside of such event */
                if (name && !namespace) {
                    if (name in _on) {
                        _.each(_on[name], function (events, ns) {
                            result = result.concat(events);
                        });
                    }
                }
                /* namespace w/o event -> return all functions inside of all events with such namespace */
                else if (!name && namespace) {
                    _.each(_on, function (namespaces, evt) {
                        _.each(namespaces, function (events, ns) {
                            if (ns === namespace) {
                                result = result.concat(events);
                            }
                        });
                    });
                }
                /* name and namespace are specified -> return all functions inside of event within namespace */
                else {
                    if (name in _on) {
                        _.each(_on[name], function (events, ns) {
                            if (ns === namespace) {
                                result = result.concat(events);
                            }
                        });
                    }
                }
                return result;
            };

            var when = function (fn) {
                return function (condition) {
                    var predicate = condition;
                    if (_.isFunction(condition)) { predicate = condition(); }
                    return predicate ? fn : function () { };
                };
            };

            var correctEventObj = function (event) {
                if (typeof event === 'string') {
                    event = {
                        name: event,
                        namespace: null
                    };
                } else if (typeof event === 'object') {
                    if (!('name' in event)) {
                        event['name'] = null;
                    }
                    if (!('namespace' in event)) {
                        event['namespace'] = null;
                    }
                }
                return event;
            };

            var bus = {
                /*
                * You can use old way: pass name of event as a string;
                * or new way: pass object that contains name of event and its namespace: {name:'', namespace:''}.
                */

                on: function (event, fn) {
                    event = correctEventObj(event);
                    add(event.name, event.namespace, fn);
                },
                off: function (event) {
                    event = correctEventObj(event);
                    remove(event.name, event.namespace);
                },
                once: function (event, fn) {
                    bus.on(event, once(fn));
                },
                global: function (fn) {
                    _globals.push(fn);
                },
                emit: function (event) {
                    var args = Array.prototype.slice.call(arguments);
                    /* execute global events (namespace isn't used) */
                    _.each(_globals, function (fn) {
                        fn.apply(this, args);
                    });

                    /* execute on/once events (namespace is used) */
                    event = correctEventObj(event);
                    args.shift();
                    var eventsToFire = get(event.name, event.namespace);
                    var eventsToFireLength = eventsToFire.length;
                    if (eventsToFire && eventsToFireLength > 0) {
                        _.each(eventsToFire, function (fn, index) {
                            fn.apply(this, args);
                        });
                    }
                },
                reset: function () {
                    _on = {};
                    _globals = [];
                }
            };
            bus.once.when = when(bus.once);
            bus.on.when = when(bus.on);
            return bus;
        },
        list: function (arr) {

            if (arr && (!_.isArray(arr) || ("isList" in arr))) {
                throw ('Invalid argument, list expects an array.');
            }

            var data = ((arr && ("isList" in arr)) ? arr.toArray() : arr) || [];
            var pub = {
                toString: function () {
                    return "list";
                },
                toArray: function () {
                    /// <summary>Returns the underlying array.</summary>
                    return data;
                },
                isEmpty: function () {
                    /// <summary>Returns true if the lenght of the array is zero.</summary>
                    return data.length === 0;
                },
                each: function (fn) {
                    /// <summary>A function that utilizes the fbi.each method to iterate on the internal array.</summary>
                    _.each(data, fn);
                    return pub;
                },
                first: function (fn) {
                    /// <summary>Returns the first element in the list or if defined the first element found to have a truthful value via the supplied function argument, 
                    //           returns null otherwise.
                    ///</summary>
                    return (fn ? _.find(data, fn) : (data.length > 0 ? data[0] : null)) || null;
                },
                filter: function (fn) {
                    /// <summary>Filters using the supplied function and returns a new list with the results.</summary>
                    var results = _.filter(data, fn);
                    return fbi.list(results);
                },
                last: function (fn) {
                    /// <summary>Returns the last element in the list or the first element found iterating from the back of the list forward by the supplied function.</summary>
                    var tmp = data.slice();
                    tmp.reverse();
                    return (fn ? _.find(tmp, fn) : (tmp.length > 0 ? tmp[0] : null)) || null;
                },
                map: function (fn) {
                    /// <summary>Iterates on the list and evaluates the supplied function.  If the function is null/undefined it will return an empty list.</summary>
                    //                    var results = [];
                    return fbi.list(_.map(data, fn));
                },
                add: function (item) {
                    /// <summary>Adds an item to the list if one is supplied.</summary>
                    if (arguments.length > 0) {
                        data.push(item);
                    }
                    return pub;
                },
                addRange: function (items) {
                    /// <summary>Adds a range of elements to the list if the range is a list of elements otherwise calls add instead and treats the item as a single value.</summary>
                    items = fbi.isList(items) ? items.toArray() : items;
                    if (_.isArray(items)) {
                        var itemsLength = items.length;
                        for (var i = 0; i < itemsLength; i++) {
                            data.push(items[i]);
                        }
                    } else {
                        pub.add(items);
                    }
                    return pub;
                },
                at: function (index, item) {
                    /// <summary>Returns the element at the specified index.  If an additional parameter is supplied the item will be added at the specified index and the list is return to provide a fluent interface for chaining considerations.</summary>
                    if (item) {
                        if (index < data.length && index >= 0) {
                            data[index] = item;
                        }
                        return pub;
                    }
                    if (index < data.length && index >= 0) {
                        return data[index];
                    }
                    return null;
                },
                any: function (fn) {
                    ///<summary>Determines whether at least one element is truthy (boolean-equivalent to true), either directly or through computation by the provided iterator.</summary>
                    if (_.isFunction(fn)) {

                        return _.any(data, fn);
                    }
                    else {
                        return true;
                    }
                },
                reject: function (fn) {
                    /// <summary>Returns all the elements for which the iterator returns a falsy value. For the opposite operation, see Object#findAll.</summary>
                    return _.reject(data, fn);
                },
                indexOf: function (item) {
                    return _.indexOf(data, item);
                },
                all: function (fn) {
                    /// <summary>Determines whether all the elements are "truthy" (boolean-equivalent to true), either directly or through computation by the provided iterator. Stops on the first falsy element found.</summary>
                    var evaluator = (typeof fn === 'function') ? fn : function (v) { return v === fn; };
                    for (var i = 0; i < data.length; i++) {
                        if (!evaluator(data[i])) {
                            return false;
                        }
                    }
                    return true;
                },
                count: function (fn) {
                    if (fn && typeof fn === 'function') {
                        var ct = 0;
                        fbi.each(data, function (v) {
                            if (fn(v)) {
                                ct += 1;
                            }
                        });
                        return ct;
                    }
                    else {
                        return data.length;
                    }
                },
                remove: function (item) {
                    var index = _.indexOf(data, item);
                    if (index >= 0) {
                        var reminant = data.splice(index, 1);
                        reminant.shift();
                        data.push.apply(data, reminant);
                    }
                    return pub;
                },
                insert: function (index, item) {
                    index = Number(index);
                    if (index < 0) {
                        throw "Index cannot be less than zero in a list insertion.";
                    }
                    else if (index >= data.length) {
                        data.push(item);
                    }
                    else {
                        var tmp = [];
                        _.each(data, function (v, idx) {
                            if (index === idx) {
                                tmp.push(item);
                            }
                            tmp.push(v);
                        });
                        data = tmp;
                    }
                    return pub;
                },
                sort: function (comparison) {
                    if (_.isFunction(comparison)) {
                        data.sort(comparison);
                    }
                    else {
                        data.sort();
                    }
                },
                difference: function (exceptionItems) {
                    /// <summary>Returns a list of items that do not include the items supplied.</summary>
                    /// <remarks>This method requires the toString to be overriden to create a state of comparison otherwise all objects will be equal.</remarks>
                    if (!_.isArray(exceptionItems) && !fbi.isList(exceptionItems)) {
                        throw 'difference requires that the supplied argument be a list or array.';
                    }

                    var result = _.difference(data, fbi.isList(exceptionItems) ? exceptionItems.toArray() : exceptionItems);
                    return fbi.list(result);
                },
                min: function (fn) {
                    return _.min(data, fn);
                },
                max: function (fn) {
                    return _.max(data, fn);
                },
                clear: function () {
                    while (data.length > 0) {
                        data.pop();
                    }
                    return pub;
                },
                aggregate: function () {
                    if (pub.isEmpty()) { return null; }

                    var fn, seed;
                    if (arguments.length == 1) { fn = arguments[0]; }
                    else if (arguments.length == 2) { seed = arguments[0], fn = arguments[1]; }

                    var current = seed || null;
                    var i = seed ? 0 : 1;
                    for (; i < data.length; i++) {
                        if (fn) {
                            current = fn(current || data[0], data[i]);
                        }
                    }
                    return current;
                },
                isList: true
            };
            return pub;
        },
        uniqueList: function (arr) {
            var data,
                keys = {},
                pub = _.defaults({
                    keys: function () {
                        return _.defaults({}, keys);
                    },
                    add: function (item) {
                        if (arguments.length > 0 && item) {
                            if (!(item in keys)) {
                                data.push(item);
                                keys[item] = data.length - 1;
                            }
                        }
                        return pub;
                    },
                    addRange: function (items) {
                        if (_.isArray(items)) {
                            _.each(items, pub.add);
                        }
                        else if (fbi.isList(items)) {
                            _.each(items.toArray(), pub.add);
                        }
                        return pub;
                    },
                    insert: function (index, item) {
                        if (index < 0) {
                            throw "Index cannot be less than zero in a list insertion.";
                        }
                        else if (index >= data.length) {
                            data.push(item);
                        } else {
                            var reminant = data.splice(index, 1);
                            data.push(item);
                            data.push.apply(data, reminant);
                        }
                        //-- reorder the indexes
                        _.each(data, function (v, i) {
                            keys[v] = i;
                        });
                        return pub;
                    },
                    remove: function (item) {
                        if (item in keys) {
                            var index = _.indexOf(data, item);
                            var reminant = data.splice(index, 1);
                            reminant.shift();
                            data.push.apply(data, reminant);
                            delete keys[item];

                            //-- reorder the indexes
                            _.each(data, function (v, i) {
                                keys[v] = i;
                            });
                        }
                        return pub;
                    },
                    sort: function (comparison) {
                        if (_.isFunction(comparison)) {
                            data.sort(comparison);
                        }
                        else {
                            data.sort();
                        }
                        //-- reorder the indexes
                        _.each(data, function (v, i) {
                            keys[v] = i;
                        });
                    },
                    has: function (item) {
                        return item in keys;
                    }
                }, fbi.list());
            data = pub.toArray();
            pub.addRange(arr);
            return pub;
        },
        waitFor: function (testFx, then, onTimeout, timeout) {
            timeout = timeout ? timeout : 5000;
            if (!_.isFunction(testFx)) {
                return; // waitFor() needs a test function
            }
            if (then && !_.isFunction(then)) {
                return; // waitFor() next step definition must be a function
            }
            //var pendingWait = true;
            var start = new Date().getTime();
            var condition = false;
            var interval = setInterval(function (testFx, then, timeout, onTimeout) {
                if ((new Date().getTime() - start < timeout) && !condition) {
                    condition = testFx();
                } else {
                    //pendingWait = false;
                    if (!condition) {
                        // waitFor() timeout
                        if (_.isFunction(onTimeout)) {
                            onTimeout();
                        }
                    } else {
                        //waitFor() finished in %dms.", new Date().getTime() - start)
                        if (then) {
                            then();
                        }
                    }
                    clearInterval(interval);
                }
            }, 100, testFx, then, timeout, onTimeout);
        }
    });
    fbi.bus = fbi.bus();
    return fbi;
})(fbi);
/*************************/
/* fbi Namespace  (end)  */
/*************************/

/*************************/
/* JS extensions (begin) */
/*************************/
if (typeof Object.create !== 'function') {
    ///<summary>Method to create objects simply without directly needing the new operator.</summary>
    Object.create = function (o) {
        var F = function () { };
        F.prototype = o;
        return new F();
    };
}

// -- Patch for IE7/IE8, copied from Mozilla.org
//if (!('indexOf' in Array.prototype) && !Array.prototype.indexOf) {
//    Array.prototype.indexOf = function(searchElement /*, fromIndex */) {
//        "use strict";
//        if (this == null) {
//            throw new TypeError();
//        }
//        var t = Object(this);
//        var len = t.length >>> 0;
//        if (len === 0) {
//            return -1;
//        }
//        var n = 0;
//        if (arguments.length > 0) {
//            n = Number(arguments[1]);
//            if (n != n) { // shortcut for verifying if it's NaN  
//                n = 0;
//            } else if (n != 0 && n != Infinity && n != -Infinity) {
//                n = (n > 0 || -1) * Math.floor(Math.abs(n));
//            }
//        }
//        if (n >= len) {
//            return -1;
//        }
//        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
//        for (; k < len; k++) {
//            if (k in t && t[k] === searchElement) {
//                return k;
//            }
//        }
//        return -1;
//    };
//}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

if (!String.prototype.clear) {
    String.prototype.clear = function () {
        return this.replace(/[^a-zA-Z 0-9]+/g, '');
    };
}

if (!String.prototype.clearAndTrim) {
    String.prototype.clearAndTrim = function () {
        return this.clear().trim();
    };
}

function compare(obj1, obj2) {
    for (var name in obj2) {
        if (obj2.hasOwnProperty(name)) {
            if (!(name in obj1) || (obj1[name] !== obj2[name])) {
                return false;
            }  
        } 
    }
    return true;
};

var leafy = (function () {
    /// <summary>Object framework for safely navigating an object literal.  This will do the work of determing if a property or chain of properties is undefined or null.</summary>
    var list = fbi.list;
    var leafy = function (obj, predicate) {
        return new leafy.fn.init(obj, predicate);
    },
        root, attribute_regex = /(\w+)(=|\^=|\?=|$=)('|")([^"\\]*(\\.[^"\\]*)*)('|")/gi,
        part_regex = /\w+(?=\[)/gi,
        navigate = function (obj, predicate) {
            if (obj && predicate) {
                var parts = predicate.split(/\./);
                for (var i = 0; i < parts.length; ++i) {
                    var part = parts[i];
                    var attrib = null;
                    if (part && part.match(attribute_regex)) {
                        attrib = part.match(attribute_regex);
                        part = part.match(part_regex) || '';
                    }

                    obj = obj && obj[part] ? obj[part] : null;
                    if (obj && (_.isArray(obj) || fbi.isList(obj)) && attrib) {
                        var predicateExpr = /(\w+)(=|^=)"([^"]*)"/;
                        var tmpAttribParts = predicateExpr.exec(attrib);
                        tmpAttribParts.shift();
                        var attribParts = list(tmpAttribParts).filter(function (v) {
                            return v && v !== '';
                        });
                        if (attribParts.count() === 3) {
                            var name = attribParts.at(0),
                                compareValue = attribParts.at(2),
                                useThis = name.toLowerCase() === 'this';
                            if (fbi.isList(obj)) {
                                obj = obj.filter(function (v) {
                                    return useThis ? v == compareValue : v[name] == compareValue;
                                });
                            }
                            else {
                                obj = list(obj).filter(function (v) {
                                    return useThis ? v == compareValue : v[name] == compareValue;
                                }).toArray();
                            }
                        }
                        else throw 'Malformed array filter expression';
                    }
                    if (!obj) break;
                }
            }
            return obj;
        };

    leafy.fn = leafy.prototype = {
        constructor: leafy,
        init: function (_root, predicate) {
            root = navigate(_root, predicate);
        },
        select: function (predicate) {
            if (typeof predicate === 'function' && root) {
                return new leafy.fn.init(predicate(root));
            }
            else if (root && predicate) {
                root = navigate(root, predicate);
                return new leafy.fn.init(root);
            }
            else {
                return new leafy.fn.init(null);
            }
        },
        prop: function (name, value) {
            if (root) {
                root[name] = value;
            }
            return new leafy.fn.init(root);
        },
        val: function (defaultValue) {
            return (root || defaultValue) || null;
        },
        asList: function (defaultList) {
            var result = list((root || defaultList) || null);
            if (result.isEmpty()) {
                result.addRange(defaultList);
            }
            return result;
        }
    };

    leafy.fn.init.prototype = leafy.fn;

    return leafy;
})();
/*************************/
/* JS extensions (end) */
/*************************/