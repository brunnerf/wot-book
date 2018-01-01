var resources = require('./../../resources/model');

var actuator1, actuator2, interval;
var model = resources.pi.actuators.leds;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};


exports.start = function (params) {
  localParams = params;  
  observe(model['1'], actuator1); //#A
  observe(model['2'], actuator2); //#A

  if (localParams.simulate) {
      simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  clearInterval(observePoll);
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
      actuator1.unexport();
      actuator2.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};

function observe(what, actuator) {
    var value = what.value;
    observePoll = setInterval(function () {
        if (value != what.value) {
            console.info('Change detected by plugin for %s...', pluginName);
            value = what.value;
            switchOnOff(value, actuator);
        }
    }, 100)

/*  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName);
    switchOnOff(model.value); //#B
  }); */
};

function switchOnOff(value, actuator) {
  if (!localParams.simulate) {
      actuator.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s on %s', pluginName, value, actuator.name);
    });
  }
};

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  actuator1 = new Gpio(model['1'].gpio, 'out'); //#D
  console.info('Hardware %s actuator1 started!', pluginName);
  actuator2 = new Gpio(model['2'].gpio, 'out'); //#D
  console.info('Hardware %s actuator1 started!', pluginName);};

function simulate() {
  interval = setInterval(function () {
    // Switch value on a regular basis
      if (model['1'].value) {
          model['1'].value = false;
    } else {
          model['1'].value = true;
    }
  }, localParams.frequency);
  console.info('Simulated %s actuator started!', pluginName);
};

//#A Observe the model for the LEDs
//#B Listen for model changes, on changes call switchOnOff
//#C Change the LED state by changing the GPIO state
//#D Connect the GPIO in write (output) mode

