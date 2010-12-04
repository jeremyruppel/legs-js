module( 'Context' );

test( 'can override startup method', 1, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Startup : function( )
			{
				ok( true );
			}
		} );
} );

test( 'error is thrown if no context is provided', 1, function( )
{
	raises( function( )
	{
		var context = new Legs.Context( );
	},
	'no context element was provided so an error was thrown' );
} );

test( 'error is thrown if startup method is not overriden', 1, function( )
{
	raises( function( )
	{
		var context = new Legs.Context( $( '#app-context' ), { } );
	},
	'no startup method was overridden so an error was thrown' );
} );

test( 'provides context utils to startup method in order', 6, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
	{
		Startup : function( Events, CommandMap, Actors, Injector, MediatorMap, ContextView )
		{
			equal( Events.constructor, Object, 'Events is a plain object' );
			
			equal( CommandMap.constructor, Legs.CommandMap, 'CommandMap is a Legs.CommandMap' );
			
			equal( Actors.constructor, Object, 'Actors is a plain object' );
			
			equal( Injector.constructor, Legs.Injector, 'Injector is a Legs.Injector' );
			
			equal( MediatorMap.constructor, Legs.MediatorMap, 'MediatorMap is a Legs.MediatorMap' );
			
			deepEqual( ContextView, $( '#app-context' ), 'ContextView is the view selector passed to the context' );
		}
	} );
} );

test( 'can get standard events in startup method', 1, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Startup : function( Events, CommandMap )
			{
				ok( Events.STARTUP_COMPLETE, 'startup complete event is mixed in' );
			}
		} );
} );

test( 'can get custom events in startup method', 1, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Events : 
			{
				CUSTOM_EVENT : 'This is a custom event'
			},
			Startup : function( Events, CommandMap )
			{
				equals( Events.CUSTOM_EVENT, 'This is a custom event', 'custom events are mixed into events object' );
			}
		} );
} );

test( 'standard events cannot be overwritten', 1, function( )
{	
	var context = new Legs.Context( $( '#app-context' ),
		{
			Events :
			{
				STARTUP_COMPLETE : 'This is a custom event'
			},
			
			Startup : function( Events, CommandMap )
			{
				equals( Events.STARTUP_COMPLETE, Legs.ContextBase.Events.STARTUP_COMPLETE, 'startup complete event was not overwritten' );
			}
		} );
} );

test( 'commands can be mapped to startup complete event', 1, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Startup : function( Events, CommandMap )
			{
				CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event )
				{
					ok( event );
				} );
			}
		} );
} );

test( 'commands can be mapped to custom events', 1, function( ) 
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Events :
			{
				CUSTOM_EVENT : 'This is a custom event'
			},
			
			Startup : function( Events, CommandMap )
			{
				CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event, dispatch )
				{
					dispatch( new Legs.Event( Events.CUSTOM_EVENT ) );
				} );
				
				CommandMap.MapEvent( Events.CUSTOM_EVENT, function( event )
				{
					ok( event );
				} );
			}
		} );
} );

test( 'commands can access actors through the startup routine scope', 2, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Actors :
			{
				Model :
				{
				}
			},
			
			Startup : function( Events, CommandMap, Actors )
			{
				CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event, dispatch )
				{
					ok( Actors );
					ok( Actors.Model );
				} );
			}
		} );
} );

test( 'two contexts can exist independent of eachother without namespace collisions', 2, function( )
{
	var one = new Legs.Context( $( '#app-context' ),
		{
			Events :
			{
				ONE_EVENT : 'one event'
			},

			Startup : function( Events, CommandMap, Actors )
			{
			}
		} );
	
	var two = new Legs.Context( $( '#app-context' ),
		{
			Startup : function( Events, CommandMap, Actors )
			{
			}
		} );
	
	notDeepEqual( one, two );
	
	notDeepEqual( one.Events, two.Events );
} );

test( 'two contexts can exist independent of eachother without event pollution', 1, function( )
{
	var one = new Legs.Context( $( '#app-context' ),
		{
			Startup : function( Events, CommandMap, Actors )
			{
				CommandMap.MapEvent( 'test', function( event )
				{
					ok( true );
				} );
			}
		} );
		
	var two = new Legs.Context( $( '#app-context' ),
		{
			Startup : function( Events, CommandMap, Actors )
			{
				CommandMap.MapEvent( 'test', function( event )
				{
					ok( false );
				} );
			}
		} );
		
	one.EventDispatcher.dispatch( new Legs.Event( 'test' ) );
} );