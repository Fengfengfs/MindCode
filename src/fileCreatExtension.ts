import fs, { readFileSync, statSync } from 'fs'
import { isAbsolute, join } from 'path'
import type * as vscode from 'vscode'
import { commands, window, workspace } from 'vscode'
import { mockData } from './mockData'
import { fillPath } from './utils/path'
import type { Variables } from './utils/processContent'
import { injectVariables } from './utils/processContent'
import { getConfig } from './utils/config'

export function fileCreateExtension(context: vscode.ExtensionContext) {
    /** 创建文件 */
    async function createFile(params: {
        targetPath: string
        templateName: string
        templateDirectoryPath: string
        fileName: string
    }) {
        const { targetPath, templateName, templateDirectoryPath, fileName } = params

        const config = getConfig(templateDirectoryPath)
        const templateConfig = config?.templatesConfig?.find(template => template.templateName === templateName)

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
            'Successful create!',
        )
    }

    const createTree = commands.registerCommand(
        'data.create',
        (param) => {
            const _templateDirectoryPath = workspace
                .getConfiguration('goldRight')
                .get('templateDirectoryPath') as string

            if (!_templateDirectoryPath) {
                window.showErrorMessage(
                    'The property of \'goldRight.templateDirectoryPath\' is not set.',
                )
                return
            }
            const templateDirectoryPath = isAbsolute(_templateDirectoryPath) ? _templateDirectoryPath : join(workspacePath, _templateDirectoryPath)
            const config = getConfig(templateDirectoryPath)
            const paths = config?.paths || []
            const folderPath = param.path

            const path = paths.find((path) => {
                if (path)
                    return String(folderPath).startsWith(fillPath(path.directory))

                return false
            })

            if (!path) {
                window.showInformationMessage('Current directory doesn\'t have a template.')
                return
            }
            const outputchannel = window.createOutputChannel('mychannel')
            outputchannel.show()

            const treeCreate = async (d, targetPath) => {
                outputchannel.appendLine(`picked=${fillPath(targetPath)}`)
                await createFile({
                    targetPath: fillPath(targetPath),
                    templateName: 'components',
                    templateDirectoryPath,
                    fileName: d.name,
                })
                for (let i = 0; i < d.children?.length; i++) {
                    const item = d.children[i]
                    await createFile({
                        targetPath: fillPath(`${targetPath}/${d.name}`),
                        templateName: 'components',
                        templateDirectoryPath,
                        fileName: item.name,
                    })
                    if (item.children)
                        treeCreate(item.children, `${targetPath}/${item.name}`)
                }
            }
            treeCreate(mockData, path.directory)
        },
    )

    context.subscriptions.push(createTree)
}
