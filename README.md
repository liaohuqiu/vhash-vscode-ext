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

These custom keybindings are defined in `keybindings.yaml` / `keybindings.json` and auto-imported on install.

- `shift+cmd+e` — 在文件浏览器中定位当前文件
- `alt+f` — 全局搜索
- `shift+cmd+o` — 快速打开文件
- `shift+cmd+[` — 切换到上一个编辑器标签页
- `shift+cmd+]` — 切换到下一个编辑器标签页
- `shift+cmd+c` — 非编辑区时复制文件路径

### Platform-specific keybinding

VS Code extension 支持 `key`（Windows/Linux 默认）+ `mac`（macOS 覆盖）模式定义快捷键：

```json
{
  "key": "shift+alt+c",
  "mac": "shift+cmd+c",
  "command": "vhashTools.copySelectionPathRange",
  "when": "editorTextFocus"
}
```

- macOS: `Cmd` 映射到 Mac 的 Command 键，`alt` 映射到 Option
- Windows/Linux: `cmd` 映射到 Win 键，`alt` 映射到 Alt

Copy the entries from `keybindings.json` into Cursor/VS Code's `keybindings.json` to configure manually.
