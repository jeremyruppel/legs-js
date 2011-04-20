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
        
        execute : function( command )
        {
          this.commandMap.execute( command );
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
  
  describe( 'application events', function( )
  {
    it( 'should have a todo entered event', function( )
    {
      expect( context.events.TODO_ENTERED ).toEqual( 'todo entered' );
    } );
  } );
  
  describe( 'application actors', function( )
  {
    describe( 'Todos collection', function( )
    {
      it( 'should be defined', function( )
      {
        expect( context.actors.Todos ).toBeDefined( );
      } );
      
      it( 'should be mapped in the injector', function( )
      {
        expect( context.has( 'todos' ) ).toBe( true );
      } );
      
      it( 'should be mapped to the correct class', function( )
      {
        expect( context.is( 'todos', context.actors.Todos ) ).toBe( true );
      } );
      
      it( 'should be an instance of Todos', function( )
      {
        expect( context.get( 'todos' ) ).toBeAnInstanceOf( context.actors.Todos );
      } );
      
      describe( 'instance methods', function( )
      {
        var todos;
        
        beforeEach( function( )
        {
          todos = context.get( 'todos' );
        } );
        
        describe( 'add', function( )
        {
          it( 'should be defined', function( )
          {
            expect( todos.add ).toBeType( 'function' );
          } );
        } );
      } );
    } );
  } );
  
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
    } );
  } );
  
  describe( 'application views', function( )
  {
    var view;
    
    beforeEach( function( )
    {
      context.execute( context.commands.CreateViewsCommand );
      
      view = context.get( 'input' );
    } );
    
    describe( 'input view', function( )
    {
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