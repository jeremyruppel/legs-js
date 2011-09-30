
( ( $ ) ->
  
  Legs = @Legs = VERSION : "0.0.2"

  class Legs.Class
    @include : ( concern ) ->
      $.extend @, concern.classMethods
      $.extend @prototype, concern.instanceMethods
      concern.advise @
      
      
  class Legs.Concern
    @included : ( @block ) ->
    @advise : ( subject ) ->
      @block.call subject if @block?

) jQuery
    