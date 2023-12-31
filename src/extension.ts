// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import fs, { readFileSync, statSync } from 'fs'
import { dirname, isAbsolute, join } from 'path'
import * as vscode from 'vscode'
import type { dataInfo } from './treedata'
import { TTTreeNode, testdata } from './treedata'
import { $subject, myVariable, path } from './sharedVariable'
import { childrenMockData, mockData } from './mockData'
import { getDetailOfPRD, getHelpOfPRD } from './api/api'
import { injectVariables } from './utils/processContent'
import { walkDir, writeFile } from '.'

const map = new Map()
const tdata = new testdata()
interface Item {
  children: Item[]
  name: string
  description: string
  type: string
  time: number
}
export function extension(context: vscode.ExtensionContext) {
  $subject.subscribe(() => {
    const c01 = convertToTTTreeNode(myVariable.data)
    tdata.root.children.push(c01)
    const tree1 = vscode.window.registerTreeDataProvider('data', tdata)
    tdata.refresh()
  })
  const outputchannel = vscode.window.createOutputChannel('mychannel')
  const cmdtree = vscode.commands.registerCommand(
    'data.showme',
    async (pickitem: TTTreeNode) => {
      // 创建更精细化需求
      outputchannel.show()
      outputchannel.appendLine(`picked=${pickitem.name}`)
      console.log(`picked=${pickitem.name}`)
      const dataList = (await getDetailInfo(pickitem)).data.data
      addChildrenTree(context, pickitem.id, dataList)
    },
  )
  context.subscriptions.push(cmdtree)

  const cmdtree1 = vscode.commands.registerCommand(
    'data.generate',
    async (pickitem: TTTreeNode) => {
      // 生成文件
      outputchannel.show()
      outputchannel.appendLine(`picked=${pickitem.name}`)
      console.log(`picked=${pickitem.name}`)

      const arr = flattenNodes(pickitem)
      arr.forEach((ele) => {
        const [name, extension] = ele.name.split('.') || [ele.name, '']
        const url = `${path}/${ele.path}/${ele.name}`
        if (extension !== 'tsx' && extension !== 'ts'){
           return createFile(path + ele.name)
        }

       walkDir(`/Users/tezign/Desktop/Tezign workFlow/gold-right/test/templates/${extension}`, async(filePath:string) => {
          const fileStat = statSync(filePath)
          if (fileStat.isFile()) {
            // if (!fs.existsSync(url)) {
            const help = (await getHelpOfPRD(ele.description)).data.data

            const content = injectVariables(readFileSync(filePath, 'utf-8'), [{ key: '[COMPONENT_NAME]', value: name }, { key: '[HELP_suggest]', value: help.suggest }, { key: '[HELP_todoList]', value: help.todoList }])
            writeFile(url, content, (err) => {
            })
            // }
          }
        })
      })

      // createFile(path)
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
  if (!fs.existsSync(`${targetFilePath}/${node.description}_time.md`))
    fs.writeFileSync(`${targetFilePath}/${node.description}_time.md`, content)

  else
    vscode.window.showErrorMessage('该目录下已经存在估时表')
}

function createFile(path: string) {
  if (!fs.existsSync(path)) {
    writeFile(path, '', (err) => {
    })
    // const content = readFileSync(path, 'utf-8')
    // writeFile(targetFilePath, content, (err) => {
    //   if (err)
    //     window.showErrorMessage(err.message)
    // })
  }
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

async function getDetailInfo(item: TTTreeNode) {
  const dataInfo = await getDetailOfPRD(item.description, item.time || 2)
  return dataInfo
}
// this method is called when your extension is deactivated
export function deactivate() { }

function flattenNodes(node): any[] {
  const flattenedNodes: any[] = []

  function loop(node: TTTreeNode, parentPath = '') {
    const [name] = node.name.split('.')
    const path = parentPath ? `${parentPath}/${name}` : name
    const flattenedNode = { ...node, path }
    if (!node.children.length) {
      flattenedNodes.push(flattenedNode)
    }
    else {
      for (const childNode of node.children)
        loop(childNode, path)
    }
  }
  loop(node)

  return flattenedNodes
}
