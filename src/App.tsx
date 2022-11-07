import React from "react";
import Editor from "react-simple-code-editor"
import { pipeline } from "./logic";
import "./main.css"

const EditorStyles = {
	minHeight: "200px",
	borderRadius: "10px",
	backgroundColor: "#202020",
	fontFamily: '"Fira code", "Fira Mono", monospace',
	fontSize: 16,
}

function App() {
	const [code, setCode] = React.useState(
	`body{
  text-align: center;
	
  >.header, >#footer{
    background-color: gray;
  }
}`);
	const [output, setOutput] = React.useState("<nothing to show>");
	
	return (
		<div className="container">
			<header>
				<h1>scinss</h1>
				<h2>a rudimentary css preprocessor</h2>
			</header>

			<h2>Editor</h2>
			<form onSubmit={(e) => {
				e.preventDefault();
				setOutput(pipeline(code));
			}}>
				<Editor
					value={code}
					onValueChange={code => setCode(code)}
					highlight={_ => _}
					padding={15}
					placeholder="// enter your scinss here"
					style={ EditorStyles }
					required
				/>

				<button type="submit" className="submitButton">Compile!</button>
			</form>

			<h2>Output</h2>
			<textarea readOnly id="output" value={output} disabled style={{
				...EditorStyles,
				border: "none",
				padding: 15,
				resize: "none",
				minWidth: "100%",
			}}></textarea>
		</div>
	)
}

export default App
