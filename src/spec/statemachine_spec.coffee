describe 'Legs.StateMachine', ->
  
  it 'should be defined', ->
    expect( Legs.StateMachine ).toBeDefined( )
  
  describe 'a subclass', ->
    
    condition = true
    
    class TestStateMachine extends Legs.StateMachine
      @state 'foo'
      @state 'bar'
      @state 'baz'
      @guard 'baz', -> condition?
    
    beforeEach ->
      @subject = new TestStateMachine
      
      console.log @subject
    
    it 'should know about its states', ->
      expect( @subject.states( ) ).toBeDefined( )
      expect( @subject.states( ).length ).toEqual( 3 );
  