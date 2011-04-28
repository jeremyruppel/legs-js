describe( 'Legs.Context', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Context ).toBeDefined( );
  } );
  
  it( 'should be a function', function( )
  {
    expect( Legs.Context ).toBeType( 'function' );
  } );
  
  it( 'should be able to be instantiated', function( )
  {
    expect( ( new Legs.Context( ) ) ).toBeType( 'object' );
  } );
  
  it( 'should be an instance of Legs.Class', function( )
  {
    expect( new Legs.Context( ) ).toBeAnInstanceOf( Legs.Class );
  } );
  
  describe( 'context members', function( )
  {
    var context;
    
    beforeEach( function( )
    {
      context = new Legs.Context( );
    } );
    
    it( 'should have an injector', function( )
    {
      expect( context.injector ).toBeAnInstanceOf( Legs.Injector );
    } );
    
    it( 'should have an event bus', function( )
    {
      expect( context.events ).toBeAnInstanceOf( Legs.Events );
    } );
    
    it( 'should have a command map', function( )
    {
      expect( context.commandMap ).toBeAnInstanceOf( Legs.CommandMap );
    } );
    
    it( 'should have a context view', function( )
    {
      expect( context.contextView ).toBeAnInstanceOf( $ );
    } );
  } );
  
  describe( 'events', function( )
  {
    it( 'should have the startup complete event defined in the events object by default', function( )
    {
      var context = new Legs.Context( );
      
      expect( context.events.STARTUP_COMPLETE ).toEqual( 'startup complete' );
    } );
    
    it( 'should merge in any user defined events', function( )
    {
      var context = Legs.Context.create(
        {
          events :
          {
            CUSTOM_EVENT : 'custom event'
          }
        } );
      
      expect( context.events ).toBeAnInstanceOf( Legs.Events );
      
      expect( context.events.CUSTOM_EVENT ).toEqual( 'custom event' );
    } );
    
    it( 'should not allow the user to override the startup complete event', function( )
    {
      var context = Legs.Context.create(
        {
          events :
          {
            STARTUP_COMPLETE : 'i overrode it'
          }
        } );
      
      expect( context.events.STARTUP_COMPLETE ).toEqual( 'startup complete' );
    } );
  } );
  
  describe( 'mapInjections', function( )
  {
    var context;
    
    beforeEach( function( )
    {
      context = new Legs.Context( );
    } );
    
    it( 'should be defined', function( )
    {
      expect( context.mapInjections ).toBeType( 'function' );
    } );
    
    it( 'should map the events object in the injector', function( )
    {
      expect( context.injector.hasMapping( 'events' ) ).toBe( true );
    } );
    
    it( 'should map the injector in the injector', function( )
    {
      expect( context.injector.hasMapping( 'injector' ) ).toBe( true );
    } );
    
    it( 'should map the command map in the injector', function( )
    {
      expect( context.injector.hasMapping( 'commandmap' ) ).toBe( true );
    } );
    
    it( 'should map the context view in the injector', function( )
    {
      expect( context.injector.hasMapping( 'contextview' ) ).toBe( true );
    } );
  } );
  
  describe( 'startup', function( )
  {
    it( 'should have autoStartup be true by default', function( )
    {
      var context = new Legs.Context( );
      
      expect( context.autoStartup ).toBe( true );
    } );
    
    it( 'should call the startup method when initialized', function( )
    {
      var spy = jasmine.createSpy( 'startup' );
      
      var context = Legs.Context.create( { startup : spy } );
      
      expect( spy ).toHaveBeenCalled( );
    } );
    
    it( 'should only call the startup method once', function( )
    {
      var spy = jasmine.createSpy( 'startup' );
      
      var context = Legs.Context.create( { startup : spy } );
      
      expect( spy.callCount ).toEqual( 1 );
    } );
    
    it( 'should call the startup method if autoStartup is false', function( )
    {
      var spy = jasmine.createSpy( 'startup' );
      
      var context = Legs.Context.create( { startup : spy, autoStartup : false } );
      
      expect( spy ).toHaveBeenCalled( );
    } );
    
    it( 'should call the mapInjections method when initialized', function( )
    {
      var spy = jasmine.createSpy( 'mapInjections' );
      
      var context = Legs.Context.create( { mapInjections : spy } );
      
      expect( spy ).toHaveBeenCalled( );
    } );
    
    it( 'should call the mapInjections method if autoStartup is false', function( )
    {
      var spy = jasmine.createSpy( 'mapInjections' );
      
      var context = Legs.Context.create( { mapInjections : spy, autoStartup : false } );
      
      expect( spy ).toHaveBeenCalled( );
    } );
    
    it( 'should call the postStartup method when initialized', function( )
    {
      var spy = jasmine.createSpy( 'postStartup' );
      
      var context = Legs.Context.create( { postStartup : spy } );
      
      expect( spy ).toHaveBeenCalled( );
    } );
    
    it( 'should not call the postStartup method if autoStartup is false', function( )
    {
      var spy = jasmine.createSpy( 'postStartup' );
      
      var context = Legs.Context.create( { postStartup : spy, autoStartup : false } );
      
      expect( spy ).not.toHaveBeenCalled( );
    } );
    
    it( 'should trigger the startup complete event after startup', function( )
    {
      var spy = jasmine.createSpy( 'startup complete handler' );
      
      var context = Legs.Context.create(
        {
          startup : function( )
          {
            this.events.bind( 'startup complete', spy );
          }
        } );
      
      expect( spy ).toHaveBeenCalled( );
    } );
    
    it( 'should not trigger the startup complete event if autoStartup is false', function( )
    {
      var spy = jasmine.createSpy( 'startup complete handler' );
      
      var context = Legs.Context.create(
        {
          startup : function( )
          {
            this.events.bind( 'startup complete', spy );
          },
          autoStartup : false
        } );
      
      expect( spy ).not.toHaveBeenCalled( );
    } );
    
    it( 'should execute commands that are bound to the startup complete event', function( )
    {
      var spy = jasmine.createSpy( 'startup complete command' );
      
      var context = Legs.Context.create(
        {
          commands :
          {
            StartupCompleteCommand : Legs.Command.extend( { execute : spy } )
          },
          startup : function( )
          {
            this.commandMap.mapEvent( 'startup complete', this.commands.StartupCompleteCommand );
          }
        } );
    } );
  } );
} );