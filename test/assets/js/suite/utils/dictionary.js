module( 'Utils:Dictionary' );

test( 'can store values by object keys', 1, function( )
{
	var dictionary = new Legs.Utils.Dictionary( );
	
	var key = { };
	
	dictionary.put( key, 'value' );
	
	ok( dictionary.has( key ), 'dictionary confirms it has key' );
} );

test( 'can retrieve values by object keys', 1, function( )
{
	var dictionary = new Legs.Utils.Dictionary( );
	
	var key = { };
	
	dictionary.put( key, 'value' );
	
	equal( dictionary.get( key ), 'value', 'key lookup yields correct value' );
} );

test( 'retrieving missing key gives null value', 1, function( )
{
	var dictionary = new Legs.Utils.Dictionary( );
	
	var key = { };
	
	equal( dictionary.get( key ), null, 'key has not been mapped so value is null' );
} );

test( 'separate instances are treated as separate keys', 2, function( )
{
	var dictionary = new Legs.Utils.Dictionary( );
	
	var one = { };
	var two = { };
	
	dictionary.put( one, 'one' );
	dictionary.put( two, 'two' );
	
	equal( dictionary.get( one ), 'one', 'first key maps correctly' );
	equal( dictionary.get( two ), 'two', 'second key maps correctly' );
} );

test( 'same instance as key can overwrite value', 2, function( )
{
	var dictionary = new Legs.Utils.Dictionary( );
	
	var key = { };
	
	dictionary.put( key, 'before' );
	
	equal( dictionary.get( key ), 'before', 'keys value has been stored' );
	
	dictionary.put( key, 'after' );
	
	equal( dictionary.get( key ), 'after', 'keys value has changed' );
} );

test( 'can remove values by key', 2, function( )
{
	var dictionary = new Legs.Utils.Dictionary( );
	
	var key = { };
	
	dictionary.put( key, 'value' );
	
	equal( dictionary.has( key ), true, 'dictionary has key' );
	
	dictionary.remove( key );
	
	equal( dictionary.has( key ), false, 'dictionary no longer has key' );
} );