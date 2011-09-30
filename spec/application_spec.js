(function() {
  describe("Legs.Application", function() {
    it("should be defined", function() {
      return expect(Legs.Application).toBeDefined();
    });
    describe("selector", function() {
      it("should be defined", function() {
        return expect(new Legs.Application().selector).toBeType("string");
      });
      describe("by default", function() {
        return it("should be \"body\"", function() {
          return expect(new Legs.Application().selector).toEqual("body");
        });
      });
      return describe("when specified", function() {
        return it("should be whatever I say it is", function() {
          return expect(new Legs.Application("asdf").selector).toEqual("asdf");
        });
      });
    });
    describe("context block", function() {
      it("should run if passed as the first parameter", function() {
        var app, spy;
        spy = jasmine.createSpy();
        app = new Legs.Application(spy);
        expect(spy).not.toHaveBeenCalled();
        app.run();
        return expect(spy).toHaveBeenCalled();
      });
      return it("should run if passed as the second parameter", function() {
        var app, spy;
        spy = jasmine.createSpy();
        app = new Legs.Application("#app", spy);
        expect(spy).not.toHaveBeenCalled();
        app.run();
        return expect(spy).toHaveBeenCalled();
      });
    });
    return describe("run", function() {
      beforeEach(function() {
        return this.app = new Legs.Application();
      });
      return it("should be defined", function() {
        return expect(this.app.run).toBeDefined();
      });
    });
  });
}).call(this);
