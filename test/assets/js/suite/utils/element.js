module( 'Utils::Element' );

test( 'creates element with correct tag name', 3, function( )
{
	equal( Legs.Utils.Element( 'div' ).tagName, 'DIV', 'tag name is div' );
	
	equal( Legs.Utils.Element( 'li' ).tagName, 'LI', 'tag name is li' );
	
	equal( Legs.Utils.Element( 'custom' ).tagName, 'CUSTOM', 'tag name is custom' );
} );

test( 'element with no tag name defaults to div', 4, function( )
{
	equal( Legs.Utils.Element( '' ).tagName, 'DIV', 'default tag name is div' );
	
	equal( Legs.Utils.Element( '.test' ).tagName, 'DIV', 'class-only default tag name is div' );
	
	equal( Legs.Utils.Element( '#test' ).tagName, 'DIV', 'id-only default tag name is div' );
	
	equal( Legs.Utils.Element( '#test.test' ).tagName, 'DIV', 'id and class default tag name is div' );
} );

test( 'creates element with correct id', 3, function( )
{
	equal( Legs.Utils.Element( 'div#word' ).id, 'word', 'id is word' );
	
	equal( Legs.Utils.Element( 'li#hyphen-ated' ).id, 'hyphen-ated', 'id is hyphen-ated' );
	
	equal( Legs.Utils.Element( '#no-tag' ).id, 'no-tag', 'id is no-tag' );
} );

test( 'creates element with correct class', 3, function( )
{
	equal( Legs.Utils.Element( 'div.hello' ).className, 'hello', 'class is hello' );
	
	equal( Legs.Utils.Element( 'custom.what-ever' ).className, 'what-ever', 'class is what-ever' );
	
	equal( Legs.Utils.Element( '.no-tag' ).className, 'no-tag', 'class is no-tag' );
} );

test( 'creates element with correct class and id regardless of order', 4, function( )
{
	equal( Legs.Utils.Element( 'div#test.hello' ).id, 'test', 'id is test' );
	
	equal( Legs.Utils.Element( 'div#test.hello' ).className, 'hello', 'class is hello' );
	
	equal( Legs.Utils.Element( 'div.test#hello' ).id, 'hello', 'id is hello' );
	
	equal( Legs.Utils.Element( 'div.test#hello' ).className, 'test', 'class is test' );
} );

// jquery acceptance tests

test( 'element plays well with jquery selectors', 3, function( )
{
	var element = Legs.Utils.Element( 'div#secret.test-element' );
	
	$( element ).data( 'secret', 'message' );
	
	$( '#app-context' ).append( element );
	
	equal( $( 'div#secret' ).data( 'secret' ), 'message', 'correct element can be selected by id' );
	
	equal( $( 'div.test-element' ).data( 'secret' ), 'message', 'correct element can be selected by class' );
	
	equal( $( 'div#secret.test-element' ).data( 'secret' ), 'message', 'correct element can be selected by id then class' );
} );