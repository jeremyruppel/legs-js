require 'should'
Legs = require '../lib/legs'

describe 'Legs.StateMachine', ->

  it 'should be defined', ->
    Legs.StateMachine.should.be.ok

  class Foo extends Legs.StateMachine
    @state 'foo', true
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

    describe 'initial state', ->

      it 'can be defined on the class', ->
        class Foo extends Legs.StateMachine
          @state 'foo', true
          @state 'bar'

        new Foo( ).state.should.equal 'foo'

      it 'can be inspected on the class', ->
        class Foo extends Legs.StateMachine
          @state 'foo', true
          @state 'bar'

        Foo.initial( ).should.equal 'foo'

      it 'can be inspected on the instance', ->
        class Foo extends Legs.StateMachine
          @state 'foo', true
          @state 'bar'

        new Foo( ).initial( ).should.equal 'foo'

      it 'can be passed to the constructor', ->
        class Foo extends Legs.StateMachine
          @state 'foo'
          @state 'bar'

        new Foo( 'bar' ).state.should.equal 'bar'

      it 'should prefer the constructor', ->
        class Foo extends Legs.StateMachine
          @state 'foo', true
          @state 'bar'

        new Foo( 'bar' ).state.should.equal 'bar'

      it 'should throw an error if not declared or passed', ->
        class Foo extends Legs.StateMachine
          @state 'foo'
          @state 'bar'

        ( -> new Foo ).should.throw "LegsError: No initial state provided for Legs.StateMachine"

      it 'should throw an error if more than one', ->
        ( ->
          class Foo extends Legs.StateMachine
            @state 'foo', true
            @state 'bar', true
        ).should.throw "LegsError: More than one initial state declared for Legs.StateMachine"

      it 'should throw an error if an undeclared state is passed', ->
        class Foo extends Legs.StateMachine
          @state 'foo'
          @state 'bar'

        ( -> new Foo 'baz' ).should.throw "LegsError: No state 'baz' declared for Legs.StateMachine"

    describe 'state', ->

      foo = new Foo

      it 'should have a method declared for each state', ->
        foo.foo.should.be.ok
        foo.bar.should.be.ok

      it 'should throw an error if no callback is given', ->
        ( -> foo.bar( ) ).should.throw "LegsError: No callback given to state transition 'bar'"

      it 'should call the callback if given', ( done ) ->
        foo.bar done
