# vHash

Copy file paths with line ranges in VS Code / Cursor.

## Usage

### Command

Run `vHash: Copy Path With Line Range` from the command palette (`Shift+Cmd+P`), or press the default shortcut `Shift+Cmd+C` (when the editor is focused).

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

These custom keybindings are configured in `keybindings.yaml` / `keybindings.json` and auto-imported on install.

- `shift+cmd+e` — 在文件浏览器中定位当前文件
- `alt+f` — 全局搜索
- `shift+cmd+o` — 快速打开文件（同时禁用默认符号跳转）
- `shift+cmd+[` — 切换到上一个编辑器标签页
- `shift+cmd+]` — 切换到下一个编辑器标签页
- `shift+cmd+c` — 非编辑区时复制文件路径
- `alt+cmd+c` — 禁用默认复制路径快捷键（让出给扩展命令）

Copy the entries from `keybindings.json` into Cursor/VS Code's `keybindings.json` to configure manually.
