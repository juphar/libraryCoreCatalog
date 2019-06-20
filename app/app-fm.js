const forever = require('forever-monitor');

const logger = require('./logging/logger').getLogger(__filename);

var start = function(){

	logger.info('Application start');

	var t1 = (new Date()).getTime();

	var child = new (forever.Monitor)('app.js', {
		max: 5,
		silent: false,
		args: []
	});

	child.on('exit', function() {

		logger.warning('Application exit');		
		
		var t2 = (new Date()).getTime();
		
		// Only exiting for good if restarts happened within 5 second interval
		if( ( t2 - t1 ) > 5000 ) {
		
			logger.warning('Application restart');	
			start();
			
		} else {
			
			logger.error('Application exited after 5 restarts within 5 seconds');

		}
		
	});
	
	child.start();

}

start();
