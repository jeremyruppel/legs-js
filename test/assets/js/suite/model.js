module( 'Model' );

test( 'model returns a factory that can be used to create model instances', 1, function( )
{
	var factory = new Legs.Model( function( )
	{
		this.test = function( )
		{
			ok( true );
		};
	} );
	
	var model = factory.create( );
	
	model.test( );
} );

test( 'model factory provides access to events object through create method', 1, function( )
{
	var TestEvents = { TEST : 'test' };
	
	var factory = new Legs.Model( function( Events )
	{
		this.test = function( )
		{
			return Events.TEST;
		};
	} );
	
	var model = factory.create( TestEvents );
	
	equal( model.test( ), TestEvents.TEST, 'model can make use of shared event object' );
} );

test( 'model factory provides access to dispatch method through create method', 1, function( )
{
	var dispatcher = new Legs.EventDispatcher( );
	
	var dispatch = function( event )
	{
		dispatcher.dispatch( event );
	};
	
	var factory = new Legs.Model( function( Events, dispatch )
	{
		this.test = function( )
		{
			dispatch( new Legs.Event( Events.TEST ) );
		};
	} );
	
	var Events = { TEST : 'test' };
	
	var model = factory.create( Events, dispatch );
	
	dispatcher.listen( Events.TEST, function( event )
	{
		ok( true );
	} );
	
	model.test( );
} );

test( 'when in context, model gets events object of context', 1, function( )
{
	var context = new Legs.Context( $( '#app-context' ),
		{
			Events :
			{
				TEST : 'test'
			},
			
			Actors :
			{
				Test : new Legs.Model( function( Events, dispatch )
				{
					this.test = function( )
					{
						return Events;
					};
				} )
			},
			
			Startup : function( Events, CommandMap, Actors, Injector )
			{
				Injector.MapClass( Actors.Test );
				
				CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event )
				{
					var model = Injector.Get( Actors.Test );
					
					strictEqual( Events, model.test( ) );
				} );
			}
		} );
} );