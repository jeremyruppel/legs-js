describe 'Legs', ->
  it 'should be defined', ->
    expect( Legs ).toBeDefined( )
  
  describe 'VERSION', ->
    it 'should be defined', ->
      expect( Legs.VERSION ).toBeDefined( )
    
    it 'should look like a version number', ->
      expect( Legs.VERSION ).toMatch /^\d+\.\d+\.\d+$/
  
describe 'Legs.Class', ->
  it 'should be defined', ->
    expect( Legs.Class ).toBeDefined( )
  
  describe 'include', ->
    class TestClass extends Legs.Class
    
    it 'should be defined', ->
      expect( Legs.Class.include ).toBeType 'function'
    
    it 'should be defined on a subclass', ->
      expect( TestClass.include ).toBeType 'function'
  
  describe 'class methods', ->
    class TestConcern extends Legs.Concern
      @classMethods : 
        sum : ( a, b ) -> a + b
    
    class TestClass extends Legs.Class
      @include TestConcern
    
    it 'should mix-in class methods from a concern', ->
      expect( TestClass.sum ).toBeType 'function'
      expect( TestClass.sum 1, 2 ).toEqual 3
  
  describe 'instance methods', ->
    class TestConcern extends Legs.Concern
      @instanceMethods :
        sum : ( a, b ) -> a + b
        
    class TestClass extends Legs.Class
      @include TestConcern
    
    it 'should mix-in instance methods from a concern', ->
      subject = window.subject = new TestClass
      expect( subject.sum ).toBeType 'function'
      expect( subject.sum 1, 2 ).toEqual 3
    

describe 'Legs.Concern', ->
  it 'should be defined', ->
    expect( Legs.Concern ).toBeDefined( )
  
  describe 'included', ->
    it 'should be defined', ->
      expect( Legs.Concern.included ).toBeType 'function'
    
    it 'should get called when mixed-in to a class', ->
      spy = jasmine.createSpy( )
      class TestConcern extends Legs.Concern
        @included spy
      
      expect( spy ).not.toHaveBeenCalled( )
      
      class TestClass extends Legs.Class
        @include TestConcern
      
      expect( spy ).toHaveBeenCalled( )
      expect( spy.mostRecentCall.object ).toEqual TestClass
