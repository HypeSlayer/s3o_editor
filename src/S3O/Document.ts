import * as vscode from 'vscode';
import { File as S3ORaw } from './s3oData';
import { File as S3OData } from './jsonData';
import { ThrowOnUndefined } from "../Utils";

export class Document  implements vscode.CustomDocument {

	static async create(uri: vscode.Uri, backupId: string | undefined): Promise<Document | PromiseLike<Document>> {
		const dataFile = backupId ? vscode.Uri.parse(backupId) : uri;
		if (uri.scheme === 'untitled') 
			return new Document(uri, new S3OData());
		return new Document(uri, S3OData.FromData(S3ORaw.FromBinary(await vscode.workspace.fs.readFile(dataFile))));
	}

	private constructor(public readonly uri: vscode.Uri, public readonly data: S3OData) { }

	dispose(): void {}

	public Workspace() : vscode.Uri {
		return ThrowOnUndefined(vscode.workspace.getWorkspaceFolder(this.uri), () => new Error(`Invalid workspace ${this.uri}`)).uri;
	}
}
