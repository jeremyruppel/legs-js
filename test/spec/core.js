describe( 'legs', function( )
{
  it( 'should be defined in a global scope', function( )
  {
    expect( Legs ).toBeDefined( );
  } );
  
  it( 'should have a version', function( )
  {
    expect( Legs.VERSION ).toBeDefined( );
  } );
} );