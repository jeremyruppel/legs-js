describe( 'Legs', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs ).toBeDefined( );
  } );
  
  describe( 'VERSION', function( )
  {
    it( 'should be defined', function( )
    {
      expect( Legs.VERSION ).toBeDefined( );
    } );
    
    it( 'should look like a version number', function( )
    {
      expect( Legs.VERSION ).toMatch( /^\d+\.\d+\.\d+$/ );
    } );
  } );
} );
