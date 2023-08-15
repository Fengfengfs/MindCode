// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { TTTreeNode, testdata } from './treedata'
import { childrenMockData, mockData } from './mockData'
import { $subject, myVariable } from './sharedVariable'

export function extension(context: vscode.ExtensionContext) {
  testCustomView(context)
$subject.subscribe((data) =>{
  debugger
  console.log(data)
})
  const outputchannel = vscode.window.createOutputChannel('mychannel')
  const cmdtree = vscode.commands.registerCommand(
    'data.showme',
    (pickitem: TTTreeNode) => {
      outputchannel.show()
      outputchannel.appendLine(`picked=${pickitem.name}`)
      console.log(`picked=${pickitem.name}`)
      addChildrenTree(context, pickitem)
    },
  )
  context.subscriptions.push(cmdtree)

  const cmdtree2 = vscode.commands.registerCommand('data.refresh', () => {
    outputchannel.show()
    outputchannel.appendLine('debuglog data.refresh')
    console.debug('data.refresh')
  })
  context.subscriptions.push(cmdtree2)
}

function addChildrenTree(context: vscode.ExtensionContext, parent: TTTreeNode) {
  testCustomView(context, parent)
}
function testCustomView(context: vscode.ExtensionContext, parent?: TTTreeNode) {
  const tdata = new testdata()
  const c01 = new TTTreeNode(mockData.name)
  tdata.root.children.push(c01)
  mockData.children.map((item) => {
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
