var observer = require('./../utils/observer.js');
var resources = require('./../resources/model');


exports.addDevice = function(id, name, description, sensors, actuators) {
  if(!resources.things) {
    resources.things = {};
  }
  resources.things[id] = observer.makeObservable({'name' : name,
    'description' : description,
    'sensors' : sensors,
    'actuators' : actuators
  });
};

exports.randomInt = function(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
};

exports.transform2Array = function (resObj) {
    var resAr = [];
    function transform2ArrayInternal(resObj) {
        if (resObj.hasOwnProperty("name") && resObj.hasOwnProperty("value")) {
            resAr.push(resObj);
        } else {
            var objAr = Object.values(resObj);
            for (var i = 0; i < objAr.length; i++) {
                transform2ArrayInternal(objAr[i])
            }
        }
        return resAr;
    }
    return transform2ArrayInternal(resObj);
}
