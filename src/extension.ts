// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import fs, { readFileSync, statSync } from 'fs'
import * as vscode from 'vscode'
import type { dataInfo } from './treedata'
import { TTTreeNode, testdata } from './treedata'
import { childrenMockData, mockData } from './mockData'
import { $subject, myVariable } from './sharedVariable'

const map = new Map()
const tdata = new testdata()
const c01 = convertToTTTreeNode(mockData)
tdata.root.children.push(c01)
const tree1 = vscode.window.registerTreeDataProvider('data', tdata)
interface Item {
  children: Item[]
  name: string
  description: string
  type: string
  time: number
}
export function extension(context: vscode.ExtensionContext) {
  $subject.subscribe((data) => {
    testCustomView(context)
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
      addChildrenTree(context, pickitem.id, mockData)
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
      addChildrenTree(context, pickitem.id, mockData)
    },
  )
  context.subscriptions.push(cmdtree1)

  const cmdtree2 = vscode.commands.registerCommand('data.refresh', () => {
    outputchannel.show()
    outputchannel.appendLine('debuglog data.refresh')
    console.debug('data.refresh')
  })
  context.subscriptions.push(cmdtree2)

  const cmdtree3 = vscode.commands.registerCommand(
    'data.time',
    (pickitem: TTTreeNode) => {
      outputchannel.show()
      outputchannel.appendLine(`picked=${pickitem.name}`)
      console.log(`picked=${pickitem.name}`)
      creatTimeFile(context, pickitem.id)
    },
  )
  context.subscriptions.push(cmdtree3)
}

function addChildrenTree(context: vscode.ExtensionContext, parentName: string | number, data: dataInfo) {
  const node = map.get(parentName)
  const childNode = convertToTTTreeNode(data)
  node.children.push(childNode)
  tdata.refresh()
  console.log(c01, tdata)
}

/** 生成markdown格式数据 */
function generateMarkdownTable(item: Item): string {
  let markdownTable = '描述（description）|时间（time）|名称（name）|类型（type）\n---|---|---|---\n'
  let totalTime = 0
  const generateRows = (items: Item[]) => {
    items.forEach((child: Item) => {
      if (child.children.length === 0) {
        markdownTable += `${child.description}|${child.time || 0}|${child.name}|${child.type}\n`
        totalTime += child.time || 0
        return
      }
      generateRows(child.children)
    })
  }
  generateRows([item])
  markdownTable += `**总时间：**| | |${totalTime}\n`
  return markdownTable
}

function creatTimeFile(context: vscode.ExtensionContext, parentName: string | number) {
  const node = map.get(parentName)
  const content = generateMarkdownTable(node)
  const workspaceState = context.workspaceState
  const targetFilePath = workspaceState.get('myExtension.folderPath') as string
  if (!fs.existsSync(`${targetFilePath}/${node.name}_${node.id}_time.md`))
    fs.writeFileSync(`${targetFilePath}/${node.name}_${node.id}_time.md`, content)

  else
    vscode.window.showErrorMessage('该目录下已经存在估时表')
}

function convertToTTTreeNode(data: dataInfo, parent?: TTTreeNode): TTTreeNode {
  const node = new TTTreeNode(data)
  map.set(node.id, node)
  if (data.children) {
    data.children.forEach((child) => {
      const childNode = convertToTTTreeNode(child, parent)
      node.children.push(childNode)
    })
  }

  return node
}
function testCustomView(context: vscode.ExtensionContext, parent?: TTTreeNode) {
  context.subscriptions.push(tree1)
}
// this method is called when your extension is deactivated
export function deactivate() { }
