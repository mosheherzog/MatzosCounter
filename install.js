var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object
var svc = new Service({
	name:'Matzah Counter',
	description: 'Count records for Matzah Bakery',
	script: path.join(__dirname, 'bin/www')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
	svc.start();
	console.log("Service installed and started successfully. SDB")
});

svc.install();
