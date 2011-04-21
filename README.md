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

## Legs.Injector

Each context comes with its own `Legs.Injector`, which is the method by which framework entities can reference each other.
Dependencies are denoted as attributes on your actors prefixed with an underscore whose values are strings. When an injector
finds these, it will try to look up any types that have been mapped to that name and will create a new attribute on the actor
with the same attribute name, but without the underscore. Finally, injection mappings are created in the startup routine.
A simple command with a dependency on an actor will look like this:

	var Context = Legs.Context.extend(
		{
			actors :
			{
				MyActor : (Class definition here...)
			},
			commands :
			{
				MyCommand : Legs.Command.extend(
					{
						_foo : 'bar',
						
						execute : function( )
						{
							this.foo; // => an instance of MyActor
						}
					} )
			},
			startup : function( )
			{
				this.injector.mapClass( 'bar', this.actors.MyActor );
				
				this.commandMap.mapEvent( this.events.STARTUP_COMPLETE, this.commands.MyCommand );
			}
		} );

Here, `MyCommand` is mapped to the `STARTUP_COMPLETE` event and will fire once the context has finished starting up.
The command is automatically passed through the injector, and the injector finds the attribute `_foo`. `_foo` has a value
of `'bar'`, the name to which `MyActor` has been mapped. The injector will automatically create a new instance of `MyActor`
and place it on the command instance as `foo` (without the underscore).

The injector offers several types of mappings to configure how you want dependencies to be filled:

	- `mapValue` maps an instance or literal for injection. The value injected will be the same every time. It's useful for 
		application constants, like `this.injector.mapValue( 'host', 'http://localhost:3000' );`
	
	- `mapClass` maps a type or class for injection. The value injected will be a new instance of that class every time. All 
		dependencies on the created instance will be filled recursively. Use it when you will need a new instance of a class 
		for each actor that depends on it, like `this.injector.mapClass( 'validator', this.utils.Validator );`
	
	- `mapSingleton` is like `mapClass`, but once the instance is created, every other dependency will be filled with that 
		same instance. This is useful for when you only want one of something, like `this.injector.mapSingleton( 'service', this.services.Facebook )`

## Legs.Events

Each context has one event bus through which framework actors communicate. This differs from the idea of having every
framework actor be an event dispatcher. The idea here is that each framework actor can send an event out into the context,
you're not supposed to know where it came from. This approach decouples the sender from the receiver. 

## Legs.Actor

`Legs.Actor` is the base class for framework actors. An "actor" might be defined as any member of the application that may need to 
communicate back into the application via the event bus. All actors and subclasses come with a dependency on the context's event bus
as well as a sugar `trigger` method that will trigger an event on the context. Here's how a user model update method might work:

	User : Legs.Actor.extend(
		{
			update : function( attributes )
			{
				$.extend( this, attributes );
				
				this.trigger( this.events.USER_UPDATED );
			}
		} )

## Legs.Command

Commands can be thought of as one unit of work within the application. Commands are mapped to events that occur within the application,
and are created and executed as soon as that event type is triggered. Commands extend `Legs.Actor`, so they also have the ability to trigger
events on the context if they need to.

A `Legs.Command` should override the `execute` method. This method will be called automatically after all command dependencies have been filled.

	UpdateUserCommand : Legs.Command.extend(
		{
			_user : 'user', // assumes 'user' has been mapped in the injector
			
			execute : function( attributes )
			{
				this.user.update( attributes );
			}
		} )

The `execute` method will be called with all payload values that come with the event. Commands are stateless, and can be considered discarded
after they have executed. If the event occurs again in the application, a new instance of the mapped command will be created and executed.

## Legs.CommandMap

The command map is the mechanism for mapping commands to events in an application. A simple command can be mapped to the `STARTUP_COMPLETE`
event of a context like this:

	var Context = Legs.Context.extend(
		{
			commands :
			{
				StartupCompleteCommand : Legs.Command.extend(
					{
						execute : function( )
						{
							alert( 'all started up, yo' );
						}
					} )
			},
			startup : function( )
			{
				this.commandMap.mapEvent( this.events.STARTUP_COMPLETE, this.commands.StartupCompleteCommand );
			}
		} );

`commandMap.mapEvent` takes an optional third parameter `oneShot`, which if true will automatically unmap the command after it has been
executed once.

## Testing with legs-js

**TODO**

## Dependencies

- [jQuery][jquery]

[robotlegs]: http://www.robotlegs.org/
[js-oo]: https://github.com/cj/js-oo
[klass]: http://www.dustindiaz.com/klass
[jquery]: http://jquery.com/
