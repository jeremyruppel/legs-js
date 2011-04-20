( function( $ )
{
  //-----------------------------------
  //  Core
  //-----------------------------------
  
  var Legs = this.Legs = { VERSION : '0.0.1' };
  
  //-----------------------------------
  //  Class
  //-----------------------------------
  
  Legs.Class = function( )
  {
    // Set up a placeholder constructor
    this.initialize = function( )
    {
    };
    
    // Sugar method to proxy another function in this scope
    this.proxy = function( method )
    {
      return $.proxy( method, this );
    };
  };
  
  Legs.Class.extend = function( attributes )
  {
    // Create the new class
    var New = function( )
    {
      this.initialize.apply( this, arguments );
    };
    
    // Clone this extend method
    New.extend = this.extend;
    
    // Clone this create method
    New.create = this.create;
    
    // Clone this include method
    New.include = this.include;
    
    // Begin building the prototype off of this class
    var prototype = new this( );
    
    // Set all of the properties on the prototype
    $.extend( true, prototype, attributes );
    
    // Set the prototype appropriately
    New.prototype = prototype;
    
    // Return the new class
    return New;
  };
  
  Legs.Class.create = function( attributes )
  {
    return new ( this.extend( attributes ) )( );
  };
  
  Legs.Class.include = function( attributes )
  {
    $.extend( true, this.prototype, attributes );
  };
    
  //-----------------------------------
  //  Events
  //-----------------------------------
  
  Legs.Events = Legs.Class.extend(
    {
      initialize : function( )
      {
        this.mappings = { };
        
        this.STARTUP_COMPLETE = 'startup complete';
      },
      
      callbacks : function( type )
      {
        return this.mappings[ type ] || ( this.mappings[ type ] = [ ] );
      },
      
      bind : function( type, callback )
      {
        this.callbacks( type ).push( callback );
      },
      
      unbind : function( type, callback )
      {
        var callbacks = this.callbacks( type );
        
        var index = $.inArray( callback, callbacks );
        
        if( index > -1 )
        {
          callbacks.splice( index, 1 );
        }
      },
      
      trigger : function( type )
      {
        var args = $.makeArray( arguments );
        
        $( this.callbacks( args.shift( ) ) ).each( function( index, callback )
        {
          callback.apply( null, args );
        } );
      }
    } );
    
  //-----------------------------------
  //  Injector
  //-----------------------------------
  
  Legs.Injector = Legs.Class.extend(
    {
      initialize : function( )
      {
        this.mappings = { };
      },
      
      mapValue : function( name, value )
      {
        this.mappings[ name ] = ( function( )
        {
          return value;
        } );
      },
      
      mapClass : function( name, clazz )
      {
        this.mappings[ name ] = ( function( )
        {
          return new clazz( );
        } );
      },
      
      mapSingleton : function( name, clazz )
      {
        this.mappings[ name ] = ( function( )
        {
          var instance = new clazz( );
          
          this.mapValue( name, instance );
          
          return instance;
        } );
      },
      
      injectInto : function( subject )
      {
        for( var attribute in subject )
        {
          if( /^_/.test( attribute ) && $.type( subject[ attribute ] ) === 'string' )
          {
            subject[ attribute.substr( 1 ) ] = this.getInstance( subject[ attribute ] );
          }
        }
        
        return subject;
      },
      
      getInstance : function( name )
      {
        if( !this.mappings.hasOwnProperty( name ) )
        {
          throw new Error( 'Legs.Injector cannot find any mapping named "' + name + '".' );
        }
        
        return this.injectInto( this.mappings[ name ].call( this ) );
      },
      
      hasMapping : function( name )
      {
        return this.mappings.hasOwnProperty( name );
      }
    } );
  
  //-----------------------------------
  //  Base
  //-----------------------------------
  
  Legs.Base = Legs.Class.extend(
    {
      _events   : 'events',
      _injector : 'injector',
      trigger   : function( )
      {
        this.events.trigger.apply( this.events, arguments );
      }
    } );
  
  //-----------------------------------
  //  Actor
  //-----------------------------------
  
  Legs.Actor = Legs.Base.extend(
    {
    } );
  
  //-----------------------------------
  //  Command
  //-----------------------------------
  
  Legs.Command = Legs.Base.extend(
    {
      execute : function( )
      {
      }
    } );
  
  //-----------------------------------
  //  Command Map
  //-----------------------------------
  
  Legs.CommandMap = Legs.Class.extend(
    {
      initialize : function( events, injector )
      {
        this.events   = events;
        this.injector = injector;
        /*
          TODO add super( ) support to Legs.Class
        */
        this.mappings = { };
      },
      
      /*
        TODO create superclass and share this method with Legs.Events
      */
      callbacks : function( type )
      {
        return this.mappings[ type ] || ( this.mappings[ type ] = [ ] );
      },
      
      mapEvent : function( type, commandClass, oneShot )
      {
        var callback = function( )
        {
          var command = this.injector.injectInto( new commandClass( ) );
          
          if( oneShot === true )
          {
            this.unmapEvent( type, commandClass );
          }
          
          command.execute.apply( command, arguments );
        };
        
        var mapping = 
        {
          commandClass : commandClass,
          callback     : this.proxy( callback )
        };
        
        this.callbacks( type ).push( mapping );
        
        this.events.bind( type, mapping.callback );
      },
      
      unmapEvent : function( type, commandClass )
      {
        var mappings = this.callbacks( type );
        
        $( mappings ).each( this.proxy( function( index, mapping )
        {
          if( mapping.commandClass === commandClass )
          {
            mappings.splice( index, 1 );
            
            this.events.unbind( type, mapping.callback );
          }
        } ) );
      },
      
      hasEventCommand : function( type, commandClass )
      {
        var mappings = this.callbacks( type );
        
        for( var i = 0; i < mappings.length; i++ )
        {
          if( mappings[ i ].commandClass === commandClass )
          {
            return true;
          }
        }
        
        return false;
      },
      
      execute : function( )
      {
        var args = $.makeArray( arguments );
        
        var commandClass = args.shift( );
        
        var command = this.injector.injectInto( new commandClass( ) );
        
        command.execute.apply( command, args );
      }
    } );
    
  //-----------------------------------
  //  Context
  //-----------------------------------
  
  Legs.Context = Legs.Class.extend(
    {
      contextView : $( document ),
      
      initialize : function( )
      {
        // Merge in any user defined events
        this.events = Legs.Events.create( this.events );
        /*
          TODO would be nice to have *all* of these use the create( ) factory method
        */
        this.injector = new Legs.Injector( );
        this.commandMap = new Legs.CommandMap( this.events, this.injector );
        
        this.startup( );
        
        this.mapInjections( );
        
        if( this.autoStartup )
        {
          this.postStartup( );
        }
      },
      
      startup : function( )
      {
      },
      
      postStartup : function( )
      {
        this.events.trigger( this.events.STARTUP_COMPLETE );
      },
      
      autoStartup : true,
      
      mapInjections : function( )
      {
        this.injector.mapValue( 'events', this.events );
        this.injector.mapValue( 'injector', this.injector );
        this.injector.mapValue( 'commandmap', this.commandMap );
        this.injector.mapValue( 'contextview', this.contextView );
      }
    } );
  
} )( jQuery );