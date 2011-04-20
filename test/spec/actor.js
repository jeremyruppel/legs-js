describe( 'Legs.Actor', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Actor ).toBeDefined( );
  } );
  
  it( 'should be a function', function( )
  {
    expect( Legs.Actor ).toBeType( 'function' );
  } );
  
  it( 'should be able to be instantiated', function( )
  {
    expect( ( new Legs.Actor( ) ) ).toBeType( 'object' );
  } );
  
  it( 'should be an instance of Legs.Class', function( )
  {
    expect( new Legs.Actor( ) ).toBeAnInstanceOf( Legs.Class );
  } );
  
  describe( 'instance methods', function( )
  {
    var actor;
    
    beforeEach( function( )
    {
      actor = new Legs.Actor( );
    } );
    
    describe( 'trigger', function( )
    {
      it( 'should be defined', function( )
      {
        expect( actor.trigger ).toBeType( 'function' );
      } );
      
      it( 'should be able to trigger an event on the dependent events object', function( )
      {
        var injector = new Legs.Injector( );
        
        var events = new Legs.Events( );
        
        injector.mapValue( 'events', events );
        injector.mapValue( 'injector', injector );
        
        injector.injectInto( actor );
        
        expect( actor.events ).toBe( events );
        expect( actor.injector ).toBe( injector );
        
        var spy = jasmine.createSpy( );
        
        events.bind( 'test', spy );
        
        actor.trigger( 'test', 123 );
        
        expect( spy ).toHaveBeenCalledWith( 123 );
      } );
    } );
  } );
  
  describe( 'dependencies', function( )
  {
    var actor;
    
    beforeEach( function( )
    {
      actor = new Legs.Actor( );
    } );
    
    it( 'should have a dependency on "events"', function( )
    {
      expect( actor._events ).toEqual( 'events' );
    } );
    
    it( 'should have a dependency on "injector"', function( )
    {
      expect( actor._injector ).toEqual( 'injector' );
    } );
  } );
} );