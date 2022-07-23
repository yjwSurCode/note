import assert from 'assert';
import throttle from '../throttle';

describe('throttle', function () {
    it('should throttle a function', function (done) {
    
        expect(throttle()).toBe(2);
        done()
    });

    // it('should throttle a function', function (done) {
    //     expect(throttle()).toBe(3);
    //     done()
    // });

    // it('should throttle a function', function (done) {
    //     expect(throttle()).toBe(4);
    //     done()
    // });

})


// import { describe, test, expect } from "@jest/globals";

// import throttle from '../throttle';

// const arr: string[] = ["cat", "dog", "bat"];

// describe("if `arr` contains `searchElement`, return true, or return false", () => {
//   test("if string array contains `cat`, return true", () => {
//     expect(includes(arr, "cat")).toBe(true);
//   });
//   test("arr doesn`t contains `cat` while `fromIndex` equal to 1, return false", () => {
//     expect(includes(arr, "cat", 1)).toBe(false);
//   });
// });
