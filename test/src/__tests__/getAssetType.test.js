/**
 * tezign ownership
 * @owner chenqijin
 * @team M3
 */
import { getFileType } from '../getAssetPreviewType';

describe('getAssetType', () => {
  it('should be case insensitive', () => {
    const exts = ['AI', 'ai'];
    const ret = exts.map((ext) => getFileType(ext));
    expect(ret[0]).not.toBeUndefined();
    expect(ret[0]).toEqual(ret[1]);
  });

  it('should be an extension', () => {
    const ext = 'this_is_an_extension';
    const ret = getFileType(ext);
    expect(ret).toBeUndefined();
  });
});
