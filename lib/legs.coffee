Legs = { }

class Legs.Dictionary
  constructor : -> @store = { }

  get : ( key ) -> @store[ key ] || null

  set : ( key, value ) -> @store[ key ] = value

class Legs.EventEmitter

  constructor : -> @listeners = { }

  callbacks : ( event ) -> @listeners[ event ] ||= [ ]

  on : ( event, callback ) -> @callbacks( event ).push callback

  off : ( event, callback ) ->

    if callback?
      @callbacks( event ).splice @callbacks( event ).indexOf( callback ), 1
    else
      @off event, callback for callback in @callbacks event

  once : ( event, callback ) ->
    cb = =>
      callback( )
      @off event, cb
    @on event, cb

  emit : ( event ) -> callback( ) for callback in @callbacks( event )

class Legs.StateMachine

  states = { }

  ###*
   * Class Methods
  ###

  @state : ( name ) -> @states( )[ name ] = true

  @states : -> states[ @ ] ||= { }

  ###*
   * Instance Methods
  ###
  constructor : ->
    for state, value of @states( )
      @[ state ] = ( callback ) ->
        throw new Error "LegsError: No callback given to state transition '#{state}'" unless callback?
        callback( )

  states : -> @constructor.states( )

###*
 * export
###
module.exports = Legs
