describe( 'a sample todos application', function( )
{
  //-----------------------------------
  //  Setup
  //-----------------------------------
  
  var context;
  
  beforeEach( function( )
  {
    context = TodosContext.create(
      {
        autoStartup : false,
        
        has : function( name )
        {
          return this.injector.hasMapping( name );
        },
        
        is : function( name, clazz )
        {
          return this.injector.getInstance( name ) instanceof clazz;
        },
        
        get : function( name )
        {
          return this.injector.getInstance( name );
        }
      } );
  } );
  
  //-----------------------------------
  //  Context
  //-----------------------------------
  
  describe( 'application context', function( )
  {
    it( 'should be defined on the global scope', function( )
    {
      expect( TodosContext ).toBeDefined( );
    } );
    
    it( 'should be able to be instantiated', function( )
    {
      expect( context ).toBeType( 'object' );
    } );
    
    it( 'should be a subclass of Legs.Context', function( )
    {
      expect( context ).toBeAnInstanceOf( Legs.Context );
    } );
    
    it( 'should not auto startup during these tests', function( )
    {
      expect( context.autoStartup ).toBe( false );
    } );
  } );
  
  describe( 'application events', function( )
  {
    
  } );
  
  describe( 'application actors', function( )
  {
    describe( 'Todos collection', function( )
    {
      it( 'should be defined', function( )
      {
        expect( context.actors.Todos ).toBeDefined( );
      } );
      
      it( 'should be mapped in the injector', function( )
      {
        expect( context.has( 'todos' ) ).toBe( true );
      } );
      
      it( 'should be mapped to the correct class', function( )
      {
        expect( context.is( 'todos', context.actors.Todos ) ).toBe( true );
      } );
      
      it( 'should be an instance of Todos', function( )
      {
        expect( context.get( 'todos' ) ).toBeAnInstanceOf( context.actors.Todos );
      } );
    } );
  } );
  
  describe( 'application commands', function( )
  {
    
  } );
} );