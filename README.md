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
