# legs.js

A JavaScript homage to the [RobotLegs][robotlegs] micro-architecture.

## What legs.js *is*

Totally being re-done, **that's** what! More to come soon...

## Legs.Class

**legs-js** comes with a super-simple class implementation inspired by projects like 
[js-oo][js-oo] and [klass][klass]. It's not nearly as full-featured as either of those
libraries, but it is enough to define and extend classes with accurate inheritance.

All factory methods on `Legs.Class` take an attributes hash that will be applied to the prototype of the class.

To create a new subclass of `Legs.Class`, use `extend`. The result is a type that can be instantiated and inherits from `Legs.Class`.

	var MyClass = Legs.Class.extend( { foo : 'bar' } );
	
	var instance = new MyClass( );
	
	instance.foo // => 'bar'

You can use `create` to instantiate a new object with an attributes hash applied:

	var MyClass = Legs.Class.extend( );
	
	var instance = MyClass.create( { foo : 'bar' } );
	
	instance.foo // => 'bar'

You can also use `include` to apply attributes to a class prototype after the class has been created.

	var MyClass = Legs.Class.extend( );
	
	MyClass.include( { foo : 'bar' } );
	
	var instance = new MyClass( );
	
	instance.foo // => 'bar'

All members in the **legs-js** extend `Legs.Class`.

## Legs.Context

A context defines all parts of your application. It enumerates the application actors, defines the 
commands that will allow them to communicate, and provides a startup routine where you can wire
everything together.

The anatomy of a `Legs.Context` looks like this:

	var Context = Legs.Context.extend(
		{
			// events is the only special package name in that all members of this object get merged onto
			// the application event bus. This is a good place to define event types so your app doesn't
			// feel too magic-stringy
			events :
			{
				// event type definitions here...
			}
			
			// other package names inside a context are totally arbitrary and not even necessary
			// but are definitely more familiar to those coming from RL proper
			actors :
			{
				// actor definitions here...
			},
			commands :
			{
				// command definitions here...
			},
			foobarbaz :
			{
				// seriously, name these packages whatever you want to...
			},
			
			// startup is a special function that should be overridden here. This is the proper
			// place to wire up your application actors.
			startup : function( )
			{
				
			}
		} );

Context instances auto-startup by default. You can set the `autoStartup` property to false to disable this behavior,
which is useful for testing.

	var Context = Legs.Context.extend(
		{
			autoStartup : false,
			
			// ... other stuff
		} );

Disabling `autoStartup` will still call your startup routine, but it will not dispatch the `STARTUP_COMPLETE` event 
on the event bus. This way, if you want to test your actors and commands in-context, you can. When you're done testing,
you may either create a new instance of the context and override the `autoStartup` property, or you can call the `postStartup`
method directly:

	var Context = Legs.Context.extend(
		{
			autoStartup : false,
			
			// ... other stuff
		} );
	
	// create an instance that will auto-startup
	var app = Context.create( { autoStartup : true } );
	
	// OR
	
	// call postStartup manually
	var app = new Context( );
	
	app.postStartup( );

Contexts also come with a `contextView` property, which defaults to a [jquery][jquery] selector for the `document`.
You probably want to get more specific than this, so be sure to define your `contextView` in the context definition:

	var Context = Legs.Context.extend(
		{
			contextView : $( '#app-context' )
		} );

Again, you can override this value during your tests or whenever else.

	var Context = Legs.Context.extend(
		{
			contextView : $( '#app-context' )
		} );
	
	var instance = Context.create( { contextView : $( '#another-context' ) } );



## Dependencies

- [jQuery][jquery]

[robotlegs]: http://www.robotlegs.org/
[js-oo]: https://github.com/cj/js-oo
[klass]: http://www.dustindiaz.com/klass
[jquery]: http://jquery.com/
