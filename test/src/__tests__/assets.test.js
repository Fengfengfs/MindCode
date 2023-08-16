/**
 * tezign ownership
 * @owner chenqijin
 * @team M3
 */
import { exportedForTesting } from '../assets';

const { isSizeLike } = exportedForTesting;

describe('isSizeLike', () => {
  it('should be size like', () => {
    const size = { height: 1, width: 1 };
    expect(isSizeLike(size)).toBeTruthy();
  });

  it('should not be size like', () => {
    const sizes = [{ height: 1 }, { width: 1 }, { height: 0, width: 1 }];

    for (const size of sizes) {
      expect(isSizeLike(size)).toBeFalsy();
    }
  });
});
