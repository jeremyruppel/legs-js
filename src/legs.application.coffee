( ( Legs, $ ) ->

  class Legs.Application extends Legs.Class
    
    constructor : ( @selector='body', @block=@selector ) ->
      
    run : -> @block.call()

) Legs, jQuery
