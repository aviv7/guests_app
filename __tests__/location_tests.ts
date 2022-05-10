/**
 * @format
 */

import 'react-native';

// Note: test renderer must be required after react-native.
import Location from '../src/types';

test('location add', () => {
	const loc = new Location(1, 1);
	const res = loc.add(1, 1);
	expect(res.x).toStrictEqual(2);
	expect(res.y).toStrictEqual(2);
});

describe('Location.add', () => {
	it('Added correctly with equal values', () => {
		const location = new Location(0, 0);
		expect(location.add(2, 2)).toStrictEqual(new Location(2, 2));
	});
});
