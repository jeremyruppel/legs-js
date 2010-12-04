module( 'Utils::Mixin' );

test( 'does nothing if only provided a target', 2, function( )
{
	var target = { one : 'one!', two : 'two!' };
	
	Legs.Utils.Mixin( target );
	
	equals( target.one, 'one!', 'target property one is not changed' );
	
	equals( target.two, 'two!', 'target property two is not changed' );
} );

test( 'mixes in one object to another', 3, function( )
{
	var target = { one : 'one!', two : 'two!' };
	
	var source = { one : 'ONE!', three : 'three!' };
	
	Legs.Utils.Mixin( target, source );
	
	equals( target.one, 'ONE!', 'target property one is overwritten' );
	
	equals( target.two, 'two!', 'target property two is not touched' );
	
	equals( target.three, 'three!', 'target property three has been added' );
} );

test( 'mixes in more than one object in order', 5, function( )
{
	var target = { one : 'one!', two : 'two!', five : 'five!' };
	
	var first = { one : 'ONE!', two : 'TWO!', three : 'THREE!' };
	
	var second = { two : 'two...', four : 'four...' };
	
	Legs.Utils.Mixin( target, first, second );
	
	equals( target.one, 'ONE!', 'target property one is overwritten by first object' );
	
	equals( target.two, 'two...', 'target property two is overwritten by second object' );
	
	equals( target.three, 'THREE!', 'target property three is set by first object' );
	
	equals( target.four, 'four...', 'target property four is set by second object' );
	
	equals( target.five, 'five!', 'target property five is not touched by either mixin' );
} );