module( 'View',
{
	setup : function( )
	{
		$( '#app-context' ).empty( );
	},
	teardown : function( )
	{
		$( '#app-context' ).empty( );
	}
} );

test( 'factory has selector property', 1, function( )
{
	var factory = new Legs.View( 'selector', { } );
	
	equal( factory.selector, 'selector' );
} );

test( 'instance receives selector property automatically', 1, function( )
{
	var factory = new Legs.View( 'selector', { } );
	
	var view = factory.create( );
	
	equal( view.selector, 'selector', 'view received selector from factory' );
} );

test( 'factory and instance selector properties are always equal', 1, function( )
{
	var factory = new Legs.View( 'selector', { } );
	
	var view = factory.create( );
	
	equal( factory.selector, view.selector, 'factory and instance selectors are the same' );
} );

test( 'factory creates own element from html selector properly', 3, function( )
{
	var factory = new Legs.View( 'div#div-id.div-class', { } );
	
	var element = factory.createElement( );
	
	equal( element.tagName, 'DIV', 'view elements tag name is correct' );
	
	equal( element.id, 'div-id', 'view elements id is correct' );
	
	equal( element.className, 'div-class', 'view elements class name is correct' );
} );

test( 'selectors in hash are given to view instance as properties', 2, function( )
{
	var factory = new Legs.View( '#test', 
	{
		child : '#child-one',
		
		group : '.child-group'
	} );
	
	var view = factory.create( );
	
	ok( view.child, 'view received child property' );
	
	ok( view.group, 'view received group property' );
} );

test( 'selectors given to view are selecting sub-elements', 2, function( )
{
	var factory = new Legs.View( '#test', 
	{
		child : '#child-one',
		
		group : '.child-group'
	} );
	
	var view = factory.create( );
	
	deepEqual( view.child, $( '#child-one', view.element ), 'view received child property' );
	
	deepEqual( view.group, $( '.child-group', view.element ), 'view received group property' );
} );

test( 'root property is equal to selecting the views element', 1, function( )
{
	var factory = new Legs.View( '#test', { } );
	
	var view = factory.create( );
	
	deepEqual( view.root, $( view.element ), 'view root is equal to selecting views element' );
} );

test( 'selectors match existing child elements', 2, function( )
{
	var factory = new Legs.View( '#test', 
	{
		child : '#child-one',
		
		group : '.child-group'
	} );
	
	var view = factory.create( );
	
	var child = Legs.Utils.Element( '#child-one' );
	
	var group = [ Legs.Utils.Element( '.child-group' ), Legs.Utils.Element( '.child-group' ), Legs.Utils.Element( '.child-group' ) ];
	
	view.root.append( child ).append( group );
	
	view.createChildren( );
	
	deepEqual( view.child, $( '#child-one', view.root ) );
	
	deepEqual( view.group, $( '.child-group', view.root ) );
} );