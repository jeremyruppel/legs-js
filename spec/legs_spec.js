(function() {
  describe("Legs", function() {
    it("should be defined", function() {
      return expect(Legs).toBeDefined();
    });
    return describe("VERSION", function() {
      it("should be defined", function() {
        return expect(Legs.VERSION).toBeDefined();
      });
      return it("should look like a version number", function() {
        return expect(Legs.VERSION).toMatch(/^\d+\.\d+\.\d+$/);
      });
    });
  });
}).call(this);
