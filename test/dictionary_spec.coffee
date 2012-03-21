should = require 'should'
Legs   = require '../lib/legs'

describe 'Legs.Dictionary', ->

  it 'should be defined', ->
    Legs.Dictionary.should.be.ok

  describe 'an instance', ->

    it 'should not share values with another instance', ->
      foo = new Legs.Dictionary
      bar = new Legs.Dictionary
      foo.set 'baz', 123
      should.not.exist bar.get 'baz'

  describe 'get', ->

    beforeEach -> @foo = new Legs.Dictionary

    it 'should return null if the key is not set', ->
      should.not.exist @foo.get( 'bar' )

    it 'should return the value if the key has been set', ->
      @foo.set 'bar', 'baz'
      @foo.get( 'bar' ).should.equal 'baz'

  describe 'set', ->

    beforeEach -> @foo = new Legs.Dictionary

    it 'should store the key value pair given', ->
      @foo.set 'bar', 'baz'
      @foo.get( 'bar' ).should.equal 'baz'

  describe 'has', ->

    beforeEach -> @foo = new Legs.Dictionary

    it 'should return true if the key has been set', ->
      @foo.set 'bar', 'baz'
      @foo.has( 'bar' ).should.be.true

    it 'should return false if the key has not been set', ->
      @foo.remove 'bar'
      @foo.has( 'bar' ).should.be.false

  describe 'remove', ->

    beforeEach -> @foo = new Legs.Dictionary

    it 'should remove a key that has been set', ->
      @foo.set 'bar', 'baz'
      @foo.remove 'bar'
      @foo.has( 'bar' ).should.be.false

    it 'should return the value for the key that was removed', ->
      @foo.set 'bar', 'baz'
      @foo.remove( 'bar' ).should.equal 'baz'