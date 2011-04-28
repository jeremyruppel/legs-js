describe( 'Legs.Injector', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Injector ).toBeDefined( );
  } );
  
  it( 'should be a function', function( )
  {
    expect( Legs.Injector ).toBeType( 'function' );
  } );
  
  it( 'should be able to be instantiated', function( )
  {
    expect( ( new Legs.Injector( ) ) ).toBeType( 'object' );
  } );
  
  it( 'should be an instance of Legs.Class', function( )
  {
    expect( new Legs.Injector( ) ).toBeAnInstanceOf( Legs.Class );
  } );
  
  describe( 'instance methods', function( )
  {
    var injector;
    
    beforeEach( function( )
    {
      injector = new Legs.Injector( );
    } );
    
    describe( 'mapValue', function( )
    {
      it( 'should be an instance method', function( )
      {
        expect( injector.mapValue ).toBeType( 'function' );
      } );
      
      it( 'should create a new mapping', function( )
      {
        expect( injector.hasMapping( 'test' ) ).toBe( false );
        
        injector.mapValue( 'test', 123 );
        
        expect( injector.hasMapping( 'test' ) ).toBe( true );
      } );
      
      it( 'should be able to retrieve the value', function( )
      {
        injector.mapValue( 'test', 123 );
        
        expect( injector.getInstance( 'test' ) ).toEqual( 123 );
      } );
      
      it( 'should retrieve the same value every time', function( )
      {
        var value = { };
        
        injector.mapValue( 'test', value );
        
        var one = injector.getInstance( 'test' );
        var two = injector.getInstance( 'test' );

        expect( one ).toBe( two );
      } );
      
      describe( 'mapClass', function( )
      {
        var User;

        beforeEach( function( )
        {
          User = Legs.Class.extend( );
        } );

        it( 'should be an instance method', function( )
        {
          expect( injector.mapClass ).toBeType( 'function' );
        } );

        it( 'should create a new mapping', function( )
        {
          expect( injector.hasMapping( 'test' ) ).toBe( false );

          injector.mapClass( 'test', User );

          expect( injector.hasMapping( 'test' ) ).toBe( true );
        } );

        it( 'should create a new instance when retrieving the value', function( )
        {
          injector.mapClass( 'test', User );

          var user = injector.getInstance( 'test' );

          expect( user ).toBeAnInstanceOf( User );
        } );

        it( 'should create a new instance every time', function( )
        {
          injector.mapClass( 'test', User );

          var one = injector.getInstance( 'test' );
          var two = injector.getInstance( 'test' );

          expect( one ).not.toBe( two );
        } );
      } );

      describe( 'mapSingleton', function( )
      {
        var User;
        
        beforeEach( function( )
        {
          User = Legs.Class.extend( );
        } );
        
        it( 'should be an instance method', function( )
        {
          expect( injector.mapSingleton ).toBeType( 'function' );
        } );

        it( 'should create a new mapping', function( )
        {
          expect( injector.hasMapping( 'test' ) ).toBe( false );
          
          injector.mapSingleton( 'test', User );
          
          expect( injector.hasMapping( 'test' ) ).toBe( true );
        } );
        
        it( 'should create a new instance when retrieving the value', function( )
        {
          injector.mapSingleton( 'test', User );
          
          var user = injector.getInstance( 'test' );
          
          expect( user ).toBeAnInstanceOf( User );
        } );
        
        it( 'should yield the same instance every time', function( )
        {
          injector.mapSingleton( 'test', User );

          var one = injector.getInstance( 'test' );
          var two = injector.getInstance( 'test' );

          expect( one ).toBe( two );
        } );
        
        it( 'should only instantiate the new instance on demand', function( )
        {
          var spy = jasmine.createSpy( );
          
          var Class = Legs.Class.extend( { initialize : spy } );
          
          injector.mapSingleton( 'test', Class );
          
          expect( spy ).not.toHaveBeenCalled( );
          
          var instance = injector.getInstance( 'test' );
          
          expect( spy ).toHaveBeenCalled( );
        } );
        
        it( 'should only instantiate the new instance once', function( )
        {
          var spy = jasmine.createSpy( );
          
          var Class = Legs.Class.extend( { initialize : spy } );
          
          injector.mapSingleton( 'test', Class );
          
          expect( spy.callCount ).toEqual( 0 );
          
          var instance = injector.getInstance( 'test' );
          
          expect( spy.callCount ).toEqual( 1 );
        } );
      } );

      describe( 'injectInto', function( )
      {
        var User;
        
        beforeEach( function( )
        {
          User = Legs.Class.extend( { _comment : 'string' } );
        } );
        
        it( 'should be an instance method', function( )
        {
          expect( injector.injectInto ).toBeType( 'function' );
        } );
        
        it( 'should the object passed to it', function( )
        {
          var subject = { };
          
          expect( injector.injectInto( subject ) ).toBe( subject );
        } );

        it( 'should fill dependencies marked with an underscore', function( )
        {
          injector.mapValue( 'string', 'baller status' );
          
          var user = injector.injectInto( new User( ) );
          
          expect( user.comment ).toEqual( 'baller status' );
        } );
        
        it( 'should raise an error if no mapping can be found for a dependency', function( )
        {
          expect( injector.hasMapping( 'string' ) ).toBe( false );
          
          expect( function( )
          {
            var user = injector.injectInto( new User( ) );
          }
          ).toThrow( 'Legs.Injector cannot find any mapping named "string".' );
        } );
        
        it( 'should not try to inject into attributes whose value is not a string', function( )
        {
          injector.mapValue( 'string', 'baller status' );
          
          var user = injector.injectInto( User.create( { _private : 123 } ) );
          
          expect( user.comment ).toEqual( 'baller status' );
          expect( user._private ).toEqual( 123 );
        } );
        
        it( 'should inject into the subject recursively', function( )
        {
          var Organization = Legs.Class.extend( { _group : 'group' } );
          
          var Group = Legs.Class.extend( { _user : 'user' } );
          
          var user = new User( );
          
          injector.mapClass( 'group', Group );
          
          injector.mapValue( 'user', user );
          
          injector.mapValue( 'string', 'supah sweet' );
          
          var org = injector.injectInto( new Organization( ) );
          
          expect( org.group ).toBeAnInstanceOf( Group );
          
          expect( org.group.user ).toBe( user );
          
          expect( org.group.user.comment ).toEqual( 'supah sweet' );
        } );
      } );

      describe( 'getInstance', function( )
      {
        it( 'should be an instance method', function( )
        {
          expect( injector.getInstance ).toBeType( 'function' );
        } );

        it( 'should be able to get a value mapped with mapValue', function( )
        {
          injector.mapValue( 'test', 123 );
          
          expect( injector.getInstance( 'test' ) ).toBe( 123 );
        } );
        
        it( 'should be able to get an instance mapped with mapClass', function( )
        {
          var User = Legs.Class.extend( );
          
          injector.mapClass( 'test', User );
          
          expect( injector.getInstance( 'test' ) ).toBeAnInstanceOf( User );
        } );
        
        it( 'should be able to get an instance mapped with mapSingleton', function( )
        {
          var User = Legs.Class.extend( );
          
          injector.mapSingleton( 'test', User );
          
          expect( injector.getInstance( 'test' ) ).toBeAnInstanceOf( User );
        } );
        
        it( 'should raise an error if no type has been mapped with the given name', function( )
        {
          expect( injector.hasMapping( 'test' ) ).toBe( false );
          
          expect( function( )
          {
            var oops = injector.getInstance( 'test' );
          }
          ).toThrow( 'Legs.Injector cannot find any mapping named "test".' );
        } );
        
        it( 'should automatically fill dependencies on retrieved instances', function( )
        {
          injector.mapValue( 'string', 'hot shit' );
          
          var User = Legs.Class.extend( { _comment : 'string' } );
          
          injector.mapSingleton( 'user', User );
          
          var user = injector.getInstance( 'user' );
          
          expect( user.comment ).toEqual( 'hot shit' );
        } );
      } );

      describe( 'hasMapping', function( )
      {
        it( 'should be an instance method', function( )
        {
          expect( injector.hasMapping ).toBeType( 'function' );
        } );

        it( 'should return false if a mapping cannot be found', function( )
        {
          expect( injector.hasMapping( 'test' ) ).toBe( false );
        } );

        it( 'should return true if a mapping is found', function( )
        {
          injector.mapValue( 'test', 123 );

          expect( injector.hasMapping( 'test' ) ).toBe( true );
        } );
      } );
    } );
    
  } );
  
} );