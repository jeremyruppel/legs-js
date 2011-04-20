var TodosContext = Legs.Context.extend(
  {
    events :
    {
      TODO_ENTERED : 'todo entered'
    },
    
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
          _inputView   : 'input',
          execute      : function( )
          {
            this.contextView.append( '<h1>Todos</h1>' );
            
            this.contextView.append( this.inputView.element );
          }
        } ),
      
      AddTodoCommand : Legs.Command.extend(
        {
          execute : function( value )
          {
            console.log( value );
          }
        } )
    },
    
    views : 
    {
      InputView : Legs.Actor.extend(
        {
          element : $( '<input class="input"/>' ),
          
          initialize : function( )
          {
            this.element.click( this.proxy( function( )
            {
              this.clear( );
            } ) );
            
            this.element.blur( this.proxy( function( )
            {
              this.reset( );
            } ) );
            
            this.element.keydown( this.proxy( function( event )
            {
              if( event.which === 13 )
              {
                this.submit( );
              }
            } ) );
            
            this.reset( );
          },
          
          reset : function( )
          {
            this.element.val( 'What needs to be done?' );
          },
          
          clear : function( )
          {
            this.element.val( '' );
          },
          
          submit : function( )
          {
            this.trigger( this.events.TODO_ENTERED, this.element.val( ) );
          }
        } )
    },
    
    startup : function( )
    {
      this.injector.mapSingleton( 'todos', this.actors.Todos );
      
      this.injector.mapSingleton( 'input', this.views.InputView );
      
      this.commandMap.mapEvent( this.events.STARTUP_COMPLETE, this.commands.CreateViewsCommand );
    }
  } );