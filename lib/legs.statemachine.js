(function() {
  Legs.StateMachine = (function() {
    function StateMachine() {}
    StateMachine.states = [];
    StateMachine.state = function(name) {
      return this.states.push(name);
    };
    StateMachine.guard = function(name) {};
    StateMachine.prototype.states = function() {
      return this.constructor.states;
    };
    return StateMachine;
  })();
}).call(this);
