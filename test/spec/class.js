describe( 'Legs.Class', function( )
{
  it( 'should be defined', function( )
  {
    expect( Legs.Class ).toBeDefined( );
  } );
  
  it( 'should be a function', function( )
  {
    expect( Legs.Class ).toBeType( 'function' );
  } );
  
  describe( 'using the extend method', function( )
  {
    it( 'should be defined', function( )
    {
      expect( Legs.Class.extend ).toBeDefined( );
    } );
    
    it( 'should be a function', function( )
    {
      expect( Legs.Class.extend ).toBeType( 'function' );
    } );
    
    it( 'should return a constructor', function( )
    {
      var Result = Legs.Class.extend( );
      
      expect( Result ).toBeType( 'function' );
    } );
    
    it( 'should be able to instantiate the result', function( )
    {
      var Result = Legs.Class.extend( );
      
      expect( new Result( ) ).toBeType( 'object' );
    } );
    
    it( 'should be defined on the result', function( )
    {
      var Result = Legs.Class.extend( );
      
      expect( Result.extend ).toBeDefined( );
      expect( Result.extend ).toBeType( 'function' );
    } );
  } );
  
  describe( 'using the create method', function( )
  {
    it( 'should be defined', function( )
    {
      expect( Legs.Class.create ).toBeDefined( );
    } );
    
    it( 'should be a function', function( )
    {
      expect( Legs.Class.create ).toBeType( 'function' );
    } );
    
    it( 'should return an instance of the class', function( )
    {
      expect( Legs.Class.create( ) ).toBeAnInstanceOf( Legs.Class );
    } );
    
    it( 'should extend the class with any options given', function( )
    {
      var instance = Legs.Class.create( { awesome : 'sauce' } );
      
      expect( instance.awesome ).toEqual( 'sauce' );
    } );
    
    it( 'should exist on extended classes', function( )
    {
      var Class = Legs.Class.extend( );
      
      expect( Class.create ).toBeType( 'function' );
    } );
    
    it( 'should extend an extended class with any options given', function( )
    {
      var Class = Legs.Class.extend( { custom : 123, awesome : 'sauce' } );
      
      var instance = Class.create( { custom : 456} );
      
      expect( instance.awesome ).toEqual( 'sauce' );
      expect( instance.custom ).toEqual( 456 );
    } );
    
    it( 'should preserve inheritance on a subclass', function( )
    {
      var Class = Legs.Class.extend( );
      
      var instance = Class.create( );
      
      expect( instance ).toBeAnInstanceOf( Class );
      expect( instance ).toBeAnInstanceOf( Legs.Class );
    } );
    
    it( 'should create different instances every time', function( )
    {
      var one = Legs.Class.create( );
      var two = Legs.Class.create( );
      
      expect( one ).not.toBe( two );
    } );
  } );
  
  describe( 'using the include method', function( )
  {
    it( 'should be defined', function( )
    {
      expect( Legs.Class.include ).toBeDefined( );
    } );
    
    it( 'should be a function', function( )
    {
      expect( Legs.Class.include ).toBeType( 'function' );
    } );
    
    it( 'should exist on extended classes', function( )
    {
      var Class = Legs.Class.extend( );
      
      expect( Class.include ).toBeType( 'function' );
    } );
    
    it( 'should include the given attributes on a class prototype', function( )
    {
      var Class = Legs.Class.extend( );
      
      expect( new Class( ).custom ).not.toBeDefined( );
      
      Class.include( { custom : 123 } );
      
      expect( new Class( ).custom ).toEqual( 123 );
    } );
    
    it( 'should not include attributes on the superclass', function( )
    {
      var Class = Legs.Class.extend( );
      
      Class.include( { custom : 123 } );
      
      expect( Class.create( ).custom ).toBeDefined( );
      expect( Legs.Class.create( ).custom ).not.toBeDefined( );
    } );
    
    it( 'should use the prototype chain to attach the attributes', function( )
    {
      var Child = Legs.Class.extend( );
      
      var GrandChild = Child.extend( );
      
      Child.include( { kids : 'these days' } ); // AFTER Child is subclassed!
      
      expect( new GrandChild( ).kids ).toEqual( 'these days' );
    } );
  } );
  
  describe( 'inheritance', function( )
  {
    it( 'should be an instance of Class', function( )
    {
      var Result = Legs.Class.extend( );
      
      expect( ( new Result( ) ) instanceof Legs.Class ).toBe( true );
    } );
    
    it( 'should support multiple ancestors', function( )
    {
      var Child = Legs.Class.extend( );
      
      var GrandChild = Child.extend( );
      
      expect( new GrandChild( ) ).toBeAnInstanceOf( Child );
      expect( new GrandChild( ) ).toBeAnInstanceOf( Legs.Class );
    } );
    
    it( 'should respect siblings as non-ancestors', function( )
    {
      var One = Legs.Class.extend( );
      var Two = Legs.Class.extend( );
      
      expect( new One( ) ).toBeAnInstanceOf( One );
      expect( new Two( ) ).toBeAnInstanceOf( Two );
    } );
    
    it( 'should have attributes that were assigned to the superclass', function( )
    {
      var Child = Legs.Class.extend( { awesome : true } );
      
      var GrandChild = Child.extend( );
      
      expect( ( new GrandChild( ) ).awesome ).toBe( true );
    } );
    
    it( 'should be able to overwrite ancestor attributes', function( )
    {
      var Child = Legs.Class.extend( { awesome : 'kids these days' } );
      
      var GrandChild = Child.extend( { awesome : true } );
      
      expect( ( new GrandChild( ) ).awesome ).toBe( true );
    } );
  } );
  
  describe( 'setting properties', function( )
  {
    it( 'should not be applied to the class', function( )
    {
      var User = Legs.Class.extend( { username : 'jeremy' } );
      
      expect( User.username ).not.toBeDefined( );
    } );
    
    it( 'should be applied to instances through the extend hash', function( )
    {
      var User = Legs.Class.extend( { username : 'jeremy' } );
      
      expect( ( new User( ) ).username ).toEqual( 'jeremy' );
    } );
    
    it( 'should be able to set methods on the instance', function( )
    {
      var method = jasmine.createSpy( );
      
      var User = Legs.Class.extend( { test : method } );
      
      var user = new User( );
      
      expect( user.test ).toBeType( 'function' );
      expect( user.test ).toBe( method );
      
      user.test( );
      
      expect( method ).toHaveBeenCalled( );
      expect( method.mostRecentCall.object ).toBe( user );
    } );
  } );
  
  describe( 'initialization', function( )
  {
    it( 'should be able to provide a method to the initialize attribute', function( )
    {
      var constructor = jasmine.createSpy( );

      var User = Legs.Class.extend( { initialize : constructor } );
      
      var user = new User( );
      
      expect( constructor ).toHaveBeenCalled( );
    } );
    
    it( 'should call the constructor with all arguments passed to the new object', function( )
    {
      var constructor = jasmine.createSpy( );
      
      var User = Legs.Class.extend( { initialize : constructor } );
      
      var user = new User( true, 'testing', 4 );
      
      expect( constructor ).toHaveBeenCalledWith( true, 'testing', 4 );
    } );
    
    it( 'should be called in the scope of the new instance', function( )
    {
      var constructor = jasmine.createSpy( );
      
      var User = Legs.Class.extend( { initialize : constructor } );
      
      var user = new User( );
      
      expect( constructor.mostRecentCall.object ).toBe( user );
    } );
  } );
} );