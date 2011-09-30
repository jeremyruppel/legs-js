describe "Legs.Application", ->
  it "should be defined", ->
    expect( Legs.Application ).toBeDefined( )
  
  describe "selector", ->
    it "should be defined", ->
      expect( new Legs.Application( ).selector ).toBeType "string"
    
    describe "by default", ->
      it "should be \"body\"", ->
        expect( new Legs.Application( ).selector ).toEqual "body"
    
    describe "when specified", ->
      it "should be whatever I say it is", ->
        expect( new Legs.Application( "asdf" ).selector ).toEqual "asdf"
  
  describe "context block", ->
    it "should run if passed as the first parameter", ->
      spy = jasmine.createSpy( )
      app = new Legs.Application( spy )
      expect( spy ).not.toHaveBeenCalled( )
      app.run( )
      expect( spy ).toHaveBeenCalled( )
    
    it "should run if passed as the second parameter", ->
      spy = jasmine.createSpy( )
      app = new Legs.Application( "#app", spy )
      expect( spy ).not.toHaveBeenCalled( )
      app.run( )
      expect( spy ).toHaveBeenCalled( )
  
  describe "run", ->
    beforeEach ->
      @app = new Legs.Application( )
    
    it "should be defined", ->
      expect( @app.run ).toBeDefined( )
