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

### 1.1 复制文件路径与行号范围

- 命令 ID：`vhashTools.copySelectionPathRange`，命令名称：`VHash: Copy Path With Line Range`。

### 1.2 快捷键

| 平台 | 快捷键 |
|---|---|
| macOS | `Shift+Cmd+C` |
| Windows / Linux | `Shift+Alt+C` |

也可从命令面板运行 `VHash: Copy Path With Line Range`。

### 1.3 输出

复制当前文件路径与选中行号范围到剪贴板：

```
src/app.py:10-42
```

输出格式为 `path:start-end`。

- 有选区：复制 `path:start-end`。
- 无选区：使用光标所在行，起止行相同。
- 选区结���在下一行第 0 列时，结束行减 1，避免多算空行。

### 1.4 示例

| 场景 | 输出 |
|---|---|
| 选中 `src/app.py` 第 10–42 行 | `src/app.py:10-42` |
| 光标在第 20 行，无选区 | `/Users/.../file.ts:20-20` |

## 2. 快捷键配置

### 2.1 自定义快捷键列表

自定义快捷键定义在 `keybindings.json`，安装扩展时自动导入到 Cursor/VS Code 的用户 keybindings。

- `Shift+Cmd+P` / `Shift+Alt+P` — 打开命令面板
- `Shift+Cmd+E` / `Shift+Alt+E` — 在文件浏览器中定位当前文件
- `Shift+Cmd+F` — Mac 全局搜索 / `Shift+Alt+F` — Win&Linux 全局搜索
- `Shift+Cmd+O` / `Shift+Alt+O` — 快速打开文件
- `Shift+Cmd+[` / `Shift+Alt+[` — 切换到上一个编辑器标签页
- `Shift+Cmd+]` / `Shift+Alt+]` — 切换到下一个编辑器标签页
- `Shift+Cmd+C` / `Shift+Alt+C` — 复制文件路径与行号范围，或非编辑区复制文件路径

### 2.2 快捷键优先级

用户级 > 扩展 contributed > 系统内置，数字越小优先级越高：

| 优先级 | 来源 | 覆盖范围 |
|---|---|---|
| 1（最高） | 用户 `keybindings.json` | 覆盖下方所有 |
| 2 | 扩展 `package.json` `contributes.keybindings` | 覆盖系统默认 |
| 3（最低） | VS Code 内置默认 | — |

### 2.3 平台特定快捷键

扩展 `package.json` 使用 `key`（Windows/Linux 默认）+ `mac`（macOS 覆盖）模式：

```json
{
  "key": "shift+alt+c",
  "mac": "shift+cmd+c",
  "command": "vhashTools.copySelectionPathRange",
  "when": "editorTextFocus"
}
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
