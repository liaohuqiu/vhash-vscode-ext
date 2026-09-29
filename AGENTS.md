# vHash Tools 说明

## 0. 范围与维护

### 0.1 目标

本文档说明 vHash VS Code/Cursor 扩展的开发、安装、发布流程和约定。

### 0.2 编写与维护规则

- 1. 使用带编号的 section 标题，方便 review 引用。
- 2. 新增规则放在匹配的二级 section 下，无匹配时新建二级 section。
- 3. 每个规则标题包含动词，直接描述要做的事。
- 4. 新增规则向后追加，保持本文持续增长。
- 5. 描述当前有效状态，不写历史变迁。

## 1. 命令

- `vhashTools.copySelectionPathRange` / `vHash: Copy Path With Line Range`：复制活动文件的绝对路径与行号范围。
- `vhashTools.copyPathRelativeToHome` / `vHash: Copy Path Relative to Home`：复制相对于 extension host 用户 home 的路径。
- `vhashTools.copyFileOrDirectoryName` / `vHash: Copy File or Directory Name`：复制文件或目录名。
- `vhashTools.configureVimKeybindings` / `vHash: Configure Vim Keybindings`：配置当前 profile 的 VSCodeVim mappings。

## 2. 快捷键

- 路径与行号：macOS `Shift+Cmd+C` 或 `Cmd+K N` / Windows & Linux `Shift+Alt+C` 或 `Ctrl+K N` / VSCodeVim `, c n`。
- 相对 home 的路径：macOS `Cmd+K H` / Windows & Linux `Ctrl+K H` / VSCodeVim `, c h`。
- 文件名：macOS `Cmd+K F` / Windows & Linux `Ctrl+K F` / VSCodeVim `, c f`。
- `package.json` 使用 `key`（Win/Linux 默认）+ `mac`（macOS 覆盖）模式
- 用户 keybindings 使用 `isMac` / `isWindows` / `isLinux` when 条件
- 扩展通过 `contributes.keybindings` 提供默认规则，不直接修改用户 `keybindings.json`；Python importer 只管理 `Cmd/Ctrl+K N/H/F` 六个精确 chord，不清理其他 `Cmd/Ctrl+K` chord。

## 3. 功能行为

- 复制当前文件的路径与行号范围，格式为 `path.py:start-end`（可为相对或绝对路径）。
- 如果没有选区，则使用光标所在行，起止行相同。
- 如果选区结束位置在下一行第 0 列，则结束行会减 1，避免多算空行。
- Explorer 右键菜单支持文件、目录和多选资源；多选结果每行一个。
- home-relative 路径基于 extension host 的 `os.homedir()`；home 外资源和非 `file` URI 不写剪贴板。
- Marketplace/VSIX 安装必须独立提供扩展命令、原生快捷键和 Vim 配置入口，不依赖 Python CLI。
- `configureVimKeybindings` 只更新当前 profile 的 `vim.normalModeKeyBindingsNonRecursive` 和 `vim.visualModeKeyBindingsNonRecursive`，并只管理 `, c n`、`, c h`、`, c f`。

## 4. 示例输出

- `src/app.py:10-42`
- `AGENTS.md:20-20`
- `git/project/src/app.py`
- `app.py`

## 5. 本地安装（Cursor / VS Code）

1. 在本目录运行 `npm ci` 和 `npm test`。
2. 使用 VS Code 或 Cursor 打开仓库，按 `F5` 启动 `Run vHash Extension` 并完成开发验证。
3. 执行 `npx @vscode/vsce package` 生成 VSIX。
4. 分别用 `cursor --install-extension <vsix> --force` 和 `code --install-extension <vsix> --force` 安装。

## 6. 使用方法

1. 在编辑器中使用命令面板、原生快捷键或 Vim mapping。
2. 在 Explorer 中通过右键菜单复制文件或目录的 home-relative 路径和名称。
3. 安装后在每个使用的 profile 中运行一次 `vHash: Configure Vim Keybindings`。

## 7. 快捷键配置

扩展默认快捷键维护在 `package.json`；`keybindings.json` 供 Python importer 同步本机用户 profile。

快捷键优先级：用户 keybindings > 扩展 contributed > VS Code 内置，见 `README.md` 2.2。

## 8. 配置发布 Token

Token 写入 xapp config root 的 app secret profile，不提交到仓库：

```yaml
# ~/.config/xapp-config-root/xapp-keys/vhash-vscode-ext/vhash-vscode-ext-secrets.yml
publish:
  default_profile: default
  profiles:
    default:
      azure_devops_pat_for_vsce: <your-azure-pat>
      openvsx_pat: <your-openvsx-pat>
```

- `azure_devops_pat_for_vsce`：VS Code Marketplace 发布，https://dev.azure.com/liaohuqiu/_usersSettings/tokens
- `openvsx_pat`：OpenVSX (Cursor) 发布，https://open-vsx.org/user-settings/tokens

## 9. 发布注意事项

- VS Code Marketplace 会永久保留 extension `name` 和 `displayName`，即使 unpublish + delete 后也无法再次使用。
  - 已保留不可用的 name：`vhash-vscode-ext`、`vhash-vscode-ext-v1`
  - 已保留不可用的 displayName：`vHash`、`vHash Tools`
  - 当前 VS Marketplace 使用 name `vhash-vscode-ext-v2`，displayName `vHash Copy Path`
- Cursor (OpenVSX) 无此限制，与 VS Marketplace 保持统一，使用 name `vhash-vscode-ext-v2`，displayName `vHash Copy Path`
- 图标使用 terminal 风格（`$ _vH`，icon-08）
