# vHash

Copy file paths with line ranges in VS Code / Cursor.

## Usage

### Shortcut

| Platform | Shortcut |
|---|---|
| macOS | `Shift+Cmd+C` |
| Windows / Linux | `Shift+Alt+C` |

Or run `vHash: Copy Path With Line Range` from the command palette.

### Output

Copies the current file path with the selected line range to the clipboard:

```
src/app.py:10-42
```

- With a selection: copies `path:start-end`.
- Without a selection: uses the current line, start and end are the same.
- If the selection ends at column 0 of the next line, the end line is decremented by 1 to avoid counting trailing empty lines.

### Examples

| Scenario | Output |
|---|---|
| Selected lines 10–42 in `src/app.py` | `src/app.py:10-42` |
| Cursor on line 20, no selection | `/Users/.../file.ts:20-20` |

## Keybindings

These custom keybindings are defined in `keybindings.json` and auto-imported on install.

- `Shift+Cmd+E` / `Shift+Alt+E` — 在文件浏览器中定位当前文件
- `Shift+Cmd+F` — Mac 全局搜索 / `Shift+Alt+F` — Win&Linux 全局搜索
- `Shift+Cmd+O` / `Shift+Alt+O` — 快速打开文件
- `Shift+Cmd+[` / `Shift+Alt+[` — 切换到上一个编辑器标签页
- `Shift+Cmd+]` / `Shift+Alt+]` — 切换到下一个编辑器标签页
- `Shift+Cmd+C` / `Shift+Alt+C` — 复制文件路径与行号范围，或非编辑区复制文件路径

### Keybinding priority

系统级 → 扩展 contributed → 用户级，后者覆盖前者：

| Priority | Source | Overrides |
|---|---|---|
| Highest | User `keybindings.json` | Everything below |
| Medium | Extension `package.json` `contributes.keybindings` | VS Code defaults |
| Lowest | VS Code built-in defaults | — |

### Platform-specific keybinding

`package.json` extension contribution 使用 `key`（Windows/Linux 默认）+ `mac`（macOS 覆盖）模式：

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
