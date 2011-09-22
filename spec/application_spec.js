describe( 'Legs.Application', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Application ).toBeDefined( );
  } );
  
  describe( 'selector', function( )
  {
    it( 'should be defined', function( )
    {
      expect( new Legs.Application( ).selector ).toBeType( 'string' );
    } );
    
    describe( 'by default', function( )
    {
      it( 'should be "body"', function( )
      {
        expect( new Legs.Application( ).selector ).toEqual( 'body' );
      } );
    } );
    
    describe( 'when specified', function( )
    {
      it( 'should be whatever I say it is', function( )
      {
        expect( new Legs.Application( 'asdf' ).selector ).toEqual( 'asdf' );
      } );
    } );
  } );
  
  describe( 'provide', function( )
  {
    var app;
    
    beforeEach( function( )
    {
      app = new Legs.Application( );
    } );
    
    it( 'should be defined', function( )
    {
      
    } );
    
  } );
} );
