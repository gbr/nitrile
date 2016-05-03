import get from './get';

describe('Get', () => {
  beforeEach(function setObject() {
    this.object = {
      foo: 'bar',
      bar: {
        deeply: {
          nested: 'value',
          another: 1,
        },
      },
    };
  });

  it('should return undefined when property doesnt exist', function returnUndefined() {
    expect(get('missing')(this.object)).to.eql(undefined);
  });

  it('should get a property from an object', function getProperty() {
    expect(get('foo')(this.object)).to.eql(this.object.foo);
  });

  it('should get a deep property from an object by array syntax', function getDeepProperty() {
    expect(
      get(['bar', 'deeply'])(this.object)
    ).to.eql(this.object.bar.deeply);
  });

  it('should get a deep property from an object by dot syntax', function getDeepProperty() {
    expect(
      get('bar.deeply.nested')(this.object)
    ).to.eql(this.object.bar.deeply.nested);
  });
});
