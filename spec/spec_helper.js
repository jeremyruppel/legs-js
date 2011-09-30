(function() {
  beforeEach(function() {
    return this.addMatchers({
      toBeType: function(value) {
        return (typeof this.actual) === value;
      },
      toBeAnInstanceOf: function(clazz) {
        return this.actual instanceof clazz;
      }
    });
  });
}).call(this);
