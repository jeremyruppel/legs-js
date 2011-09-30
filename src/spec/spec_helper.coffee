beforeEach ->
  @addMatchers 
    toBeType : ( value ) ->
      ( typeof @actual ) == value
    
    toBeAnInstanceOf : ( clazz ) ->
      @actual instanceof clazz
