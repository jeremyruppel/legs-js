describe( 'Legs.Command', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Command ).toBeDefined( );
  } );
  
  it( 'should be a function', function( )
  {
    expect( Legs.Command ).toBeType( 'function' );
  } );
  
  it( 'should be able to be instantiated', function( )
  {
    expect( ( new Legs.Command( ) ) ).toBeType( 'object' );
  } );
  
  it( 'should be an instance of Legs.Class', function( )
  {
    expect( new Legs.Command( ) ).toBeAnInstanceOf( Legs.Class );
  } );
  
  describe( 'instance methods', function( )
  {
    var command;
    
    beforeEach( function( )
    {
      command = new Legs.Command( );
    } );
    
    describe( 'execute', function( )
    {
      it( 'should be defined', function( )
      {
        expect( command.execute ).toBeType( 'function' );
      } );
    } );
    
    describe( 'trigger', function( )
    {
      it( 'should be defined', function( )
      {
        expect( command.trigger ).toBeType( 'function' );
      } );
      
      it( 'should be able to trigger an event on the dependent events object', function( )
      {
        var injector = new Legs.Injector( );
        
        var events = new Legs.Events( );
        
        injector.mapValue( 'events', events );
        injector.mapValue( 'injector', injector );
        
        injector.injectInto( command );
        
        expect( command.events ).toBe( events );
        expect( command.injector ).toBe( injector );
        
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        command.trigger( 'test', 123 );
        
        expect( spy ).toHaveBeenCalledWith( 123 );
      } );
    } );
  } );
  
  describe( 'dependencies', function( )
  {
    var command;
    
    beforeEach( function( )
    {
      command = new Legs.Command( );
    } );
    
    it( 'should have a dependency on "events"', function( )
    {
      expect( command._events ).toEqual( 'events' );
    } );
    
    it( 'should have a dependency on "injector"', function( )
    {
      expect( command._injector ).toEqual( 'injector' );
    } );
  } );
} );