/**
 * tezign ownership
 * @owner chenqijin
 * @team M3
 */
import { formatSize } from '../files';

describe('formatSize', () => {
  it('should be B', () => {
    expect(formatSize(1023)).toEqual('1023B');
  });

  it('should be KB', () => {
    const ret = formatSize(1024 * 1024 - 1);
    const unit = ret.slice(-2, ret.length);
    expect(unit).toEqual('KB');
  });

  it('should be MB', () => {
    const ret = formatSize(1024 * 1024 * 1024 - 1);
    const unit = ret.slice(-2, ret.length);
    expect(unit).toEqual('MB');
  });

  it('should be GB', () => {
    const ret = formatSize(1024 * 1024 * 1024 * 1024 - 1);
    const unit = ret.slice(-1, ret.length);
    expect(unit).toEqual('G');
  });

  it('should have no fractional part', () => {
    const ret = formatSize(1024 + 1);
    expect(ret.indexOf('.')).toEqual(-1);
  });

  it('should have fractional part', () => {
    const ret = formatSize(1024 + 10);
    expect(ret.indexOf('.')).not.toEqual(-1);
  });
});
