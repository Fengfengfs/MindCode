import * as vscode from 'vscode'


export interface dataInfo{
  name:string;
  type:string;
  description:string;
  time:number
  id:number
  children?:Array<dataInfo>
}

export class TTTreeNode {
  static idx = 1
  type: string;
  description: string;
  time: number;
  name: string
  id:number
    children: TTTreeNode[] = []
  constructor({name,type,description,time}:dataInfo) {
    this.name = name
    this.type = type
    this.description = description
    this.time = time
    this.id = TTTreeNode.idx++
    }
}
export class testdata implements vscode.TreeDataProvider<TTTreeNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TTTreeNode | undefined | void> = new vscode.EventEmitter<TTTreeNode | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TTTreeNode | undefined | void> = this._onDidChangeTreeData.event;
  root: TTTreeNode = new TTTreeNode('root')
    //将数据转换为可见的vscode.TreeItem
    getTreeItem(element: TTTreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    // 可以在这里为treeitem指定图标和 command，command会在选中项目时触发
    if (element.children.length > 0)
      return new vscode.TreeItem(element.description, vscode.TreeItemCollapsibleState.Expanded)
        else
      return new vscode.TreeItem(element.description)//这样没有子节点
    }

  // 查询子节点
  getChildren(element: TTTreeNode): vscode.ProviderResult<TTTreeNode[]> {
    if (element == undefined)
      return this.root.children
        return element.children
    }
    refresh(): void {
    // 在这里更新树的数据
    // ...

    // 调用onDidChangeTreeData方法通知VS Code重新加载树的显示
    this._onDidChangeTreeData.fire();
  }
}
