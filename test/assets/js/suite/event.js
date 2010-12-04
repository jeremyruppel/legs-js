module( 'Event' );

test( 'accepts type in constructor', 1, function( )
{
	var event = new Legs.Event( 'type' );
	
	ok( true );
} );

test( 'throws error if no type is provided', 1, function( )
{
	raises( function( )
	{
		var event = new Legs.Event( );
	},
	'events must have an event type' );
} );

test( 'accepts type and data in constructor', 1, function( )
{
	var event = new Legs.Event( 'type', 'data' );
	
	ok( true );
} );

test( 'has accessor for type', 2, function( )
{
	var event = new Legs.Event( 'type', 'data' );
	
	equals( event.type, 'type', 'event type can be retrieved' );
	
	event.type = 'changed';
	
	equals( event.type, 'changed', 'event type is mutable' );
} );

test( 'has accessor for data', 2, function( )
{
	var event = new Legs.Event( 'type', 'data' );
	
	equals( event.data, 'data', 'event data can be retrieved' );
	
	event.data = 'changed';
	
	equals( event.data, 'changed', 'event data is mutable' );
} );