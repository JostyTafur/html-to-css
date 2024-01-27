import * as vscode from 'vscode';

import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let includeOne = vscode.commands.registerCommand(
    "html-to-css.createCSS",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor");
        return;
      }
      const selectedText = editor.document.getText(editor.selection);

      const classRegex = /\bclass=["']([^"']+)["']/g;
      const classNameRegex = /\bclassName=["']([^"']+)["']/g;
      const idRegex = /\bid=["']([^"']+)["']/g;

      let cssRules = "";

      // Buscar clases específicas de la etiqueta en el HTML
      let match;
      while ((match = classRegex.exec(selectedText))) {
        const classNames = match[1].split(/\s+/); // Separar las clases
        classNames.forEach((className) => {
          cssRules += `.${className} {\n  /* Your styles here */\n}\n`;
        });
      }

      while ((match = classNameRegex.exec(selectedText))) {
        const classNames = match[1].split(/\s+/); // Separar las clases
        classNames.forEach((className) => {
          cssRules += `.${className} {\n  /* Your styles here */\n}\n`;
        });
      }

      // Buscar IDs específicos de la etiqueta en el HTML
      while ((match = idRegex.exec(selectedText))) {
        const idName = match[1];
        cssRules += `#${idName} {\n  /* Your styles here */\n}\n`;
      }

      // Get the active file's path
      const activeFilePath = editor.document.uri.fsPath;
      const htmlFileName = path.basename(activeFilePath);
      const htmlFileDir = path.dirname(activeFilePath);

      // Build the path for the stylesheet in the same folder as the HTML file
      const cssFileName = htmlFileName.replace(/\.[^.]+$/, "") + ".css";
      const cssFilePath = path.join(htmlFileDir, cssFileName);

      // Check if there are any CSS files in the same folder
      vscode.workspace
        .findFiles(new vscode.RelativePattern(htmlFileDir, "*.css"))
        .then((cssFiles) => {
          if (cssFiles.length > 0) {
            // Use the first found CSS file
            vscode.workspace.openTextDocument(cssFiles[0]).then((cssDoc) => {
              vscode.window.showTextDocument(cssDoc).then((editor) => {
                editor.edit((editBuilder) => {
                  editBuilder.insert(
                    new vscode.Position(editor.document.lineCount, 0),
                    cssRules
                  );
                });
              });
            });
          } else {
            // No CSS file found, create a new one
            vscode.workspace.fs.writeFile(
              vscode.Uri.file(cssFilePath),
              new TextEncoder().encode(cssRules)
            );
            vscode.workspace.openTextDocument(cssFilePath).then((cssDoc) => {
              vscode.window.showTextDocument(cssDoc);
            });
          }
        });
    }
  );

  let includeAll = vscode.commands.registerCommand(
    "html-to-css.createAllCSS",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor");
        return;
      }

      const document = editor.document;
      const htmlContent = document.getText();

      // Regex para encontrar clases y IDs en el HTML
      const classRegex = /\bclass=["']([^"']+)["']/g;
      const classNameRegex = /\bclassName=["']([^"']+)["']/g;
      const idRegex = /\bid=["']([^"']+)["']/g;

      let cssRules = "";

      // Buscar clases en el HTML
      let match;
      while ((match = classRegex.exec(htmlContent))) {
        const classNames = match[1].split(/\s+/); // Separar las clases
        classNames.forEach((className) => {
          cssRules += `.${className} {\n  /* Your styles here */\n}\n`;
        });
      }

      while ((match = classNameRegex.exec(htmlContent))) {
        const classNames = match[1].split(/\s+/); // Separar las clases
        classNames.forEach((className) => {
          cssRules += `.${className} {\n  /* Your styles here */\n}\n`;
        });
      }

      // Buscar IDs específicos de la etiqueta en el HTML
      while ((match = idRegex.exec(htmlContent))) {
        const idName = match[1];
        cssRules += `#${idName} {\n  /* Your styles here */\n}\n`;
      }

      // Get the active file's path
      const activeFilePath = editor.document.uri.fsPath;
      const htmlFileName = path.basename(activeFilePath, ".html");
      const htmlFileDir = path.dirname(activeFilePath);

      // Build the path for the stylesheet in the same folder as the HTML file
      const cssFileName = htmlFileName.replace(/\.[^.]+$/, "") + ".css";
      const cssFilePath = path.join(htmlFileDir, cssFileName);

      // Check if there are any CSS files in the same folder
      vscode.workspace
        .findFiles(new vscode.RelativePattern(htmlFileDir, "*.css"))
        .then((cssFiles) => {
          if (cssFiles.length > 0) {
            // Use the first found CSS file
            vscode.workspace.openTextDocument(cssFiles[0]).then((cssDoc) => {
              vscode.window.showTextDocument(cssDoc).then((editor) => {
                editor.edit((editBuilder) => {
                  editBuilder.insert(
                    new vscode.Position(editor.document.lineCount, 0),
                    cssRules
                  );
                });
              });
            });
          } else {
            // No CSS file found, create a new one
            vscode.workspace.fs.writeFile(
              vscode.Uri.file(cssFilePath),
              new TextEncoder().encode(cssRules)
            );
            vscode.workspace.openTextDocument(cssFilePath).then((cssDoc) => {
              vscode.window.showTextDocument(cssDoc);
            });
          }
        });
    }
  );

  context.subscriptions.push(includeAll);

  context.subscriptions.push(includeOne);
}

// This method is called when your extension is deactivated
export function deactivate() {}
