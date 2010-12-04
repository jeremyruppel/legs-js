( function( $ )
{
	//-----------------------------------
	//  Namespace
	//-----------------------------------
	
	var Legs = this.Legs = { VERSION : '0.0.1' };
	
	Legs.Errors = 
	{
		// thrown when an event is declared with no type
		E_EVENT_NOTYPE : 'Events must have a string event type.',
		
		// thrown when a context is created with no context view
		E_CONTEXT_NOELEMENT : 'You must provide a context view element to the context.',
		
		// thrown when a context is created with no startup routine
		E_CONTEXT_NOSTARTUP : 'You must override the Context.Startup method.',
		
		// thrown when an injector mapping has not been mapped
		E_INJECTOR_NOMAP : 'Tried to retrieve an object from the injector when the factory has not been mapped.',
		
		// thrown when a factory is attempted to be mapped more than once
		E_INJECTOR_OVR : 'Tried to overwrite a mapping in the injector.',
		
		// thrown when trying to map an object that doesn't conform to our factory interface
		E_INJECTOR_NOTFACTORY : 'Tried to map an object that is not a factory.'
	};
	
	//-----------------------------------
	//  Utils
	//-----------------------------------
	
	Legs.Utils =
	{
		Mixin : function( target )
		{
			if( arguments.length > 1 )
			{
				var source;
				
				for( var i = 1; i < arguments.length; i++ )
				{
					source = arguments[ i ];
					
					for( var key in source )
					{
						if( key ) // shut up, jslint
						{
							target[ key ] = source[ key ];
						}
					}
				}
			}
		},
		
		Dictionary : function( )
		{
			this._mappings = [ ];

			this.put = function( key, value )
			{
				var mapping;
				
				for( var i = 0; i < this._mappings.length; i++ )
				{
					mapping = this._mappings[ i ];
					
					if( mapping.key === key )
					{
						mapping.value = value;
						
						return;
					}
				}
				
				this._mappings.push( { key : key, value : value } );
			};
			
			this.get = function( key )
			{
				var mapping;
				
				for( var i = 0; i < this._mappings.length; i++ )
				{
					mapping = this._mappings[ i ];
					
					if( mapping.key === key )
					{
						return mapping.value;
					}
				}
				
				return null;
			};
			
			this.has = function( key )
			{
				var mapping;
				
				for( var i = 0; i < this._mappings.length; i++ )
				{
					mapping = this._mappings[ i ];
					
					if( mapping.key === key )
					{
						return true;
					}
				}
				
				return false;
			};
			
			this.remove = function( key )
			{
				var mapping;
				
				for( var i = 0; i < this._mappings.length; i++ )
				{
					mapping = this._mappings[ i ];
					
					if( mapping.key === key )
					{
						this._mappings.splice( i, 1 );
					}
				}
			};
		},
		
		Element : function( selector )
		{
			var elementTag = /^\w+/.exec( selector ) || 'div';
			
			var elementId = /#([\w-_]+)/.exec( selector ) || null;
			
			var elementClass = /\.([\w-_]+)/.exec( selector ) || null;
			
			var element = document.createElement( elementTag );
			
			if( elementId && elementId.length > 1 )
			{
				element.id = elementId[ 1 ];
			}
			
			if( elementClass && elementClass.length > 1 )
			{
				element.className = elementClass[ 1 ];
			}
			
			return element;
		},
		
		IsFactory : function( object )
		{
			// for now, factories must be non-null and have a create method
			return null !== object && $.isFunction( object.create );
		}
	};
	
	//-----------------------------------
	//  Event
	//-----------------------------------
	
	Legs.Event = function( type, data )
	{
		if( !type )
		{
			throw new Error( Legs.Errors.E_EVENT_NOTYPE );
		}
		
		this.type = type;
		this.data = data;
	};
	
	//-----------------------------------
	//  EventDispatcher
	//-----------------------------------
	
	Legs.EventDispatcher = function( )
	{
		this._callbacks = { };
		
		this.listen = function( type, callback )
		{
			if( null === type || undefined === type )
			{
				throw new Error( Legs.Errors.E_EVENT_NOTYPE );
			}
			
			var callbacks = this._callbacks[ type ] || ( this._callbacks[ type ] = [ ] );
			
			if( callbacks.indexOf( callback ) == -1 )
			{
				callbacks.push( callback );
			}
		};
		
		this.unlisten = function( type, callback )
		{
			if( null === type || undefined === type )
			{
				throw new Error( Legs.Errors.E_EVENT_NOTYPE );
			}
			
			var callbacks = this._callbacks[ type ] || [ ];
			
			for( var i = 0; i < callbacks.length; i++ )
			{
				if( callbacks[ i ] == callback )
				{
					callbacks.splice( i, 1 );
				}
			}
		};
		
		this.dispatch = function( event )
		{
			var callbacks = this._callbacks[ event.type ] || [ ];
			
			for( var i = 0; i < callbacks.length; i++ )
			{
				callbacks[ i ].call( this, event );
			}
		};
	};
	
	//-----------------------------------
	//  Event Map
	//-----------------------------------
	
	Legs.EventMap = function( context )
	{
		this._mappings = [ ];
		
		this.map = function( selector, type, handler )
		{
			handler = $.proxy( handler, context );
			
			selector.live( type, handler );
			
			this._mappings.push( { selector : selector, type : type, handler : handler } );
		};
		
		this.unmap = function( selector, type, handler )
		{
			selector.die( type, handler );
			
			for( var i = 0; i < this._mappings.length; i++ )
			{
				var mapping = this._mappings[ i ];
				
				if( mapping.selector == selector && mapping.type == type && mapping.handler == handler )
				{
					this._mappings.splice( i, 1 );
				}
			}
		};
		
		this.unmapAll = function( )
		{
			while( this._mappings.length )
			{
				var mapping = this._mappings.pop( );
				
				mapping.selector.die( mapping.type, mapping.handler );
			}
		};
	};
	
	//-----------------------------------
	//  Command Map
	//-----------------------------------
	
	Legs.CommandMap = function( EventDispatcher )
	{		
		this.MapEvent = function( type, command )
		{
			EventDispatcher.listen( type, function( event )
			{
				var dispatch = function( event )
				{
					EventDispatcher.dispatch( event );
				};
				
				command.apply( this, [ event, dispatch ] );
			} );
		};
	};
	
	//-----------------------------------
	//  Injector
	//-----------------------------------
	
	Legs.Injector = function( EventDispatcher, Events )
	{
		/*
			TODO use Legs.Utils.Dictionary
		*/
		this._mappings = [ ];
		
		var dispatch = function( event )
		{
			EventDispatcher.dispatch( event );
		};
		
		this.MapSingleton = function( factory )
		{
			if( !Legs.Utils.IsFactory( factory ) )
			{
				throw new Error( Legs.Errors.E_INJECTOR_NOTFACTORY );
			}
			
			for( var i = 0; i < this._mappings.length; i++ )
			{
				if( this._mappings[ i ].factory === factory )
				{
					throw new Error( Legs.Errors.E_INJECTOR_OVR );
				}
			}
			
			this._mappings.push( { factory : factory, create : function( )
				{
					var instance = factory.create( Events, dispatch );
					
					this.create = function( )
					{
						return instance;
					};
					
					return instance;
				} } );
		};
		
		this.MapClass = function( factory )
		{
			if( !Legs.Utils.IsFactory( factory ) )
			{
				throw new Error( Legs.Errors.E_INJECTOR_NOTFACTORY );
			}
			
			for( var i = 0; i < this._mappings.length; i++ )
			{
				if( this._mappings[ i ].factory === factory )
				{
					throw new Error( Legs.Errors.E_INJECTOR_OVR );
				}
			}
			
			this._mappings.push( { factory : factory, create : function( )
				{
					return factory.create( Events, dispatch );
				} } );
		};
		
		this.Get = function( factory )
		{
			for( var i = 0; i < this._mappings.length; i++ )
			{
				if( this._mappings[ i ].factory === factory )
				{
					return this._mappings[ i ].create( );
				}
			}
			
			throw new Error( Legs.Errors.E_INJECTOR_NOMAP );
		};
		
		this.Has = function( factory )
		{
			for( var i = 0; i < this._mappings.length; i++ )
			{
				if( this._mappings[ i ].factory === factory )
				{
					return true;
				}
			}
			
			return false;
		};
	};
	
	//-----------------------------------
	//  Mediator Map
	//-----------------------------------
	
	Legs.MediatorMap = function( ContextView, Injector )
	{
		this._views = new Legs.Utils.Dictionary( );
		
		this._mediators = new Legs.Utils.Dictionary( );
		
		this.MapView = function( viewFactory, mediatorFactory )
		{
			// if the user wants to 'singletonize' the view, go ahead
			if( !Injector.Has( viewFactory ) )
			{
				Injector.MapClass( viewFactory );
			}
			
			// can have the same mediator factory for multiple views
			if( !Injector.Has( mediatorFactory ) )
			{
				Injector.MapClass( mediatorFactory );
			}
			
			var views = this._views;
			
			var mediators = this._mediators;
			
			$( viewFactory.selector, ContextView ).livequery( 
				function( ) // on view added
				{
					var view = Injector.Get( viewFactory );
					
					var mediator = Injector.Get( mediatorFactory );
				
					view.element = this;
					
					view.createChildren( );
				
					views.put( this, view );
				
					mediators.put( this, mediator );
				
					mediator.onregister.call( mediator, view );
				},
				function( ) // on view removed
				{
					var view = views.get( this );
					
					var mediator = mediators.get( this );

					mediator.onremove.call( mediator, view );
					
					views.remove( this );
					
					mediators.remove( this );
				} );
		};
	};
	
	//-----------------------------------
	//  Context
	//-----------------------------------
	
	Legs.ContextBase = 
	{
		Events :
		{
			CLICK : 'click',
			DOUBLE_CLICK : 'dblclick',
			BLUR : 'blur',
			KEY_PRESS : 'keypress',
			KEY_UP : 'keyup',
			
			// dispatched when context has finished its startup routine
			STARTUP_COMPLETE : 'Legs.Events.StartupComplete'
		}
	};
	
	Legs.Context = function( context, options )
	{
		if( !context )
		{
			throw new Error( Legs.Errors.E_CONTEXT_NOELEMENT );
		}
		
		// store the context view
		this.ContextView = context;
		
		// default events namespace
		this.Events = { };
		
		// default actors namespace
		this.Actors = { };
		
		// startup method - must be overridden
		this.Startup = function( ){ throw new Error( Legs.Errors.E_CONTEXT_NOSTARTUP ); };
		
		// mix in the provided context
		Legs.Utils.Mixin( this, options );
		
		// mix in our context base afterwards
		Legs.Utils.Mixin( this.Events, Legs.ContextBase.Events );
		
		// default event dispatcher implementation
		this.EventDispatcher = new Legs.EventDispatcher( );
		
		// default command map implementation
		this.CommandMap = new Legs.CommandMap( this.EventDispatcher );
		
		// default injector implementation
		this.Injector = new Legs.Injector( this.EventDispatcher, this.Events );
		
		// default mediator map implementation
		this.MediatorMap = new Legs.MediatorMap( this.ContextView, this.Injector );
		
		// startup so the context can wire everything up with commands
		this.Startup( this.Events, this.CommandMap, this.Actors, this.Injector, this.MediatorMap, this.ContextView );
		
		// dispatch our startup complete event
		this.EventDispatcher.dispatch( new Legs.Event( this.Events.STARTUP_COMPLETE ) );
	};
	
	//-----------------------------------
	//  Model
	//-----------------------------------
	
	Legs.Actor = function( factory )
	{
	};
	
	Legs.Model = function( assembly )
	{
		this.create = function( Events, dispatch )
		{
			var prototype = new Legs.Actor( this );
			
			if( !dispatch )
			{
				Legs.Utils.Mixin( prototype, new Legs.EventDispatcher( ) );
				
				dispatch = function( event )
				{
					prototype.dispatch( event );
				};
			}
			
			assembly.apply( prototype, [ Events, dispatch ] );
			
			return prototype;
		};
	};
	
	Legs.Mediator = function( assembly )
	{
		this.create = function( Events, dispatch )
		{
			var prototype = new Legs.Actor( this );
			
			Legs.Utils.Mixin( prototype, 
				{
					events : new Legs.EventMap( prototype ),
					
					onregister : function( view )
					{
					},
					
					onremove : function( view )
					{
						this.events.unmapAll( );
					}
				} );
			
			assembly.apply( prototype, [ Events, dispatch ] );
			
			return prototype;
		};
	};
	
	Legs.View = function( selector, children, render )
	{
		this.selector = selector;
		
		this.createElement = function( )
		{
			return Legs.Utils.Element( selector );
		};
		
		this.create = function( Events, dispatch )
		{
			var prototype = new Legs.Actor( this );
			
			Legs.Utils.Mixin( prototype,
				{
					selector : selector,
					
					/*
						TODO need to automatically create element? would this be unnecessary and expensive?
					*/
					element : this.createElement( ),
					
					createChildren : function( )
					{
						this.root = $( this.element );
						
						for( var child in children )
						{
							if( child ) // shut up, jslint
							{
								this[ child ] = $( children[ child ], this.root );
							}
						}
						
						return this;
					}
				} );
				
			prototype.render = function( data )
			{
				if( render )
				{
					render.call( this, data );
				}
				
				return this.createChildren( );
			};
				
			return prototype.createChildren( );
		};
	};
	
} )( jQuery );