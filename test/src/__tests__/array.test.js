/**
 * tezign ownership
 * @owner chenqijin
 * @team M3
 */
import { removeFromArray, removeOneObjectFromArray, replaceOneObjectInArray } from '../../../../shared/utils/array';

describe('replaceOneObjectInArray', () => {
  it('should return original array', () => {
    const original = [1, 2, 3];
    const ret = replaceOneObjectInArray(original, 5, () => false);
    expect(ret).toBe(ret);
  });

  it('should replace the item and return a new array', () => {
    const original = [1, 2, 3];
    const ret = replaceOneObjectInArray(original, 5, (it) => it === 2);
    expect(ret).not.toBe(original);
    expect(ret).toEqual([1, 5, 3]);
  });
});

describe('removeOneObjectFromArray', () => {
  it('should return original array', () => {
    const original = [1, 2, 3];
    const ret = removeOneObjectFromArray(original, () => false);
    expect(ret).toBe(ret);
  });

  it('should remove the target item and return a new array', () => {
    const original = [1, 2, 3];
    const ret = removeOneObjectFromArray(original, (it) => it === 2);
    expect(ret).not.toBe(original);
    expect(ret).toEqual([1, 3]);
  });
});

describe('removeFromArray', () => {
  it('should return the original array', () => {
    const original = [{}, {}, {}];
    const ret = removeFromArray(original, {});
    expect(ret).toBe(original);
  });

  it('should remove the target item and return a new array', () => {
    const target = { order: 2 };
    const original = [{ order: 1 }, target, { order: 3 }];
    const ret = removeFromArray(original, target);
    expect(ret).not.toBe(original);
    expect(ret).toEqual([{ order: 1 }, { order: 3 }]);
  });
});
