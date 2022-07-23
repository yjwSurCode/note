import assert from "assert";
import debounce from "../useDebounceFn";

describe("debounce", function () {
  it("should debounce a function", (done) => {
    var callCount = 0;

    var debounced = debounce(function (value) {
      ++callCount;
      return value;
    }, 32);

    var results = [debounced("a"), debounced("b"), debounced("c")];

    console.log(assert.deepEqual(1, 1), "111");
    assert.deepEqual(1, 1);

    assert.deepStrictEqual(results, [undefined, undefined, undefined]);

    // expect(debounce(() => {}, 1000, {})).toBe(2);

    // assert.deepStrictEqual(111, 111);

    done();
  });
});
