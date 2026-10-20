const vscode = require('vscode');
const path = require('path');
const { wrapForSlate } = require('./wrap');

const EXT_TO_LANG = {
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.css': 'css',
  '.html': 'html',
  '.htm': 'html',
};

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('copyForSlate.copy', async (uri) => {
      const editor = findEditor(uri);
      if (!editor) {
        vscode.window.showWarningMessage('Copy for Slate: no active editor.');
        return;
      }

      const doc = editor.document;
      const lang = EXT_TO_LANG[path.extname(doc.fileName).toLowerCase()] || doc.languageId;

      // Copy the selection(s) if there are any, otherwise the whole file.
      const selected = editor.selections
        .filter((s) => !s.isEmpty)
        .map((s) => doc.getText(s))
        .join('\n');
      const content = selected || doc.getText();
      const scope = selected ? 'selection' : 'file';

      const output = wrapForSlate(content, lang);
      if (output === null) {
        vscode.window.showWarningMessage(
          `Copy for Slate: unsupported file type "${lang}". Use a JS, CSS, or HTML file.`
        );
        return;
      }

      await vscode.env.clipboard.writeText(output);
      const asIs = output === content ? ' (already wrapped, copied as-is)' : '';
      vscode.window.setStatusBarMessage(`$(check) Copied ${scope} for Slate${asIs}`, 3000);
    })
  );
}

// The editor/title button passes the file's URI; prefer the visible editor for that file.
function findEditor(uri) {
  if (uri instanceof vscode.Uri) {
    const match = vscode.window.visibleTextEditors.find(
      (e) => e.document.uri.toString() === uri.toString()
    );
    if (match) return match;
  }
  return vscode.window.activeTextEditor;
}

function deactivate() {}

module.exports = { activate, deactivate };
