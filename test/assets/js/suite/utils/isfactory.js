module( 'Utils::IsFactory' );

test( 'plain objects are not factories', 1, function( )
{
	equal( Legs.Utils.IsFactory( { } ), false, 'object is not a factory' );
} );

test( 'anything with a create method is a factory', 1, function( )
{
	equal( Legs.Utils.IsFactory( { create : function( ){ } } ), true, 'object is a factory (for our purposes)' );
} );

test( 'models are factories', 1, function( )
{
	var model = new Legs.Model( function( Events, dispatch ){ } );
	
	equal( Legs.Utils.IsFactory( model ), true, 'model is a factory' );
} );

test( 'mediators are factories', 1, function( )
{
	var mediator = new Legs.Mediator( function( Events, dispatch ){ } );
	
	equal( Legs.Utils.IsFactory( mediator ), true, 'mediator is a factory' );
} );

test( 'views are factories', 1, function( )
{
	var view = new Legs.View( { } );
	
	equal( Legs.Utils.IsFactory( view ), true, 'view is a factory' );
} );