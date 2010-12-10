# Legs.js

A JavaScript homage to the [RobotLegs][robotlegs] micro-architecture.

## What Legs.js *is*

Legs.js, at the moment, isn't much more than an homage to the RobotLegs micro-architecture
for AS3. RobotLegs implemented some very powerful patterns and Legs.js is a proof-of-concept
of those same patterns working in JavaScript.

In the meantime, it's a good way to decouple, organize, and wire up your application.

## What Legs.js *isn't*

A dependency injection framework. Let's get serious.

Oh also, production ready. Until we hit that 1.0.0, use at your own risk.

## Main Concepts Borrowed from RobotLegs

- Single event bus to decouple framework actors
- Use of command pattern to encapsulate application actions
- Views paired with Mediators to translate user events into framework events
- Can configure actors to be 'singletonized' within the injector

## Legs.Context

Applications are built within a `Legs.Context`. In a context, you set up:

- The view element to house your application
- Your application's events
- Your application's actors
- All commands that determine how actors interact

A bare-bones context might look like this:

	new Legs.Context( $( '#app-context' ),
	{
		Events :
		{
			// all application events are defined here
		},
		Actors :
		{
			// framework actors are defined here
		},
		Startup : function( Events, CommandMap, Actors, Injector, MediatorMap, ContextView )
		{
			// all interaction goes here
		}
	} );

`Events` is a utility hash that should contain all of your event strings. 
This hash gets merged with the default event set and gets passed to every
actor instance and the startup routine. This helps to eliminate the 'magic
string' and will save you time in debugging event-driven applications.

`Actors` is a simple namespace for all of the actors in your application.
The main point of this is to set up your factories in a consistent way for
management later on. In JavaScript, however, there's an added benefit: actors
can't easily reference eachother \*.

*\* Initially, at least. This is JavaScript. There's nothing preventing you from doing that later on, I guess.*

`Startup` is the startup routine for the application. This is where you will
retrieve references to your actors and wire them up with commands. The main idea
is that almost all business logic in the application happens in small, reusable
commands. This keeps applications DRY! No one likes a soggy app.

## Legs.EventDispatcher and Legs.Event

At the heart of the Legs.js context is one `Legs.EventDispatcher`. All framework
actors get a reference to this event dispatcher's `dispatch` command so that they
can send events out into the application. Commands respond to those events and
determine the interaction between framework actors. Commands may also access the
`dispatch` method for command chaining.

`Legs.Event` is nothing more than a type and a payload. The general rule of thumb
is to always use as small and general of a payload as possible. In JavaScript, we
don't have compilers to check for the type of a payload, so be responsible!

## The Legs.CommandMap

The `Legs.CommandMap` wires event types dispatched off of the context's event dispatcher
to commands (which for the purpose of this document will be nothing more than anonymous
functions). Commands should be stateless and reusable, so short anonymous functions work
well for this purpose. They are, however, not portable or testable. For applications that
require lots of testing, especially commands, consider building your commands elsewhere.

Wiring commands to events in a context might look like this:

	Startup : function( Events, CommandMap, Actors, Injector, MediatorMap, ContextView )
	{
		CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event )
		{
			console.log( 'application has started up!' );
		} );
		
		CommandMap.MapEvent( Events.SOMETHING_IMPORTANT, function( event )
		{
			console.log( event.type );
			console.log( event.data );
		} );
	}

The `Events.STARTUP_COMPLETE` event is dispatched by the context after the startup method
has finished running. This is where you should introduce your first application logic.

## The Legs.Injector and Legs.Actor factories

Legs.js is not a dependency injection framework, but it does have a facility for managing
instances of your actors. I chose to keep the name injector as its function is similar
to what RobotLegs users are used to, though much more scaled back. The `Legs.Injector` is
responsible for managing your framework actors and providing them with access to the `Events`
object and the shared `dispatch` method. You configure your actors in the injector in the
startup routine like this:

	Startup : function( Events, CommandMap, Actors, Injector, MediatorMap, ContextView )
	{
		Injector.MapClass( Actors.SomeModel );
		
		Injector.MapSingleton( Actors.OnlyModel );
		
		CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event )
		{
			// mapped as factory, will get a new instance each time
			var many = Injector.Get( Actors.SomeModel );
			
			// mapped as 'singleton', will get the same instance each time
			var one = Injector.Get( Actors.OnlyModel );
		} );
	}

`Injector.MapClass` configures a class for 'injection'. You will get a new instance from the 
factory every time you request one.

`Injector.MapSingleton` configures a class for 'injection', but retains the first instance created.
You will get that same instance back every time.

`Injector.Get` retrieves an instance from the specified factory under the rule with which
it was mapped. The injector will throw an error if you try to retrieve an instance that has
not been mapped.

## Legs.Model

The default actor in Legs.js is a `Legs.Model`. Models don't really do much at the moment but provide
you a blank slate for a framework actor. They receive the `Events` object and the shared `dispatch`
object to use, but the rest is up to you. Basic interaction with a model could look like this:

	new Legs.Context( $( '#app-context' ),
	{
		Events :
		{
			MODEL_POKED : 'Model got poked'
		},
		Actors :
		{
			PokeModel : new Legs.Model( function( Events, dispatch )
			{
				this.poke = function( )
				{
					dispatch( new Legs.Event( Events.MODEL_POKED, 'payload' ) );
				}
			} );
		},
		Startup : function( Events, CommandMap, Actors, Injector, MediatorMap, ContextView )
		{
			Injector.MapSingleton( Actors.PokeModel );
			
			CommandMap.MapEvent( Events.STARTUP_COMPLETE, function( event )
			{
				var model = Injector.Get( Actors.PokeModel );
				
				model.poke( );
			} );
			
			CommandMap.MapEvent( Events.MODEL_POKED, function( event )
			{
				console.log( event.type ); // 'Model got poked'
				console.log( event.data ); // 'payload'
			} );
		}
	} );

For the time being, the bare-bones `Legs.Model` is the only implementation included in the core
library, but technically any factory validated by `Legs.Utils.IsFactory` can be substituted. The 
idea will be to write supplementary libraries for extending models with collection functionality,
builtin REST functionality, and more, and these can be plugged in seamlessly when necessary.

## Legs.View

Using `Legs.View` factory is the preferred way to identify and interact with HTML elements within
the application context. Each view factory is provided a selector to identify its element, a hash
for conveniently accessing sub-nodes as properties by selector, and optionally a `render` method.

A view could be created like this:

	new Legs.Context( $( '#app-context' ),
	{
		Events : { },
		
		Actors :
		{
			SomeView : new Legs.View( '.view-class',
			{
				input : '.input-box',
				submit : '#submit-button'
			},
			render( data )
			{
				// if your view is dynamic, you can render it with
				// your library of choice here
			} )
		},
		...
	} );

Views by themselves are not much more than identifiers and child-mappings. The real purpose of 
using `Legs.View` is to assign each view a `Legs.Mediator` to help it participate in the application.

## Legs.Mediator

A mediator is responsible for transforming a view's events into application events. Mediators, when
mapped in the `Legs.MediatorMap` will be registered and removed automatically whenever their view
is added or removed from the context view. Mediators, like models, receive the shared `Events` object
and `dispatch` method. They also come equipped with a utility class, `Legs.EventMap`, which allows
you to add listeners to your view which, by default, will all be cleaned up automatically when that 
view is removed from the context view. Mediating views looks like this:

	new Legs.Context( $( '#app-context' ),
	{
		Events :
		{
			INPUT_SUBMITTED : 'Input form submitted'
		},
		Actors :
		{
			InputView : new Legs.View( '#input',
			{
				input : '#input-text',
				submit : '#submit-button'
			} ),
			InputMediator : new Legs.Mediator( function( Events, dispatch )
			{
				this.onregister = function( view )
				{
					this.events.map( view.submit, Events.CLICK, function( )
					{
						dispatch( new Legs.Event( Events.INPUT_SUBMITTED, view.input.val( ) ) );
					} );
				};
			} )
		},
		Startup : function( Events, CommandMap, Actors, Injector, MediatorMap, ContextView )
		{
			MediatorMap.MapView( Actors.InputView, Actors.InputMediator );

			CommandMap.MapEvent( Events.INPUT_SUBMITTED, function( event )
			{
				console.log( event.type ); // 'Input form submitted'
				console.log( event.data ); // whatever was in the input text field
			} );
		}
	} );

Views and mediators mapped in the mediator map will get configured in the injector automatically.
If you'd like to map a view as a singleton in order to reference it directly in commands, you can 
do that by configuring it as such before mapping it to its mediator:

	Injector.MapSingleton( Actors.InputView );
	
	MediatorMap.MapView( Actors.InputView, Actors.InputMediator );
	
	...
	
	// later on, in a command
	var view = Injector.Get( Actors.InputView );

## Todo

- Decide if we're going with PascalCase or what. Code looks schizophrenic.

## Dependencies

- [jQuery][jquery] (>= 1.4.3)
- [Live Query][livequery] (>= 1.1.1)

[robotlegs]: https://github.com/robotlegs/robotlegs-framework "RobotLegs GitHub repo"
[jquery]: http://jquery.com/ "jQuery site"
[livequery]: http://docs.jquery.com/Plugins/livequery "Live Query plugin docs"