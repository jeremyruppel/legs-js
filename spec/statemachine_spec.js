(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  describe('Legs.StateMachine', function() {
    it('should be defined', function() {
      return expect(Legs.StateMachine).toBeDefined();
    });
    return describe('a subclass', function() {
      var TestStateMachine, condition;
      condition = true;
      TestStateMachine = (function() {
        __extends(TestStateMachine, Legs.StateMachine);
        function TestStateMachine() {
          TestStateMachine.__super__.constructor.apply(this, arguments);
        }
        TestStateMachine.state('foo');
        TestStateMachine.state('bar');
        TestStateMachine.state('baz');
        TestStateMachine.guard('baz', function() {
          return condition != null;
        });
        return TestStateMachine;
      })();
      beforeEach(function() {
        this.subject = new TestStateMachine;
        return console.log(this.subject);
      });
      return it('should know about its states', function() {
        expect(this.subject.states()).toBeDefined();
        return expect(this.subject.states().length).toEqual(3);
      });
    });
  });
}).call(this);
