var resources = require('./../../resources/model');

var actuator1, actuator2, interval;
var model = resources.pi.actuators.leds;
var localParams = {'simulate': false, 'frequency': 2000};


exports.start = function (params) {
  localParams = params;  

  if (localParams.simulate) {
      simulate();
  } else {
    connectHardware();
  }
  observe(model['1'], actuator1); //#A
  observe(model['2'], actuator2); //#A
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
            console.info('Change detected by plugin for %s...', what.name);
            value = what.value;
            switchOnOff(value, actuator, what.name);
        }
    }, 100)

/*  Object.observe(what, function (changes) {
    console.info('Change detected by plugin for %s...', pluginName);
    switchOnOff(model.value); //#B
  }); */
};

function switchOnOff(value, actuator, name) {
  if (!localParams.simulate) {
      actuator.write(value === true ? 1 : 0, function () { //#C
      console.info('Changed value of %s to %s', name, value);
    });
  }
};

function connectHardware() {
  var Gpio = require('onoff').Gpio;
  actuator1 = new Gpio(model['1'].gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', model['1'].name);
  actuator2 = new Gpio(model['2'].gpio, 'out'); //#D
  console.info('Hardware %s actuator started!', model['2'].name);
};

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

