(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  describe('Legs', function() {
    it('should be defined', function() {
      return expect(Legs).toBeDefined();
    });
    return describe('VERSION', function() {
      it('should be defined', function() {
        return expect(Legs.VERSION).toBeDefined();
      });
      return it('should look like a version number', function() {
        return expect(Legs.VERSION).toMatch(/^\d+\.\d+\.\d+$/);
      });
    });
  });
  describe('Legs.Class', function() {
    it('should be defined', function() {
      return expect(Legs.Class).toBeDefined();
    });
    describe('include', function() {
      var TestClass;
      TestClass = (function() {
        __extends(TestClass, Legs.Class);
        function TestClass() {
          TestClass.__super__.constructor.apply(this, arguments);
        }
        return TestClass;
      })();
      it('should be defined', function() {
        return expect(Legs.Class.include).toBeType('function');
      });
      return it('should be defined on a subclass', function() {
        return expect(TestClass.include).toBeType('function');
      });
    });
    describe('class methods', function() {
      var TestClass, TestConcern;
      TestConcern = (function() {
        __extends(TestConcern, Legs.Concern);
        function TestConcern() {
          TestConcern.__super__.constructor.apply(this, arguments);
        }
        TestConcern.classMethods = {
          sum: function(a, b) {
            return a + b;
          }
        };
        return TestConcern;
      })();
      TestClass = (function() {
        __extends(TestClass, Legs.Class);
        function TestClass() {
          TestClass.__super__.constructor.apply(this, arguments);
        }
        TestClass.include(TestConcern);
        return TestClass;
      })();
      return it('should mix-in class methods from a concern', function() {
        expect(TestClass.sum).toBeType('function');
        return expect(TestClass.sum(1, 2)).toEqual(3);
      });
    });
    return describe('instance methods', function() {
      var TestClass, TestConcern;
      TestConcern = (function() {
        __extends(TestConcern, Legs.Concern);
        function TestConcern() {
          TestConcern.__super__.constructor.apply(this, arguments);
        }
        TestConcern.instanceMethods = {
          sum: function(a, b) {
            return a + b;
          }
        };
        return TestConcern;
      })();
      TestClass = (function() {
        __extends(TestClass, Legs.Class);
        function TestClass() {
          TestClass.__super__.constructor.apply(this, arguments);
        }
        TestClass.include(TestConcern);
        return TestClass;
      })();
      return it('should mix-in instance methods from a concern', function() {
        var subject;
        subject = window.subject = new TestClass;
        expect(subject.sum).toBeType('function');
        return expect(subject.sum(1, 2)).toEqual(3);
      });
    });
  });
  describe('Legs.Concern', function() {
    it('should be defined', function() {
      return expect(Legs.Concern).toBeDefined();
    });
    return describe('included', function() {
      it('should be defined', function() {
        return expect(Legs.Concern.included).toBeType('function');
      });
      return it('should get called when mixed-in to a class', function() {
        var TestClass, TestConcern, spy;
        spy = jasmine.createSpy();
        TestConcern = (function() {
          __extends(TestConcern, Legs.Concern);
          function TestConcern() {
            TestConcern.__super__.constructor.apply(this, arguments);
          }
          TestConcern.included(spy);
          return TestConcern;
        })();
        expect(spy).not.toHaveBeenCalled();
        TestClass = (function() {
          __extends(TestClass, Legs.Class);
          function TestClass() {
            TestClass.__super__.constructor.apply(this, arguments);
          }
          TestClass.include(TestConcern);
          return TestClass;
        })();
        expect(spy).toHaveBeenCalled();
        return expect(spy.mostRecentCall.object).toEqual(TestClass);
      });
    });
  });
}).call(this);
