import * as vscode from 'vscode'


export class TTTreeNode {
  constructor(label = 'noname') {
    this.name = label
    }

  name: string
    children: TTTreeNode[] = []
}
export class testdata implements vscode.TreeDataProvider<TTTreeNode> {
  root: TTTreeNode = new TTTreeNode('root')
    //将数据转换为可见的vscode.TreeItem
    getTreeItem(element: TTTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    // 可以在这里为treeitem指定图标和 command，command会在选中项目时触发
    if (element.children.length > 0)
      return new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.Expanded)
        else
      return new vscode.TreeItem(element.name)//这样没有子节点
    }

  // 查询子节点
  getChildren(element: TTTreeNode): vscode.ProviderResult<TTTreeNode[]> {
    if (element == undefined)
      return this.root.children
        return element.children
    }
}
