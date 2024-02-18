import * as vscode from 'vscode';

import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let includeOne = vscode.commands.registerCommand(
    "css-through-html.createCSS",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor");
        return;
      }
      const selectedText = editor.document.getText(editor.selection);  

      // Get the active file's path
      const activeFilePath = editor.document.uri.fsPath;
      const fileExtension = path.extname(activeFilePath);

      if(fileExtension === ".vue" || fileExtension === ".svelte" || fileExtension === ".astro") {
        makeCSSRulesforTag(selectedText, editor);
        
      } else {
        makeCSSRulesforFile(selectedText, activeFilePath);
      }
    }
  );

  let includeAll = vscode.commands.registerCommand(
    "css-through-html.createAllCSS",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor");
        return;
      }

      const document = editor.document;
      const htmlContent = document.getText();

      let cssRules = "";

      // Get the active file's path
      const activeFilePath = editor.document.uri.fsPath;
      const fileExtension = path.extname(activeFilePath);

      // Check if there are any CSS files in the same folder
      if (
        fileExtension === ".vue" ||
        fileExtension === ".svelte" ||
        fileExtension === ".astro"
      ) {
        makeCSSRulesforTag(htmlContent, editor);
      } else {
        makeCSSRulesforFile(htmlContent, activeFilePath);
      }
    }
  );

  context.subscriptions.push(includeAll);

  context.subscriptions.push(includeOne);
}

function makeCSSRulesforTag(selectedText:string, editor: vscode.TextEditor){
  let cssRules = "";
  const classRegex = /\bclass=["']([^"']+)["']/g;
  const classNameRegex = /\bclassName=["']([^"']+)["']/g;
  const idRegex = /\bid=["']([^"']+)["']/g;

  let match;
  while ((match = classRegex.exec(selectedText))) {
    const classNames = match[1].split(/\s+/); // Separar las clases
    classNames.forEach((className) => {
      cssRules += `\t.${className} {\n  \t/* Your styles here */\n\t}\n`;
    });
  }

  while ((match = classNameRegex.exec(selectedText))) {
    const classNames = match[1].split(/\s+/); // Separar las clases
    classNames.forEach((className) => {
      cssRules += `\t.${className} {\n  \t/* Your styles here */\n\t}\n`;
    });
  }

  // Buscar IDs específicos de la etiqueta en el HTML
  while ((match = idRegex.exec(selectedText))) {
    const idName = match[1];
    cssRules += `\t#${idName} {\n  \t/* Your styles here */\n\t}\n`;
  }

  let existingStyleTag = editor.document.getText().match(/<style[^>]*>/);
  if (existingStyleTag) {
    // Add CSS rules inside existing <style> tag
    const startTag = existingStyleTag[0];
    const endTag = "</style>";
    const insertionPosition = editor.document.positionAt(
      editor.document.getText().indexOf(endTag)
    );
    const fullStyleTag = cssRules + "\n";

    editor.edit((editBuilder) => {
      editBuilder.insert(insertionPosition, fullStyleTag);
    });
  } else {
    // Insert CSS rules inside new <style> tag
    const startTag = "\n<style>\n";
    const endTag = "\n</style>";
    const fullStyleTag = startTag + cssRules + endTag;

    editor.edit((editBuilder) => {
      editBuilder.insert(
        new vscode.Position(editor.document.lineCount, 0),
        fullStyleTag
      );
    });
  }
}

function makeCSSRulesforFile(selectedText: string, activeFilePath: string) {
  let cssRules = "";
  const classRegex = /\bclass=["']([^"']+)["']/g;
  const classNameRegex = /\bclassName=["']([^"']+)["']/g;
  const idRegex = /\bid=["']([^"']+)["']/g;

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
// This method is called when your extension is deactivated
export function deactivate() {}