class StateMachine

  states = { }

  ###*
   * Class Methods
  ###

  @state : ( name ) -> @states( )[ name ] = true

  @states : -> states[ @ ] ||= { }

  ###*
   * Instance Methods
  ###

  state : ( name, callback ) ->
    throw new Error "LegsError: No state '#{name}' declared for Legs.StateMachine" unless @states( )[ name ]?
    throw new Error "LegsError: No callback given to state transition '#{name}'"   unless callback?
    callback( )

  states : -> @constructor.states( )

exports.StateMachine = StateMachine
