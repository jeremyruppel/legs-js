module( 'Injector' );

test( 'throws error if factory has not been mapped', 1, function( )
{
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );

	raises( function( )
	{
		injector.Get( { } );
	},
	'this object isnt even a factory, come on now' );
} );

test( 'allows inspection of whether a factory has been mapped or not', 3, function( )
{
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );
	
	var factory = new Legs.Model( function( Events, dispatch ){ } );
	
	var singleton = new Legs.Model( function( Events, dispatch ){ } );
	
	var something = new Legs.Model( function( Events, dispatch ){ } );
	
	injector.MapClass( factory );
	
	injector.MapSingleton( singleton );
	
	equal( injector.Has( factory ), true, 'injector has factory mapped' );
	
	equal( injector.Has( singleton ), true, 'injector has singleton mapped' );
	
	equal( injector.Has( something ), false, 'injector does not have this factory mapped' );
} );

test( 'throws error if singleton class does not adhere to factory interface', 1, function( )
{
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );
	
	raises( function( )
	{
		injector.MapSingleton( { } );
	},
	'this object isnt even a factory, come on now' );
} );

test( 'throws error if factory class does not adhere to factory interface', 1, function( )
{
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );
	
	raises( function( )
	{
		injector.MapClass( { } );
	},
	'this object isnt even a factory, come on now' );
} );

test( 'map class returns a new instance every time', 1, function( )
{
	var factory = new Legs.Model( function( Events, dispatch ){ } );
	
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );
	
	injector.MapClass( factory );
	
	var one = injector.Get( factory );

	var two = injector.Get( factory );
	
	notStrictEqual( one, two );
} );

test( 'map singleton returns the same instance every time', 1, function( )
{
	var factory = new Legs.Model( function( Events, dispatch ){ } );
	
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );
	
	injector.MapSingleton( factory );
	
	var one = injector.Get( factory );

	var two = injector.Get( factory );
	
	strictEqual( one, two );
} );

test( 'injector provides events object to singleton objects', 1, function( )
{
	var factory = new Legs.Model( function( Events, dispatch )
	{
		this.test = function( )
		{
			return Events;
		};
	} );
	
	var object = { TEST : 'test' };
	
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), object );
	
	injector.MapSingleton( factory );
	
	var one = injector.Get( factory );
	
	strictEqual( one.test( ), object );
} );

test( 'injector provides events object to factory objects', 2, function( )
{
	var factory = new Legs.Model( function( Events, dispatch )
	{
		this.test = function( )
		{
			return Events;
		};
	} );
	
	var object = { TEST : 'test' };
	
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), object );
	
	injector.MapClass( factory );
	
	var one = injector.Get( factory );
	
	strictEqual( one.test( ), object );
	
	var two = injector.Get( factory );
	
	strictEqual( two.test( ), object );
} );

test( 'injector provides dispatch method to singleton objects', 1, function( )
{
	var factory = new Legs.Model( function( Events, dispatch )
	{
		this.test = function( )
		{
			dispatch( new Legs.Event( Events.TEST ) );
		};
	} );
	
	var Events = { TEST : 'test' };
	
	var dispatcher = new Legs.EventDispatcher( );
	
	var injector = new Legs.Injector( dispatcher, Events );
	
	injector.MapSingleton( factory );
	
	dispatcher.listen( Events.TEST, function( event )
	{
		ok( true );
	} );
	
	var one = injector.Get( factory );
	
	one.test( );
} );

test( 'injector provides dispatch method to factory objects', 2, function( )
{
	var factory = new Legs.Model( function( Events, dispatch )
	{
		this.test = function( )
		{
			dispatch( new Legs.Event( Events.TEST ) );
		};
	} );
	
	var Events = { TEST : 'test' };
	
	var dispatcher = new Legs.EventDispatcher( );
	
	var injector = new Legs.Injector( dispatcher, Events );
	
	injector.MapClass( factory );
	
	dispatcher.listen( Events.TEST, function( event )
	{
		ok( true );
	} );
	
	var one = injector.Get( factory );
	
	one.test( );
	
	var two = injector.Get( factory );
	
	two.test( );
} );