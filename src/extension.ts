import * as vscode from 'vscode';
import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';

let eventsWebviewPanel: vscode.WebviewPanel;

export function activate(context: vscode.ExtensionContext) {

	// Start the server automatically when the extension is activated
	startServer();

	// Create the webview panel when the extension is activated
	eventsWebviewPanel = createWebviewPanel(context);
}

export function deactivate() { }

function startServer() {
	// Create an HTTP server
	const app = express();
	app.use(express.json());

	// Accept incoming events at /events endpoint
	app.post('/', (req, res) => {
		const payload = req.body;

		// Process the payload here
		console.log(payload);

		// Send the payload to the webview panel
		if (eventsWebviewPanel) {
			eventsWebviewPanel.webview.postMessage(payload);
		}

		res.sendStatus(200);
	});

	const httpServer = http.createServer(app);
	// Start the server on a dynamic port
	let port = 23517;
	httpServer.listen(port, () => {
		const address = httpServer.address();
		//const port = typeof address === 'object' ? address?.port : 0;
	});
}

function createWebviewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
	const panel = vscode.window.createWebviewPanel(
		'debugEvents',
		'Debug Events',
		vscode.ViewColumn.One,
		{
			enableScripts: true
		}
	);

	// Load the webview content from the file system
	const onDiskPath = vscode.Uri.file(context.extensionPath + '/frontend/webview.html');
	panel.webview.html = fs.readFileSync(onDiskPath.fsPath, 'utf8');

	return panel;
}