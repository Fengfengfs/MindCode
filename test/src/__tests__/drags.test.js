/**
 * tezign ownership
 * @owner chenqijin
 * @team M3
 */
import { exportedForTesting } from '../drags';

const { assertCanMoveToFolder, assertCanMoveToFolders } = exportedForTesting;

// TODO 还没有覆盖到所有到case，因为#getFolderInstance依赖于模块状态，不好测

describe('assertCanMoveToFolder', () => {
  it('should not be able to move from root to root', () => {
    const data = {};
    const run = () => {
      assertCanMoveToFolder(data);
    };
    expect(run).toThrow();
  });

  it('should not move the current folder', () => {
    const data = { from: 1 };
    const to = 1;
    const run = () => {
      assertCanMoveToFolder(data, to);
    };
    expect(run).toThrow();
  });

  it('should not contain "to" in "folders"', () => {
    const data = { from: 1, folders: [2, 3] };
    const to = 2;
    const run = () => {
      assertCanMoveToFolder(data, to);
    };
    expect(run).toThrow();
  });
});

describe('assertCanMoveToFolders', () => {
  it('should not be able to move from root to root', () => {
    const data = {};
    const run = () => {
      assertCanMoveToFolder(data);
    };
    expect(run).toThrow();
  });

  it('should not contain "from" in "to"', () => {
    const data = { from: 1 };
    const to = [1];
    const run = () => {
      assertCanMoveToFolders(data, to);
    };
    expect(run).toThrow();
  });

  it('should not move folders to multiple target folder', () => {
    const data = { from: 1, folders: [2, 3] };
    const to = [4, 5];
    const run = () => {
      assertCanMoveToFolders(data, to);
    };
    expect(run).toThrow();
  });

  it('should not contain "to" in "folders"', () => {
    const data = { from: 1, folders: [2, 3] };
    const to = [2, 4];
    const run = () => {
      assertCanMoveToFolders(data, to);
    };
    expect(run).toThrow();
  });
});
