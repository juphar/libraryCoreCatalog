var assert = require('chai').assert;

describe('example class', function(){
  describe('example test', function() {
    it('should call example\'s add method.', function() {
      assert.equal(2, require('../app/example.js').add(1, 1));
    });
  });
});
