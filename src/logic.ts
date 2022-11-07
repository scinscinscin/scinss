import { CodeGenerator } from "./lib/CodeGeneration";
import { Lexer } from "./lib/Lexer";
import { Parser } from "./lib/Parser";

export function pipeline(input: string): string{
	try{
		const lexer = new Lexer(input);
		const tokens = lexer.lex();
		const parser = new Parser(tokens);
		const scopes = parser.parse();
		const output: string[] = [];
		const codegen = new CodeGenerator(scopes, output);
		codegen.generate()
		
		return output.join("\n");
		// return `${Math.random()}`;
	}catch(err){
		console.error(err);
		return "Failed to compile";
	}
}