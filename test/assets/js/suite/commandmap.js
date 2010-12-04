module( 'CommandMap' );

test( 'accepts an event dispatcher through constructor', 1, function( )
{
	var map = new Legs.CommandMap( new Legs.EventDispatcher( ) );
	
	ok( true );
} );

test( 'maps callbacks on behalf of the event dispatcher', 2, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.CommandMap( dispatcher );
	
	map.MapEvent( 'test', function( event )
	{
		equals( event.type, 'test', 'event type is received correctly' );
		equals( event.data, 'data', 'event data is received correctly' );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test', 'data' ) );
} );

test( 'commands are provided a dispatch method', 1, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.CommandMap( dispatcher );
	
	map.MapEvent( 'test', function( event, dispatch )
	{
		ok( dispatch );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test' ) ); 
} );

test( 'commands can be chained using the dispatch method', 1, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.CommandMap( dispatcher );
	
	map.MapEvent( 'test', function( event, dispatch )
	{
		dispatch( new Legs.Event( 'chained' ) );
	} );
	
	map.MapEvent( 'chained', function( event, dispatch )
	{
		ok( true );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test' ) );
} );

test( 'can chain three commands for the hell of it', 1, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.CommandMap( dispatcher );
	
	map.MapEvent( 'test', function( event, dispatch )
	{
		dispatch( new Legs.Event( 'chained-first' ) );
	} );
	
	map.MapEvent( 'chained-first', function( event, dispatch )
	{
		dispatch( new Legs.Event( 'chained-second' ) );
	} );
	
	map.MapEvent( 'chained-second', function( event, dispatch )
	{
		ok( true );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test' ) );
} );

test( 'can chain two events off of one event', 2, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.CommandMap( dispatcher );
	
	map.MapEvent( 'test', function( event, dispatch )
	{
		dispatch( new Legs.Event( 'chained' ) );
	} );
	
	map.MapEvent( 'chained', function( event, dispatch )
	{
		ok( true );
	} );
	
	map.MapEvent( 'chained', function( event, dispatch )
	{
		ok( true );
	} );
	
	dispatcher.dispatch( new Legs.Event( 'test' ) );
} );