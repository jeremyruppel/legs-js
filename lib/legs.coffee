Legs = { }

class Legs.Dictionary
  constructor : -> @store = [ ]

  get : ( key ) ->
    for obj in @store
      return obj.value if obj.key is key
    return null

  set : ( key, value ) ->
    for obj in @store
      if obj.key is key
        return obj.value = value
    @store.push key : key, value : value
    return value

  has : ( key ) -> @get( key ) isnt null

  remove : ( key ) ->
    for obj, i in @store
      if obj.key is key
        @store.splice i, 1
        return obj.value

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

  states = new Legs.Dictionary

  ###*
   * Class Methods
  ###

  @state : ( name ) -> @states( )[ name ] = true

  @states : -> if states.has @ then states.get @ else states.set @, { }

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
