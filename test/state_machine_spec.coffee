require 'should'
Legs = require '../lib/legs'

describe 'Legs.StateMachine', ->

  it 'should be defined', ->
    Legs.StateMachine.should.be.ok

  describe 'class methods', ->

    describe 'state', ->
      class Foo extends Legs.StateMachine
        @state 'foo'
        @state 'bar'

      it 'should add states to the subclass', ->
        Foo.states( ).should.have.keys 'foo', 'bar'

      it 'should not add states to the superclass', ->
        Legs.StateMachine.states( ).should.not.have.keys 'foo', 'bar'

  describe 'instance methods', ->

    describe 'states', ->

      it 'should return the states object defined on the class', ->
        class Foo extends Legs.StateMachine
          @state 'foo'
          @state 'bar'

        new Foo( ).states( ).should.equal Foo.states( )

    describe 'state', ->

      it 'should throw an error if an undeclared state is requested', ->
        foo = new Legs.StateMachine

        ( -> foo.state 'bar' ).should.throw "LegsError: No state 'bar' declared for Legs.StateMachine"
