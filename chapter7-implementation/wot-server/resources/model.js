var resources = require('./resources.json');
var observer = require('./../utils/observer.js');


var observableResource = observer.makeObservable(resources);


module.exports = observableResource;
