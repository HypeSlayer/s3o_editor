import * as vscode from 'vscode';
import { RenderEditorProvider } from './Renderer';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.window.registerCustomEditorProvider('s3o.Renderer', new RenderEditorProvider(context)));
}
