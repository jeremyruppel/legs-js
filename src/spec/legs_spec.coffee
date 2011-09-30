describe "Legs", ->
  it "should be defined", ->
    expect( Legs ).toBeDefined( )
  
  describe "VERSION", ->
    it "should be defined", ->
      expect( Legs.VERSION ).toBeDefined( )
    
    it "should look like a version number", ->
      expect( Legs.VERSION ).toMatch /^\d+\.\d+\.\d+$/
