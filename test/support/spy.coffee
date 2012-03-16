class exports.Spy
  constructor : -> @tally = 0

  expect : ( @total, @callback ) -> @

  fn : => @callback( ) if ++@tally is @total
