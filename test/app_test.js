// Units test examples

var assert  = require('chai').assert;
var request = require('supertest');



describe('Template Test', function(){
	var server;

	before(function() {
		server = require('../app/app')();
	});


	after(function(done) {
		server.close(done);
	});


	it('should go through error handling code and return 404 when an API does not exist', function(done) {
		request(server)
		.get('/api/v1/foo/bar/baz')
		.expect(404)
		.end(function(err, res) {
			if (err) {
				assert.equal(true, false);
			}
			// Check the response JSON to see if I set code there as well
			assert.equal(404, res.body.code);
			done();
		});
	});


	it('The health check should always return 200. You will want to change this for your app.', function(done) {
	request(server)
	.get('/api/v1/admin/health')
	.expect(200)
	.end(function(err, res) {
			if (err) {
				assert.equal(true, false);
			}
			// Check the response JSON to see if I set code there as well
			assert.equal(200, res.body.code);
			done();
		});
	});

});
