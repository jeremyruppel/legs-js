module( 'EventMap',
{
	setup : function( )
	{
		$( '#app-context' ).empty( );
	},
	teardown : function( )
	{
		$( '#app-context' ).empty( );
		
		$( '#one' ).die( );
		$( '#two' ).die( );
	}
} );

test( 'maps listeners to selectors', 2, function( )
{
	var map = new Legs.EventMap( this );
	
	var handler = function( )
	{
		ok( true, 'handler was triggered' );
	};
	
	map.map( $( '#one' ), 'event-type', handler );
	
	map.map( $( '#two' ), 'event-type', handler );
	
	$( '#app-context' ).append( Legs.Utils.Element( '#one' ) ).append( Legs.Utils.Element( '#two' ) );
	
	$( '#one' ).trigger( 'event-type' );
	
	$( '#two' ).trigger( 'event-type' );
} );

test( 'mapped functions run in scope of maps context', 1, function( )
{
	var context = this;
	
	var map = new Legs.EventMap( this );
	
	$( '#app-context' ).append( Legs.Utils.Element( '#one' ) );
	
	map.map( $( '#one' ), 'event-type', function( )
	{
		deepEqual( context, this, 'handler is called in the correct scope' );
	} );
	
	$( '#one' ).trigger( 'event-type' );
} );

test( 'can unmap listeners', 3, function( )
{
	var map = new Legs.EventMap( this );
	
	var handler = function( )
	{
		ok( true, 'handler was triggered' );
	};
	
	map.map( $( '#one' ), 'event-type', handler );
	
	map.map( $( '#two' ), 'event-type', handler );
	
	$( '#app-context' ).append( Legs.Utils.Element( '#one' ) ).append( Legs.Utils.Element( '#two' ) );
	
	$( '#one' ).trigger( 'event-type' );
	
	$( '#two' ).trigger( 'event-type' );
	
	map.unmap( $( '#two' ), 'event-type', handler );
	
	$( '#one' ).trigger( 'event-type' );
	
	// shouldn't fire
	$( '#two' ).trigger( 'event-type' );
} );

test( 'can unmap all listeners', 0, function( )
{
	var map = new Legs.EventMap( this );
	
	var handler = function( )
	{
		ok( false, 'this handler should not be triggered after being unmapped' );
	};
	
	map.map( $( '#one' ), 'event-type', handler );
	
	map.map( $( '#two' ), 'event-type', handler );
	
	$( '#app-context' ).append( Legs.Utils.Element( '#one' ) ).append( Legs.Utils.Element( '#two' ) );
	
	map.unmapAll( );
	
	$( '#one' ).trigger( 'event-type' );
	
	$( '#two' ).trigger( 'event-type' );
} );