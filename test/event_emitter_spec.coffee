require 'should'
Legs  = require '../lib/legs'
{Spy} = require './support/spy'

describe 'Legs.EventEmitter', ->

  it 'should be defined', ->
    Legs.EventEmitter.should.be.ok

  foo = null

  beforeEach -> foo = new Legs.EventEmitter

  describe 'on', ->

    it 'should attach a listener for an event', ( done ) ->
      foo.on 'bar', done
      foo.emit 'bar'

  describe 'off', ->

    it 'should remove a listener for an event if specified', ->
      spy = new Spy( )

      foo.on 'bar', spy.fn
      foo.emit 'bar'
      foo.off 'bar', spy.fn
      foo.emit 'bar'

      spy.tally.should.equal 1

    it 'should remove all listeners for an event if no callback is specified', ->
      foo.on 'bar', ->
      foo.on 'bar', ->

      foo.callbacks( 'bar' ).length.should.equal 2

      foo.off 'bar'

      foo.callbacks( 'bar' ).should.be.empty

  describe 'once', ->

    it 'should attach a listener but remove it once called', ->
      spy = new Spy( )

      foo.once 'bar', spy.fn

      foo.emit 'bar'
      foo.emit 'bar'
      foo.emit 'bar'

      spy.tally.should.equal 1

  describe 'emit', ->

    it 'should trigger a listener for an event', ( done ) ->
      foo.on 'bar', done
      foo.emit 'bar'

    it 'should trigger multiple listeners for the same event', ( done ) ->
      spy = new Spy( ).expect 2, done

      foo.on 'bar', spy.fn
      foo.on 'bar', spy.fn

      foo.emit 'bar'
