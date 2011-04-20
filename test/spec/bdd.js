describe( 'a sample todos application', function( )
{
  //-----------------------------------
  //  Setup
  //-----------------------------------
  
  var context;
  
  beforeEach( function( )
  {
    context = TodosContext.create( { autoStartup : false } );
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
    
  } );
  
  describe( 'application commands', function( )
  {
    
  } );
} );