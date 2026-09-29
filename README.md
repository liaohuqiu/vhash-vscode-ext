# vHash

## 0. 范围与维护

### 0.1 目标

本文档说明 vHash VS Code/Cursor 扩展的功能、快捷键配置和使用方式。

### 0.2 编写与维护规则

- 1. 使用带编号的 section 标题，方便 review 引用。
- 2. 新增规则放在匹配的二级 section 下，无匹配时新建二级 section。
- 3. 每个规则标题包含动词，直接描述要做的事。
- 4. 新增规则向后追加，保持本文持续增长。
- 5. 描述当前有效状态，不写历史变迁。

## 1. 功能

### 1.1 使用复制命令

- `vhashTools.copySelectionPathRange` / `vHash: Copy Path With Line Range`：复制活动文件的绝对路径和行号范围；无选区时使用光标行，选区结束在下一行第 0 列时不计入该行。
- `vhashTools.copyPathRelativeToHome` / `vHash: Copy Path Relative to Home`：复制相对于 extension host 用户 home 的路径；本地窗口使用本机 home，Remote SSH、WSL 和 Dev Container 使用远端 extension host home。
- `vhashTools.copyFileOrDirectoryName` / `vHash: Copy File or Directory Name`：复制文件名或目录名。
- `vhashTools.configureVimKeybindings` / `vHash: Configure Vim Keybindings`：把 `, c n`、`, c h`、`, c f` 写入当前 profile 的 VSCodeVim Normal/Visual mappings。

### 1.2 选择目标资源

1. 从 Explorer 右键菜单运行时，命令使用选中的文件和目录；多选结果每行一个。
2. 从命令面板、原生快捷键或 Vim mapping 运行时，命令使用活动编辑器文件。
3. home-relative 命令遇到 home 外资源时显示警告并保持剪贴板不变。
4. 路径和文件名命令只处理本地 `file` URI。

### 1.3 查看输出示例

| 场景 | 输出 |
|---|---|
| 选中 `/Users/user/git/project/src/app.py` 第 10–42 行 | `/Users/user/git/project/src/app.py:10-42` |
| home 为 `/Users/user`，文件为 `/Users/user/git/project/src/app.py` | `git/project/src/app.py` |
| 文件为 `/Users/user/git/project/src/app.py` | `app.py` |
| 目录为 `/Users/user/git/project/src` | `src` |

## 2. 快捷键配置

### 2.1 使用全部快捷键

| 功能 | macOS | Windows / Linux | VSCodeVim |
|---|---|---|---|
| 打开命令面板 | `Shift+Cmd+P` | `Shift+Alt+P` | — |
| 在 Explorer 定位活动文件 | `Shift+Cmd+E` | `Shift+Alt+E` | — |
| 全局搜索 | `Shift+Cmd+F` | `Shift+Alt+F` | — |
| 快速打开 | `Shift+Cmd+O` | `Shift+Alt+O` | — |
| 上一个编辑器 | `Shift+Cmd+[` | `Shift+Alt+[` | — |
| 下一个编辑器 | `Shift+Cmd+]` | `Shift+Alt+]` | — |
| 复制路径与行号 | `Shift+Cmd+C` 或 `Cmd+K N` | `Shift+Alt+C` 或 `Ctrl+K N` | `, c n` |
| 复制相对 home 的路径 | `Cmd+K H` | `Ctrl+K H` | `, c h` |
| 复制文件名 | `Cmd+K F` | `Ctrl+K F` | `, c f` |

`Cmd/Ctrl+K N/H/F` 是两段 chord：先按 `Cmd/Ctrl+K`，松开后再按 `N`、`H` 或 `F`。Vim mapping 按顺序输入三个按键。

### 2.2 快捷键优先级

用户级 > 扩展 contributed > 系统内置，数字越小优先级越高：

| 优先级 | 来源 | 覆盖范围 |
|---|---|---|
| 1（最高） | 用户 `keybindings.json` | 覆盖下方所有 |
| 2 | 扩展 `package.json` `contributes.keybindings` | 覆盖系统默认 |
| 3（最低） | VS Code 内置默认 | — |

扩展通过 `package.json` 提供默认快捷键，不修改用户的 `keybindings.json`。发生冲突时，在 Keyboard Shortcuts 中搜索 `vhashTools`，使用 Show Same Keybindings 定位冲突；用户级规则会覆盖扩展默认规则。

### 2.3 配置 Vim mappings

Marketplace 和 VSIX 安装用户在当前 profile 中运行一次 `vHash: Configure Vim Keybindings`。该命令只替换 `, c n`、`, c h`、`, c f`，保留其他 VSCodeVim mappings；切换 profile 后需要再次运行。

仓库内的 Python CLI 可批量同步本机 profile，但扩展运行和 Vim 配置不依赖 Python：

```bash
xenv pyrun --runtime tool-python python vhash-vscode-ext.py configure-vim-keybindings --include-default true
```

### 2.4 使用平台特定快捷键

扩展 `package.json` 使用 `key`（Windows/Linux 默认）+ `mac`（macOS 覆盖）模式：

```json
{
  "key": "shift+alt+c",
  "mac": "shift+cmd+c",
  "command": "vhashTools.copySelectionPathRange",
  "when": "editorTextFocus"
}
```

## 3. 本地开发与验证

1. 安装依赖并验证编译和测试：

```bash
npm ci
npm test
```

2. 使用 VS Code 或 Cursor 打开仓库，按 `F5` 并选择 `Run vHash Extension`；Extension Development Host 会通过 `.vscode/launch.json` 在启动前运行 `npm run compile`。
3. 在 Extension Development Host 中验证原生 chord、Vim mappings、Explorer 文件/目录右键菜单，以及 home 外路径不会改变剪贴板。
4. Python CLI 使用 xenv 的 tool runtime 验证：

```bash
xenv pyrun --runtime tool-python python vhash-vscode-ext.py --help
```

## 4. 构建与本地安装

```bash
npm ci
npm test
npx @vscode/vsce package
cursor --install-extension ./vhash-vscode-ext-v2-<version>.vsix --force
code --install-extension ./vhash-vscode-ext-v2-<version>.vsix --force
```

用户级 `keybindings.json` 使用 `isMac`、`isWindows`、`isLinux` when 条件：

```json
{
  "key": "shift+cmd+c",
  "command": "vhashTools.copySelectionPathRange",
  "when": "isMac && editorTextFocus"
},
{
  "key": "shift+alt+c",
  "command": "vhashTools.copySelectionPathRange",
  "when": "(isWindows || isLinux) && editorTextFocus"
}
```
