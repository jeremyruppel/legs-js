module( 'EventDispatcher' );

test( 'can listen for events', 2, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	dispatcher.listen( 'test', function( event )
	{
		equal( event.type, 'test', 'event type is correct' );
		equal( event.data, 'data', 'event data is correct' );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test', 'data' ) );
} );

test( 'throws error if listen event type is null or undefined', 2, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	raises( function( )
	{
		dispatcher.listen( null, function( event ){ } );
	},
	'should throw error if event type is null' );
	
	raises( function( )
	{
		dispatcher.listen( undefined, function( event ){ } );
	},
	'should throw error if event type is undefined' );
} );

test( 'throws error if unlisten event type is null or undefined', 2, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	raises( function( )
	{
		dispatcher.unlisten( null, function( event ){ } );
	},
	'should throw error if event type is null' );
	
	raises( function( )
	{
		dispatcher.unlisten( undefined, function( event ){ } );
	},
	'should throw error if event type is undefined' );
} );

test( 'can have multiple callbacks for the same event', 4, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	dispatcher.listen( 'test', function( event )
	{
		equal( event.type, 'test', 'event type is correct in callback one' );
		equal( event.data, 'data', 'event data is correct in callback one' );
	} );
	
	dispatcher.listen( 'test', function( event )
	{
		equal( event.type, 'test', 'event type is correct in callback two' );
		equal( event.data, 'data', 'event data is correct in callback two' );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test', 'data' ) );
} );

test( 'cannot add a given callback twice for the same event', 1, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var callback = function( event )
	{
		ok( true );
	};
	
	dispatcher.listen( 'test', callback );
	dispatcher.listen( 'test', callback );
	dispatcher.listen( 'test', callback );
	
	dispatcher.dispatch( new Legs.Event( 'test', 'data' ) );
} );

test( 'can unlisten to events', 0, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var callback = function( event )
	{
		ok( true );
	};
	
	dispatcher.listen( 'test', callback );
	dispatcher.unlisten( 'test', callback );
	
	dispatcher.dispatch( new Legs.Event( 'test', 'data' ) );
} );