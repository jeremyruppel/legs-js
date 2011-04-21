var TodosContext = Legs.Context.extend(
  {
    events :
    {
      TODO_ENTERED : 'todo entered'
    },
    
    commands :
    {
      CreateViewsCommand : Legs.Command.extend(
        {
          _contextView : 'contextview',
          _inputView   : 'input',
          _todosView   : 'todos',
          _statsView   : 'stats',
          execute      : function( )
          {
            this.contextView.append( '<h1>Todos</h1>' )
                            .append( this.inputView.element )
                            .append( this.todosView.element )
                            .append( this.statsView.element );
          }
        } ),
      
      AddTodoCommand : Legs.Command.extend(
        {
          _todos : 'todos',
          _todo : 'todo',
          execute : function( value )
          {
            this.todo.text( value );
            this.todos.add( this.todo );
          }
        } )
    },
    
    views : 
    {
      StatsView : Legs.Actor.extend(
        {
          element : $( '<div class="stats"/>' )
        } ),
      
      TodoView : Legs.Actor.extend(
        {
          template : '<li class="todo"><input type="checkbox"><div class="content"></div><div class="remove"/><input type="text"/></li>',
          
          initialize : function( )
          {
            this.element = $( this.template );
            
            this.input = $( 'input[type="text"]', this.element );
            this.content = $( 'div.content', this.element );
            
            this.element.dblclick( this.proxy( function( )
            {
              this.edit( );
            } ) );
            
            this.element.blur( this.proxy( function( )
            {
              this.display( );
            } ) );
            
            this.display( );
          },
          
          display : function( )
          {
            this.content.show( );
            this.input.hide( );
          },
          
          edit : function( )
          {
            this.content.hide( );
            this.input.show( );
          },
          
          text : function( )
          {
            if( arguments[ 0 ] )
            {
              this.input.val( arguments[ 0 ] );
              this.content.text( arguments[ 0 ] );
            }
            else
            {
              return this.input.val( );
            }
          }
        } ),
        
      TodosView : Legs.Actor.extend(
        {
          element : $( '<ul class="todos"/>' ),
          
          add : function( todo )
          {
            this.element.append( todo.element );
          }
        } ),
        
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
      this.injector.mapSingleton( 'input', this.views.InputView );
      
      this.injector.mapSingleton( 'todos', this.views.TodosView );
      
      this.injector.mapSingleton( 'stats', this.views.StatsView );
      
      this.injector.mapClass( 'todo', this.views.TodoView );
      
      this.commandMap.mapEvent( this.events.STARTUP_COMPLETE, this.commands.CreateViewsCommand );
      
      this.commandMap.mapEvent( this.events.TODO_ENTERED, this.commands.AddTodoCommand );
    }
  } );