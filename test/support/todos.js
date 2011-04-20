var TodosContext = Legs.Context.extend(
  {
    actors :
    {
      Todos : Legs.Actor.extend( )
    },
    
    startup : function( )
    {
      this.injector.mapSingleton( 'todos', this.actors.Todos );
    }
  } );