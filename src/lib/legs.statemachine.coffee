
class Legs.StateMachine
  @states : [ ]
  @state : ( name ) ->
    @states.push name
  @guard : ( name ) ->
    
  states : ->
    @constructor.states