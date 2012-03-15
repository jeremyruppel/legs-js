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

  state : ( name ) ->
    throw new Error "LegsError: No state '#{name}' declared for Legs.StateMachine" unless @states( )[ name ]?

  states : -> @constructor.states( )

exports.StateMachine = StateMachine
