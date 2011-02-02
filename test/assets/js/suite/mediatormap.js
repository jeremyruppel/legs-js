module( 'MediatorMap',
{
	setup : function( )
	{
		$( '#app-context' ).empty( );
		$( '#app-context' ).append( '<div id="test-context" />' );
	},
	
	teardown : function( )
	{
		$.livequery.reset( );
		
		$( '.mediate-me', '#test-context' ).expire( );
		$( '#app-context' ).empty( );
	}
} );

// livequery acceptance tests

test( 'livequery reset clears out the livequery queue', 1, function( )
{
	stop( );
	
	$( '.mediate-me', '#test-context' ).livequery( 
		function( )
		{
			ok( true, 'an element was added' );
			
			$.livequery.reset( );
			
			$( this ).remove( );
		},
		function( )
		{
			ok( false, 'an element was removed but the queue should have been cleared before we got to this assertion' );
		} );
	
		$( '#test-context' ).append( '<div class="mediate-me" />' );
		
		setTimeout( start, 100 );
} );

test( 'livequery announces removed nodes on a per node basis', 1, function( )
{
	stop( );
	
	$( '.mediate-me', '#test-context' ).livequery(
		function( )
		{
			if( this.id === 'two' )
			{
				$( this ).remove( );
			}
		},
		function( )
		{
			ok( this, 'removed view id ' + this.id );
		} );
		
	$( '#test-context' ).append( '<div class="mediate-me" id="one"></div>' );
	$( '#test-context' ).append( '<div class="mediate-me" id="two"></div>' );
	
	setTimeout( start, 100 );
} );

// mediator map tests

test( 'automatically maps factories in injector', 2, function( )
{
	var injector = new Legs.Injector( new Legs.EventDispatcher( ), { } );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), injector );
	
	var view = new Legs.View( '.mediate-me', { } );
	
	var mediator = new Legs.Mediator( function( Events, dispatch ){ } );
	
	map.MapView( view, mediator );
	
	ok( injector.Has( view ), 'injector has view factory mapped' );
	
	ok( injector.Has( mediator ), 'injector has mediator factory mapped' );
} );

test( 'creates mediator for mediated view selector', 3, function( )
{
	stop( );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), new Legs.Injector( new Legs.EventDispatcher( ), { } ) );
	
	var view = new Legs.View( '.mediate-me', { } );
	
	var mediator = new Legs.Mediator( function( Events, dispatch )
	{
		ok( true, 'mediator is created' );
		
		this.onregister = function( view )
		{
			ok( true, 'mediator.onregister is called' );
			
			equal( view.element.className, 'mediate-me', 'view passed to mediator in onregister has correct class' );
		};
	} );
	
	map.MapView( view, mediator );
	
	$( '#test-context' ).append( '<div class="mediate-me" />' );
	
	setTimeout( start, 100 );
} );

test( 'view receives correct element when added', 1, function( )
{
	stop( );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), new Legs.Injector( new Legs.EventDispatcher( ), { } ) );
	
	var view = new Legs.View( '.mediate-me', { } );
	
	var element = view.createElement( );
	
	var mediator = new Legs.Mediator( function( Events, dispatch )
	{
		this.onregister = function( view )
		{
			strictEqual( view.element, element, 'view passed to mediator in onregister has the same element added to DOM' );
		};
	} );
	
	map.MapView( view, mediator );
	
	$( '#test-context' ).append( element );
	
	setTimeout( start, 100 );
} );

test( 'removes mediator for mediated view selector', 4, function( )
{
	stop( );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), new Legs.Injector( new Legs.EventDispatcher( ), { } ) );
	
	var view = new Legs.View( '.mediate-me', { } );
	
	var mediator = new Legs.Mediator( function( Events, dispatch )
	{
		ok( true, 'mediator is created' );
		
		this.onregister = function( view )
		{
			ok( true, 'mediator.onregister is called' );
			
			$( view.element ).remove( );
		};
		
		this.onremove = function( view )
		{
			ok( true, 'mediator.onremove is called' );
			
			equal( view.element.className, 'mediate-me', 'view passed to mediator in onremove has correct class' );
		};
	} );
	
	map.MapView( view, mediator );
	
	$( '#test-context' ).append( view.createElement( ) );
	
	setTimeout( start, 100 );
} );

test( 'one mediator is created per view', 6, function( )
{
	stop( );
	
	var events = { VIEW_CREATED : 'view created' };
	
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), new Legs.Injector( dispatcher, events ) );
	
	var view = new Legs.View( '.mediate-me', { } );
	
	var mediator = new Legs.Mediator( function( Events, dispatch )
	{
		ok( true, 'mediator is created' );
		
		this.onregister = function( view )
		{
			ok( true, 'mediator.onregister is called' );
			
			dispatch( new Legs.Event( Events.VIEW_CREATED ) );
		};
	} );
	
	map.MapView( view, mediator );
	
	dispatcher.listen( events.VIEW_CREATED, function( event )
	{
		ok( event, 'mediator dispatched view created event' );
	} );
	
	$( '#test-context' ).append( view.createElement( ) );
	$( '#test-context' ).append( view.createElement( ) );
	
	setTimeout( start, 100 );
} );

test( 'a mediator is only removed when its view is removed', 5, function( )
{
	stop( );
	
	var events = { VIEW_REMOVED : 'view removed' };
	
	var dispatcher = new Legs.EventDispatcher( );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), new Legs.Injector( dispatcher, events ) );
	
	var one = new Legs.View( '.mediate-me#stick-around', { } );
	
	var two = new Legs.View( '.mediate-me#get-deleted', { } );
	
	var mediator = new Legs.Mediator( function( Events, dispatch )
	{
		ok( true, 'mediator is created' );
		
		this.onregister = function( view )
		{
			ok( true, 'mediator.onregister is called' );
			
			if( view.element.id == 'get-deleted' )
			{
				$( view.element ).remove( );
			}
		};
		
		this.onremove = function( view )
		{
			dispatch( new Legs.Event( Events.VIEW_REMOVED, view ) );
		};
	} );
	
	map.MapView( one, mediator );
	
	map.MapView( two, mediator );
	
	dispatcher.listen( events.VIEW_REMOVED, function( event )
	{
		// should only get one of these
		equal( event.data.element.id, 'get-deleted', 'only get-deleted view is removed' );
	} );
	
	$( '#test-context' ).append( one.createElement( ) );
	$( '#test-context' ).append( two.createElement( ) );
	
	setTimeout( start, 100 );
} );

test( 'view passed to mediator already has children created', 4, function( )
{
	stop( );
	
	var map = new Legs.MediatorMap( $( '#test-context' ), new Legs.Injector( new Legs.EventDispatcher( ), { } ) );
	
	var view = new Legs.View( '#mediate-me',
	{
		child : '#child-one',
		group : '.child-group'
	} );
	
	var mediator = new Legs.Mediator( function( Events, dispatch )
	{
		this.onregister = function( view )
		{
			ok( view.child, 'view has child property set' );
			
			deepEqual( view.child, $( '#child-one', view.root ), 'child one is the correct selector' );
			
			ok( view.group, 'view has group property set' );
			
			deepEqual( view.group, $( '.child-group', view.root ), 'child group is the correct selector' );
		};
	} );
	
	map.MapView( view, mediator );
	
	var element = $( view.createElement( ) );
	
	element.append( Legs.Utils.Element( '#child-one' ) );
	
	element.append( [ Legs.Utils.Element( '.child-group' ), Legs.Utils.Element( '.child-group' ), Legs.Utils.Element( '.child-group' ) ] );
	
	$( '#test-context' ).append( element );
	
	setTimeout( start, 100 );
} );