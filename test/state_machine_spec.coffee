require 'should'
Legs = require '../lib/legs'

describe 'Legs.StateMachine', ->

  it 'should be defined', ->
    Legs.StateMachine.should.be.ok

  class Foo extends Legs.StateMachine
    @state 'foo'
    @state 'bar'

  describe 'class methods', ->

    describe 'state', ->

      it 'should add states to the subclass', ->
        Foo.states( ).should.have.keys 'foo', 'bar'

      it 'should not add states to the superclass', ->
        Legs.StateMachine.states( ).should.not.have.keys 'foo', 'bar'

  describe 'instance methods', ->

    describe 'states', ->

      it 'should return the states object defined on the class', ->
        new Foo( ).states( ).should.equal Foo.states( )

    describe 'state', ->

      foo = new Foo

      it 'should throw an error if the state is undeclared', ->
        ( -> foo.state 'baz' ).should.throw "LegsError: No state 'baz' declared for Legs.StateMachine"

      it 'should throw an error if no callback is given', ->
        ( -> foo.state 'bar' ).should.throw "LegsError: No callback given to state transition 'bar'"

      it 'should call the callback if given', ( done ) ->
        foo.state 'bar', done
