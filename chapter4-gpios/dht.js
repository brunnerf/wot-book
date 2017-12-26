var sensorLib = require('node-dht-sensor');

// sensorLib.initialize(22, 12); //#A
var interval = setInterval(function () { //#B
  read();
}, 3000);

function read() {
  sensorLib.read(22,12, function (error, temperature, humidity) {
    if (!error) {
      console.log('Temperature: ' + temperature.toFixed(2) + 'C, ' + //#D
      'humidity: ' + humidity.toFixed(2) + '%');
    }
  }); //#C

};

process.on('SIGINT', function () {
  clearInterval(interval);
  console.log('Bye, bye!');
  process.exit();
});

//#A 22 is for DHT22/AM2302, 12 is the GPIO we connect to on the Pi
//#B create an interval to read the values every 2 seconds
//#C read the sensor values
//#D readout contains two values: temperature and humidity
