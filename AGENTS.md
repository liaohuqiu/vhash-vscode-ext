# VHash Tools 说明

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

- `VHash: Copy Path With Line Range`
- 命令 ID：`vhashTools.copySelectionPathRange`

## 2. 快捷键

- macOS：`Shift+Cmd+C` / Windows & Linux：`Shift+Alt+C`
- `package.json` 使用 `key`（Win/Linux 默认）+ `mac`（macOS 覆盖）模式
- 用户 keybindings 使用 `isMac` / `isWindows` / `isLinux` when 条件

## 3. 功能行为

- 复制当前文件的路径与行号范围，格式为 `path.py:start-end`（可为相对或绝对路径）。
- 如果没有选区，则使用光标所在行，起止行相同。
- 如果选区结束位置在下一行第 0 列，则结束行会减 1，避免多算空行。

## 4. 示例输出

- `src/app.py:10-42`
- `/Users/liaohuqiu/.../vhash-vscode-ext/AGENTS.md:20-20`

## 5. 本地安装（Cursor / VS Code）

1. 在本目录打开终端。
2. 执行 `npm install`。
3. 执行 `npm run compile`。
4. `Shift+Cmd+P` 打开命令面板，输入 `Extensions: Install from VSIX`，选择当前目录（或对应 `.vsix` 文件）。

## 6. 使用方法

1. 在编辑器中选中代码（或只放置光标）。
2. 运行命令 `VHash: Copy Path With Line Range`，或直接按默认快捷键。

## 7. 快捷键配置

自定义快捷键列表见 `keybindings.json`，安装扩展时自动导入到 Cursor/VS Code 的用户 keybindings。

快捷键优先级：用户 keybindings > 扩展 contributed > VS Code 内置，见 `README.md` 2.2。

## 8. 发布 Token

Token 写入 `~/.config/cpbox/cpbox-user.env`（用户级配置，不提交到仓库）：

```
AZURE_DEVOPS_PAT_FOR_VSCE=<your-azure-pat>
OPENVSX_PAT=<your-openvsx-pat>
```

- `AZURE_DEVOPS_PAT_FOR_VSCE`：VS Code Marketplace 发布，https://dev.azure.com/liaohuqiu/_usersSettings/tokens
- `OPENVSX_PAT`：OpenVSX (Cursor) 发布，https://open-vsx.org/user-settings/tokens

## 9. 发布注意事项

- VS Code Marketplace 会永久保留 extension `name` 和 `displayName`，即使 unpublish + delete 后也无法再次使用。
  - 已保留不可用的 name：`vhash-vscode-ext`、`vhash-vscode-ext-v1`
  - 已保留不可用的 displayName：`vHash`、`vHash Tools`
  - 当前 VS Marketplace 使用 name `vhash-vscode-ext-v2`，displayName `vHash Copy Path`
- Cursor (OpenVSX) 无此限制，与 VS Marketplace 保持统一，使用 name `vhash-vscode-ext-v2`，displayName `vHash Copy Path`
- 图标使用 terminal 风格（`$ _vH`，icon-08）
