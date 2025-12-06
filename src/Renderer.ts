import * as vscode from 'vscode';
import { Document } from './S3O/Document';
import { ParseTexture } from './Texture';

export class RenderEditorProvider implements vscode.CustomReadonlyEditorProvider<Document> {
	constructor(private readonly _context: vscode.ExtensionContext) { }

	//#region CustomEditorProvider
	async openCustomDocument(uri: vscode.Uri, openContext: { backupId?: string }, _token: vscode.CancellationToken): Promise<Document> {
		return await Document.create(uri, openContext.backupId);
	}

	async resolveCustomEditor(document: Document, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
		this.SetupWebView(document, webviewPanel.webview);
	}
	//#endregion

	private SetupWebView(document: Document, webview: vscode.Webview) {
		webview.options = { 
			enableScripts: true, 
			localResourceRoots: [ 
				vscode.Uri.joinPath(this._context.extensionUri, "media") 
			] 
		};

		async function TexFile(id: string, workspace : vscode.Uri, folder : string, file : string) : Promise<boolean> {
			const uri = vscode.Uri.joinPath(workspace, folder, file);
			try {
				webview.postMessage({ command: id, data: ParseTexture(file, await vscode.workspace.fs.readFile(uri)) });
			} catch (e) {
				if (e instanceof vscode.FileSystemError && e.code === 'FileNotFound') 
					return false;
				console.warn(`Error checking ${file}: ${e}`);
			}
			return true;
		}

		async function RefreshTexture(id: string, file: string) {
			if (!file) return;

			const workspace = document.Workspace();
			for (const path of ["Bitmaps", "UnitTextures"])
				if (await TexFile(id, workspace, path, file))
					return;
		}

		async function Refresh() {
			webview.postMessage({ command: "data", data: document.data });

			const t1 = RefreshTexture("texture1", document.data.texture1);
			const t2 = RefreshTexture("texture2", document.data.texture2);
			await t1;
			await t2;
		}

		webview.onDidReceiveMessage(message => {
			switch (message.command) {
			case "ready":
				Refresh();
				break;
			}
		});

		const mediaUri = (file: string) => webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, "media", file));
		webview.html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Spring unit</title>
</head>
<body>
	<canvas id="S3OPreview" width="1000" height="800">
	Preview
	</canvas>
	<script type="module" src="${mediaUri("render.js")}"></script>
</body>
</html>`;
	}
}