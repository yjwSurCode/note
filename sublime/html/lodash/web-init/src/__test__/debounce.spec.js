import assert from 'assert';
import debounce from './debounce.ts';

describe('debounce', function () {
	it('should debounce a function', (done) => {
		expect(debounce()).toBe(1);
		done()
	});

})

