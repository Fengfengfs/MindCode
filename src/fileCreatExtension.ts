import fs, { readFileSync, statSync } from 'fs'
import { join } from 'path'
import type * as vscode from 'vscode'
import { commands, window } from 'vscode'
import { fillPath } from './utils/path'
import type { Variables } from './utils/processContent'
import { injectVariables } from './utils/processContent'
import { getConfig } from './utils/config'
import { walkDir, writeFile } from './index'

export function fileCreateExtension(context: vscode.ExtensionContext) {
    // 获取 workspaceState 全局变量
    const workspaceState = context.workspaceState
    /** 创建文件 */
    async function createFile(params: {
        targetPath: string
        templateName: string
        fileName: string
    }) {
        const templateDirectoryPath = workspaceState.get('myExtension.templateDirectoryPath') as string
        const { targetPath, templateName, fileName } = params

        const variables: Variables = []
        if (fileName) {
            variables.push({
                key: '[COMPONENT_NAME]',
                value: fileName,
            })
        }

        const templatePath = join(templateDirectoryPath, templateName)
        const templateStat = statSync(templatePath)
        if (templateStat.isDirectory()) {
            walkDir(templatePath, (filePath) => {
                const fileStat = statSync(filePath)
                if (fileStat.isFile()) {
                    const targetFilePath = injectVariables(join(targetPath, filePath.replace(templatePath, '')), variables)
                    if (!fs.existsSync(targetFilePath)) {
                        const content = injectVariables(readFileSync(filePath, 'utf-8'), variables)
                        writeFile(targetFilePath, content, (err) => {
                            if (err)
                                window.showErrorMessage(err.message)
                        })
                    }
                }
            })
        }

        window.showInformationMessage(
            'Successful create files!',
        )
    }

    const createTree = commands.registerCommand(
        'data.create',
        () => {
            const outputchannel = window.createOutputChannel('mychannel')
            outputchannel.show()
            const templateDirectoryPath = workspaceState.get('myExtension.templateDirectoryPath')
            const config = getConfig(templateDirectoryPath)
            const paths = config?.paths || []
            outputchannel.appendLine(`paths:${templateDirectoryPath}`)

            const folderPath = workspaceState.get('myExtension.folderPath')

            const path = paths.find((path) => {
                if (path)
                    return String(folderPath).startsWith(fillPath(path.directory))

                return false
            })

            if (!path) {
                window.showInformationMessage('Current directory doesn\'t have a template.')
                return
            }

            const treeCreate = async (d, targetPath) => {
                outputchannel.appendLine(`picked=${fillPath(targetPath)}`)
                await createFile({
                    targetPath: fillPath(targetPath),
                    templateName: 'components',
                    fileName: d.name,
                })
                for (let i = 0; i < d.children?.length; i++) {
                    const item = d.children[i]
                    await createFile({
                        targetPath: fillPath(`${targetPath}/${d.name}`),
                        templateName: 'components',
                        fileName: item.name,
                    })
                    if (item.children)
                        treeCreate(item.children, `${targetPath}/${item.name}`)
                }
            }
            // 获取全局变量的值
            const globalVariable = workspaceState.get('myExtension.globalVariable')

            if (!globalVariable) {
                window.showInformationMessage('please input your requirement to generate the project structure')
                return
            }
            treeCreate(globalVariable, path.directory)
        },
    )

    context.subscriptions.push(createTree)
}
