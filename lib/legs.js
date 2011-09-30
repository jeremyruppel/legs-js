(function() {
  (function($) {
    var Legs;
    Legs = this.Legs = {
      VERSION: "0.0.2"
    };
    Legs.Class = (function() {
      function Class() {}
      Class.include = function(concern) {
        $.extend(this, concern.classMethods);
        $.extend(this.prototype, concern.instanceMethods);
        return concern.advise(this);
      };
      return Class;
    })();
    return Legs.Concern = (function() {
      function Concern() {}
      Concern.included = function(block) {
        this.block = block;
      };
      Concern.advise = function(subject) {
        if (this.block != null) {
          return this.block.call(subject);
        }
      };
      return Concern;
    })();
  })(jQuery);
}).call(this);
