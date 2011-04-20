describe( 'Legs.Events', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Events ).toBeDefined( );
  } );
  
  it( 'should be a function', function( )
  {
    expect( Legs.Events ).toBeType( 'function' );
  } );
  
  it( 'should be able to be instantiated', function( )
  {
    expect( ( new Legs.Events( ) ) ).toBeType( 'object' );
  } );
  
  it( 'should be an instance of Legs.Class', function( )
  {
    expect( new Legs.Events( ) ).toBeAnInstanceOf( Legs.Class );
  } );
  
  describe( 'default events', function( )
  {
    it( 'should have the startup complete event defined', function( )
    {
      var events = new Legs.Events( );
      
      expect( events.STARTUP_COMPLETE ).toEqual( 'startup complete' );
    } );
  } );
  
  describe( 'instance methods', function( )
  {
    var events;
    
    beforeEach( function( )
    {
      events = new Legs.Events( );
    } );
    
    describe( 'bind', function( )
    {
      it( 'should be defined', function( )
      {
        expect( events.bind ).toBeType( 'function' );
      } );
      
      it( 'should map a callback to a given event type', function( )
      {
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        events.trigger( 'test' );
        
        expect( spy ).toHaveBeenCalled( );
      } );
    } );
    
    describe( 'unbind', function( )
    {
      it( 'should be defined', function( )
      {
        expect( events.unbind ).toBeType( 'function' );
      } );
      
      it( 'should unmap a callback from a given event type', function( )
      {
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        events.unbind( 'test', spy );
        
        events.trigger( 'test' );
        
        expect( spy ).not.toHaveBeenCalled( );
      } );
    } );
    
    describe( 'trigger', function( )
    {
      it( 'should be defined', function( )
      {
        expect( events.trigger ).toBeType( 'function' );
      } );
      
      it( 'should trigger a callback mapped to a given event type', function( )
      {
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        events.trigger( 'test' );
        
        expect( spy ).toHaveBeenCalled( );
      } );
      
      it( 'should not trigger callbacks not mapped to a given event type', function( )
      {
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        events.trigger( 'oops' );
        
        expect( spy ).not.toHaveBeenCalled( );
      } );
      
      it( 'should trigger all callbacks mapped to a given event type', function( )
      {
        var one = jasmine.createSpy( );
        var two = jasmine.createSpy( );
        
        events.bind( 'test', one );
        events.bind( 'test', two );
        
        events.trigger( 'test' );
        
        expect( one ).toHaveBeenCalled( );
        expect( two ).toHaveBeenCalled( );
      } );
      
      it( 'should pass all extra arguments to the callback', function( )
      {
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        events.trigger( 'test', 123, 'hello', false );
        
        expect( spy ).toHaveBeenCalledWith( 123, 'hello', false );
      } );
    } );
  } );
} );