var observerUtil =  require("@nx-js/observer-util");

exports.makeObservable = function makeObservable(obj) {
    var copy;

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = makeObservable(obj[attr]);
        }
        return observerUtil.observable(copy);
    } else {
        return obj;
    }

};
