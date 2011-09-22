(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  (function(Legs, $) {
    return Legs.Application = (function() {
      __extends(Application, Legs.Class);
      function Application(selector, block) {
        this.selector = selector != null ? selector : 'body';
        this.block = block != null ? block : this.selector;
      }
      Application.prototype.run = function() {
        return this.block.call();
      };
      return Application;
    })();
  })(Legs, jQuery);
}).call(this);
