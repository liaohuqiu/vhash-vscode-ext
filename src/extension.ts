import * as vscode from "vscode";
import * as os from "os";

import { getFileOrDirectoryName, getPathRelativeToHome } from "./path-utils";

type VimBinding = {
  before: string[];
  commands: string[];
};

const VIM_BINDINGS: VimBinding[] = [
  { before: [",", "c", "n"], commands: ["vhashTools.copySelectionPathRange"] },
  { before: [",", "c", "h"], commands: ["vhashTools.copyPathRelativeToHome"] },
  { before: [",", "c", "f"], commands: ["vhashTools.copyFileOrDirectoryName"] },
];

function getSelectionRange(editor: vscode.TextEditor): { startLine: number; endLine: number } {
  const sel = editor.selection;

  if (sel.isEmpty) {
    const line = sel.active.line + 1;
    return { startLine: line, endLine: line };
  }

  let startLine = sel.start.line;
  let endLine = sel.end.line;

  if (sel.end.character === 0 && endLine > startLine) {
    endLine -= 1;
  }

  return { startLine: startLine + 1, endLine: endLine + 1 };
}

function getAbsolutePath(document: vscode.TextDocument): string {
  return document.uri.fsPath;
}

function getTargetUris(resource?: vscode.Uri, selectedResources?: vscode.Uri[]): vscode.Uri[] {
  if (selectedResources && selectedResources.length > 0) {
    return selectedResources;
  }
  if (resource) {
    return [resource];
  }
  const editor = vscode.window.activeTextEditor;
  return editor ? [editor.document.uri] : [];
}

function getLocalFileUris(resource?: vscode.Uri, selectedResources?: vscode.Uri[]): vscode.Uri[] | undefined {
  const uris = getTargetUris(resource, selectedResources);
  if (uris.length === 0) {
    vscode.window.showWarningMessage("No active file or directory");
    return undefined;
  }
  if (uris.some((uri) => uri.scheme !== "file")) {
    vscode.window.showWarningMessage("Only local files and directories are supported");
    return undefined;
  }
  return uris;
}

async function copyLines(lines: string[]): Promise<void> {
  const text = lines.join("\n");
  await vscode.env.clipboard.writeText(text);
  vscode.window.showInformationMessage(lines.length === 1 ? `Copied: ${text}` : `Copied ${lines.length} items`);
}

function upsertVimBindings(items: VimBinding[]): VimBinding[] {
  const managedSequences = new Set(VIM_BINDINGS.map((binding) => binding.before.join("\u0000")));
  return [...items.filter((item) => !managedSequences.has(item.before.join("\u0000"))), ...VIM_BINDINGS];
}

async function configureVimKeybindings(): Promise<void> {
  const config = vscode.workspace.getConfiguration("vim");
  const settingNames = ["normalModeKeyBindingsNonRecursive", "visualModeKeyBindingsNonRecursive"];
  for (const settingName of settingNames) {
    const currentItems = config.inspect<VimBinding[]>(settingName)?.globalValue ?? [];
    await config.update(settingName, upsertVimBindings(currentItems), vscode.ConfigurationTarget.Global);
  }
  vscode.window.showInformationMessage("Configured vHash Vim mappings: , c n / , c h / , c f");
}

export function activate(context: vscode.ExtensionContext): void {
  const copySelectionPathRange = vscode.commands.registerCommand("vhashTools.copySelectionPathRange", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor");
      return;
    }

    const document = editor.document;
    const absolutePath = getAbsolutePath(document);
    const { startLine, endLine } = getSelectionRange(editor);
    const text = `${absolutePath}:${startLine}-${endLine}`;

    await copyLines([text]);
  });

  const copyPathRelativeToHome = vscode.commands.registerCommand(
    "vhashTools.copyPathRelativeToHome",
    async (resource?: vscode.Uri, selectedResources?: vscode.Uri[]) => {
      const uris = getLocalFileUris(resource, selectedResources);
      if (!uris) {
        return;
      }
      const relativePaths = uris.map((uri) => getPathRelativeToHome(uri.fsPath, os.homedir()));
      if (relativePaths.some((relativePath) => relativePath === undefined)) {
        vscode.window.showWarningMessage("One or more selected resources are outside the user home");
        return;
      }
      await copyLines(relativePaths as string[]);
    }
  );

  const copyFileOrDirectoryName = vscode.commands.registerCommand(
    "vhashTools.copyFileOrDirectoryName",
    async (resource?: vscode.Uri, selectedResources?: vscode.Uri[]) => {
      const uris = getLocalFileUris(resource, selectedResources);
      if (!uris) {
        return;
      }
      await copyLines(uris.map((uri) => getFileOrDirectoryName(uri.fsPath)));
    }
  );

  const configureVim = vscode.commands.registerCommand("vhashTools.configureVimKeybindings", configureVimKeybindings);

  context.subscriptions.push(copySelectionPathRange, copyPathRelativeToHome, copyFileOrDirectoryName, configureVim);
}

export function deactivate(): void {}
