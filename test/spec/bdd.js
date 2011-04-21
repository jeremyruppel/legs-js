describe( 'a sample todos application', function( )
{
  //-----------------------------------
  //  Setup
  //-----------------------------------
  
  var context;
  
  beforeEach( function( )
  {
    Legs.Context.include(
      {
        has : function( name )
        {
          return this.injector.hasMapping( name );
        },
        
        is : function( name, clazz )
        {
          return this.injector.getInstance( name ) instanceof clazz;
        },
        
        get : function( name )
        {
          return this.injector.getInstance( name );
        },
        
        maps : function( event, command )
        {
          return this.commandMap.hasEventCommand( event, command );
        },
        
        execute : function( )
        {
          this.commandMap.execute.apply( this.commandMap, arguments );
        },
        
        find : function( selector )
        {
          return $( selector, this.contextView );
        }
      } );
    
    context = TodosContext.create( { autoStartup : false, contextView : $( '#context' ) } );
  } );
  
  afterEach( function( )
  {
    context.contextView.empty( );
  } );
  
  //-----------------------------------
  //  Context
  //-----------------------------------
  
  describe( 'application context', function( )
  {
    it( 'should be defined on the global scope', function( )
    {
      expect( TodosContext ).toBeDefined( );
    } );
    
    it( 'should be able to be instantiated', function( )
    {
      expect( context ).toBeType( 'object' );
    } );
    
    it( 'should be a subclass of Legs.Context', function( )
    {
      expect( context ).toBeAnInstanceOf( Legs.Context );
    } );
    
    it( 'should not auto startup during these tests', function( )
    {
      expect( context.autoStartup ).toBe( false );
    } );
  } );
  
  //-----------------------------------
  //  Events
  //-----------------------------------
  
  describe( 'application events', function( )
  {
    it( 'should have a todo entered event', function( )
    {
      expect( context.events.TODO_ENTERED ).toEqual( 'todo entered' );
    } );
  } );
  
  //-----------------------------------
  //  Actors
  //-----------------------------------
  
  describe( 'application actors', function( )
  {

  } );
  
  //-----------------------------------
  //  Commands
  //-----------------------------------
  
  describe( 'application commands', function( )
  {
    describe( 'CreateViewsCommand', function( )
    {
      it( 'should be defined', function( )
      {
        expect( context.commands.CreateViewsCommand ).toBeDefined( );
      } );
      
      it( 'should be mapped to the startup complete event', function( )
      {
        expect( context.maps( context.events.STARTUP_COMPLETE, context.commands.CreateViewsCommand ) ).toBe( true );
      } );
      
      it( 'should create the title of the app', function( )
      {
        expect( context.find( 'h1' ).length ).toEqual( 0 );
        
        context.execute( context.commands.CreateViewsCommand );
        
        expect( context.find( 'h1' ).length ).toEqual( 1 );
      } );
      
      it( 'should put the right text in the title', function( )
      {
        context.execute( context.commands.CreateViewsCommand );
        
        expect( context.find( 'h1' ).text( ) ).toEqual( 'Todos' );
      } );
      
      it( 'should create the input view', function( )
      {
        expect( context.find( '.input' ).length ).toEqual( 0 );
        
        context.execute( context.commands.CreateViewsCommand );
        
        expect( context.find( '.input' ).length ).toEqual( 1 );
      } );
      
      it( 'should create the todos view', function( )
      {
        expect( context.find( '.todos' ).length ).toEqual( 0 );
        
        context.execute( context.commands.CreateViewsCommand );
        
        expect( context.find( '.todos' ).length ).toEqual( 1 );
      } );
      
      it( 'should create the stats view', function( )
      {
        expect( context.find( '.stats' ).length ).toEqual( 0 );
        
        context.execute( context.commands.CreateViewsCommand );
        
        expect( context.find( '.stats' ).length ).toEqual( 1 );
      } );
    } );
    
    describe( 'AddTodoCommand', function( )
    {
      it( 'should be defined', function( )
      {
        expect( context.commands.AddTodoCommand ).toBeDefined( );
      } );
      
      it( 'should be mapped to the todo entered event', function( )
      {
        expect( context.maps( context.events.TODO_ENTERED, context.commands.AddTodoCommand ) );
      } );
      
      it( 'should call the todo lists add method', function( )
      {
        var todos = context.get( 'todos' );
        
        spyOn( todos, 'add' );
        
        context.execute( context.commands.AddTodoCommand, 'buy some beers' );
        
        expect( todos.add ).toHaveBeenCalled( );
      } );
      
      it( 'should call the add method with a todo instance', function( )
      {
        var todos = context.get( 'todos' );
        
        spyOn( todos, 'add' );
        
        context.execute( context.commands.AddTodoCommand, 'buy some beers' );
        
        var todo = todos.add.mostRecentCall.args[ 0 ];
        
        expect( todo ).toBeAnInstanceOf( context.views.TodoView );
      } );
      
      it( 'should set the new todos text appropriately', function( )
      {
        var todos = context.get( 'todos' );
        
        spyOn( todos, 'add' );
        
        context.execute( context.commands.AddTodoCommand, 'buy some beers' );
        
        var todo = todos.add.mostRecentCall.args[ 0 ];
        
        expect( todo.text( ) ).toEqual( 'buy some beers' );
      } );
    } );
  } );
  
  //-----------------------------------
  //  Views
  //-----------------------------------
  
  describe( 'application views', function( )
  {
    //-----------------------------------
    //  Stats View
    //-----------------------------------
    
    describe( 'stats view', function( )
    {
      var view;
      
      beforeEach( function( )
      {
        context.execute( context.commands.CreateViewsCommand );
        
        view = context.get( 'stats' );
      } );
      
      it( 'should be defined', function( )
      {
        expect( context.views.StatsView ).toBeDefined( );
      } );
      
      it( 'should be mapped in the injector', function( )
      {
        expect( context.has( 'stats' ) ).toBe( true );
      } );
      
      it( 'should be mapped to the correct class', function( )
      {
        expect( context.is( 'stats', context.views.StatsView ) ).toBe( true );
      } );
    } );
    
    //-----------------------------------
    //  Todo View
    //-----------------------------------
    
    describe( 'todo view', function( )
    {
      var view;
      
      beforeEach( function( )
      {
        view = context.get( 'todo' );
        
        context.contextView.append( view.element );
      } );
      
      it( 'should be defined', function( )
      {
        expect( context.views.TodoView ).toBeDefined( );
      } );
      
      it( 'should be mapped in the injector', function( )
      {
        expect( context.has( 'todo' ) ).toBe( true );
      } );
      
      it( 'should be mapped to the correct class', function( )
      {
        expect( context.is( 'todo', context.views.TodoView ) ).toBe( true );
      } );
      
      describe( 'instantiation', function( )
      {
        it( 'should create an element when instantiated', function( )
        {
          expect( view.element ).toBeAnInstanceOf( $ );
        } );
        
        it( 'should create a different element for each instance', function( )
        {
          var next = context.get( 'todo' );
          
          expect( next ).not.toBe( view );
          
          expect( next.element[ 0 ] ).not.toBe( view.element[ 0 ] );
        } );
        
        it( 'should hide the input div by default', function( )
        {
          expect( view.input ).not.toBeVisible( );
        } );
        
        it( 'should show the content div by default', function( )
        {
          expect( view.content ).toBeVisible( );
        } );
      } );
      
      describe( 'child nodes', function( )
      {
        it( 'should have an input child', function( )
        {
          expect( view.input ).toBe( 'input[type="text"]' );
        } );
        
        it( 'should have a content child', function( )
        {
          expect( view.content ).toBe( 'div.content' );
        } );
      } );
      
      describe( 'event handling', function( )
      {
        it( 'should call edit when double clicked', function( )
        {
          spyOn( view, 'edit' );
          
          view.element.dblclick( );
          
          expect( view.edit ).toHaveBeenCalled( );
        } );
        
        it( 'should call display when blurred', function( )
        {
          spyOn( view, 'display' );
          
          view.element.blur( );
          
          expect( view.display ).toHaveBeenCalled( );
        } );
      } );
      
      describe( 'instance methods', function( )
      {
        describe( 'edit', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.edit ).toBeType( 'function' );
          } );
          
          it( 'should show the input div', function( )
          {
            view.edit( );
            
            expect( view.input ).toBeVisible( );
          } );
          
          it( 'should hide the display div', function( )
          {
            view.edit( );
            
            expect( view.content ).not.toBeVisible( );
          } );
        } );
        
        describe( 'display', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.display ).toBeType( 'function' );
          } );
          
          it( 'should show the display div', function( )
          {
            view.display( );
            
            expect( view.content ).toBeVisible( );
          } );
          
          it( 'should hide the input div', function( )
          {
            view.display( );
            
            expect( view.input ).not.toBeVisible( );
          } );
        } );
        
        describe( 'toggling', function( )
        {
          it( 'should toggle the visibility of the input and content children', function( )
          {
            view.display( );
            
            expect( view.content ).toBeVisible( );
            expect( view.input ).not.toBeVisible( );
            
            view.edit( );
            
            expect( view.content ).not.toBeVisible( );
            expect( view.input ).toBeVisible( );
            
            view.display( );
            
            expect( view.content ).toBeVisible( );
            expect( view.input ).not.toBeVisible( );
            
            view.edit( );
            
            expect( view.content ).not.toBeVisible( );
            expect( view.input ).toBeVisible( );
          } );
        } );
        
        describe( 'text', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.text ).toBeType( 'function' );
          } );
          
          it( 'should set the text of the input field when called with a value', function( )
          {
            view.text( 'sooper dooper' );
            
            expect( view.input.val( ) ).toEqual( 'sooper dooper' );
          } );
          
          it( 'should get the text of the input field when called without a value', function( )
          {
            view.input.val( 'sooper dooper' );
            
            expect( view.text( ) ).toEqual( 'sooper dooper' );
          } );
        } );
      } );
    } );
    
    //-----------------------------------
    //  Todos View
    //-----------------------------------
    
    describe( 'todos view', function( )
    {
      var view;
      
      beforeEach( function( )
      {
        context.execute( context.commands.CreateViewsCommand );
        
        view = context.get( 'todos' );
      } );
      
      it( 'should be defined', function( )
      {
        expect( context.views.TodosView ).toBeDefined( );
      } );
      
      it( 'should be mapped in the injector', function( )
      {
        expect( context.has( 'todos' ) ).toBe( true );
      } );
      
      it( 'should be mapped to the correct class', function( )
      {
        expect( context.is( 'todos', context.views.TodosView ) ).toBe( true );
      } );
      
      describe( 'instance methods', function( )
      {
        describe( 'add', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.add ).toBeType( 'function' );
          } );
          
          /*
            TODO write more specs here
          */
        } );
      } );
    } );
    
    //-----------------------------------
    //  Input View
    //-----------------------------------
    
    describe( 'input view', function( )
    {
      var view;

      beforeEach( function( )
      {
        context.execute( context.commands.CreateViewsCommand );

        view = context.get( 'input' );
      } );
      
      it( 'should be defined', function( )
      {
        expect( context.views.InputView ).toBeDefined( );
      } );
      
      it( 'should be mapped in the injector', function( )
      {
        expect( context.has( 'input' ) ).toBe( true );
      } );
      
      it( 'should be mapped to the correct class', function( )
      {
        expect( context.is( 'input', context.views.InputView ) ).toBe( true );
      } );
      
      it( 'should have the correct default text', function( )
      {
        expect( view.element.val( ) ).toEqual( 'What needs to be done?' );
      } );
      
      describe( 'event handling', function( )
      {
        it( 'should call clear when clicked', function( )
        {
          spyOn( view, 'clear' );

          view.element.click( );

          expect( view.clear ).toHaveBeenCalled( );
        } );

        it( 'should call reset when blurred', function( )
        {
          spyOn( view, 'reset' );

          view.element.blur( );

          expect( view.reset ).toHaveBeenCalled( );
        } );
        
        it( 'should call submit when enter is pressed', function( )
        {
          spyOn( view, 'submit' );

          view.element.trigger( { type : 'keydown', which : 13 } );
          
          expect( view.submit ).toHaveBeenCalled( );
        } );
        
        it( 'should not call submit when other keys are pressed', function( )
        {
          spyOn( view, 'submit' );
          
          view.element.trigger( { type : 'keydown', which : 12 } );
          view.element.trigger( { type : 'keydown', which : 45 } );
          view.element.trigger( { type : 'keydown', which : 14 } );
          
          expect( view.submit ).not.toHaveBeenCalled( );
        } );
      } );
      
      describe( 'instance methods', function( )
      {
        describe( 'reset', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.reset ).toBeType( 'function' );
          } );
          
          it( 'should display the correct text', function( )
          {
            view.reset( );
            
            expect( view.element.val( ) ).toEqual( 'What needs to be done?' );
          } );
          
          it( 'should set the correct text when called', function( )
          {
            view.element.val( 'wah wah wah' );
            
            view.reset( );
            
            expect( view.element.val( ) ).toEqual( 'What needs to be done?' );
          } );
        } );
        
        describe( 'clear', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.clear ).toBeType( 'function' );
          } );
          
          it( 'should display no text', function( )
          {
            view.clear( );
            
            expect( view.element.val( ) ).toEqual( '' );
          } );
          
          it( 'should set the correct text when called', function( )
          {
            view.element.val( 'wah wah wah' );
            
            view.clear( );
            
            expect( view.element.val( ) ).toEqual( '' );
          } );
        } );
        
        describe( 'submit', function( )
        {
          it( 'should be defined', function( )
          {
            expect( view.submit ).toBeType( 'function' );
          } );
          
          it( 'should trigger a todo entered event on the context', function( )
          {
            var spy = jasmine.createSpy( );
            
            context.events.bind( context.events.TODO_ENTERED, spy );
            
            view.submit( );
            
            expect( spy ).toHaveBeenCalled( );
          } );
          
          it( 'should pass the input value along with the event', function( )
          {
            var spy = jasmine.createSpy( );
            
            context.events.bind( context.events.TODO_ENTERED, spy );
            
            view.element.val( 'buy some beer' );
            
            view.submit( );
            
            expect( spy ).toHaveBeenCalledWith( 'buy some beer' );
          } );
        } );
      } );
    } );
    
  } );
} );