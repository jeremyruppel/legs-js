module( 'Reflect::Namespace' );

function name( object )
{
	return object[ Legs.Reflect.NAME ];
}

test( 'names first level objects', 3, function( )
{
	var object = { hello : { }, world : { }, testing : { } };
	
	Legs.Reflect.Namespace( object );
	
	equal( name( object.hello ), 'hello', 'object.hello got the correct name' );
	
	equal( name( object.world ), 'world', 'object.world got the correct name' );
	
	equal( name( object.testing ), 'testing', 'object.testing got the correct name' );
} );

test( 'names first level objects with prefix', 3, function( )
{
	var object = { hello : { }, world : { }, testing : { } };
	
	Legs.Reflect.Namespace( object, 'prefix' );
	
	equal( name( object.hello ), 'prefix.hello', 'object.hello got the correct name' );
	
	equal( name( object.world ), 'prefix.world', 'object.world got the correct name' );
	
	equal( name( object.testing ), 'prefix.testing', 'object.testing got the correct name' );
} );

test( 'names second level objects', 3, function( )
{
	var object = 
	{
		hello :
		{
			world : { }
		},
		
		one :
		{
			two : { },
			three : { }
		}
	};
	
	Legs.Reflect.Namespace( object );
	
	equal( name( object.hello.world ), 'hello.world', 'object.hello.world got the correct name' );
	
	equal( name( object.one.two ), 'one.two', 'object.one.two got the correct name' );
	
	equal( name( object.one.three ), 'one.three', 'object.one.three got the correct name' );
} );

test( 'names second level objects with prefix', 3, function( )
{
	var object = 
	{
		hello :
		{
			world : { }
		},
		
		one :
		{
			two : { },
			three : { }
		}
	};
	
	Legs.Reflect.Namespace( object, 'prefix' );
	
	equal( name( object.hello.world ), 'prefix.hello.world', 'object.hello.world got the correct name' );
	
	equal( name( object.one.two ), 'prefix.one.two', 'object.one.two got the correct name' );
	
	equal( name( object.one.three ), 'prefix.one.three', 'object.one.three got the correct name' );
} );