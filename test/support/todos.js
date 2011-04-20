var TodosContext = Legs.Context.extend(
  {
    actors :
    {
      Todos : Legs.Actor.extend( 
        {
          add : function( )
          {
            
          }
        } )
    },
    
    commands :
    {
      CreateViewsCommand : Legs.Command.extend(
        {
          _contextView : 'contextview',
          execute : function( )
          {
            this.contextView.append( '<h1>Todos</h1>' );
          }
        } )
    },
    
    startup : function( )
    {
      this.injector.mapSingleton( 'todos', this.actors.Todos );
      
      
      this.commandMap.mapEvent( this.events.STARTUP_COMPLETE, this.commands.CreateViewsCommand );
    }
  } );