// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { TTTreeNode, testdata } from './treedata'
import { $subject, myVariable } from './sharedVariable'
import { childrenMockData } from './mockData'


const map = new Map()
  const tdata = new testdata();
  const c01 = convertToTTTreeNode(mockData);
  tdata.root.children.push(c01);
  const tree1 = vscode.window.registerTreeDataProvider('data', tdata)

export function extension(context: vscode.ExtensionContext) {
  testCustomView(context)
  $subject.subscribe((data) => {
    debugger
    console.log(data)
  })
  const outputchannel = vscode.window.createOutputChannel('mychannel')
  const cmdtree = vscode.commands.registerCommand(
    'data.showme',
    (pickitem: TTTreeNode) => {
      debugger
      outputchannel.show()
      outputchannel.appendLine(`picked=${pickitem.name}`)
      console.log(`picked=${pickitem.name}`)
      addChildrenTree(context,pickitem.id,mockData)
    },
  )
    context.subscriptions.push(cmdtree)

    const cmdtree1 = vscode.commands.registerCommand(
    'data.generate',
    (pickitem: TTTreeNode) => {
      debugger
      outputchannel.show()
      outputchannel.appendLine(`picked=${pickitem.name}`)
      console.log(`picked=${pickitem.name}`)
      addChildrenTree(context,pickitem.id,mockData)
    },
  )
  context.subscriptions.push(cmdtree1)

  const cmdtree2 = vscode.commands.registerCommand('data.refresh', () => {
    outputchannel.show()
    outputchannel.appendLine('debuglog data.refresh')
    console.debug('data.refresh')
  })
  context.subscriptions.push(cmdtree2)
}

function addChildrenTree(context: vscode.ExtensionContext, parentName: string | number,data:dataInfo) {
  const node = map.get(parentName)
  const childNode = convertToTTTreeNode(data)
  node.children.push(childNode)
  tdata.refresh()
  console.log(c01,tdata)
}

function convertToTTTreeNode(data: dataInfo, parent?: TTTreeNode): TTTreeNode {
  const node = new TTTreeNode(data);
  map.set(node.id,node)
  if (data.children) {
    data.children.forEach(child => {
      const childNode = convertToTTTreeNode(child, parent);
      node.children.push(childNode);
    });
  }

  return node;
}

function testCustomView(context: vscode.ExtensionContext, parent?: TTTreeNode) {
  // 获取 workspaceState 全局变量
  const workspaceState = context.workspaceState
  // 获取全局变量的值
  const globalVariable = workspaceState.get('myExtension.globalVariable')
  const tdata = new testdata()
  const c01 = new TTTreeNode(globalVariable.name)
  tdata.root.children.push(c01)
  globalVariable.children.map((item) => {
    const c02 = new TTTreeNode(item.name)
    c01.children.push(c02)
    item.children?.map((child) => {
      const c03 = new TTTreeNode(child.name)
      c02.children.push(c03)
      if (child.name === parent?.name) {
        childrenMockData.children.map((item) => {
          const c04 = new TTTreeNode(item.name)
          c03.children.push(c04)
        })
      }
    })
  })
  const tree1 = vscode.window.registerTreeDataProvider('data', tdata)
  context.subscriptions.push(tree1)
}
// this method is called when your extension is deactivated
export function deactivate() { }
