export enum TokenType{
	NONE, EOF,
	LESS_THAN, COLON, SEMICOLON,
	DOT, COMMA, POUND, STAR,
	LEFT_BRACE, RIGHT_BRACE,
	IDENTIFIER
}

export class Token{
	public type: TokenType = TokenType.NONE;
	public value: string | null = null;

	public constructor(_type?: TokenType){
		if(_type) this.type = _type;
	}
}

const validIdentCh = (ch: string): boolean => {
	const chCode = ch.charCodeAt(0);

	// alpha num
	if(65 <= chCode && chCode <= 90) return true;
	if(97 <= chCode && chCode <= 122) return true;
	if(47 <= chCode && chCode <= 57) return true;
	
	return ch === "-" || ch === "_";
} 

export class Lexer{
	constructor(private readonly file: string){}
	private currentCharIndex = 0;
	
	private get currentChar() : string { return this.file[this.currentCharIndex] }
	private get previousChar() : string { return this.file[this.currentCharIndex - 1] }

	private tokens: Token[] = [];
	private currentToken: Token = new Token();

	private parseNextToken(){
		this.currentToken = new Token();
		switch(this.currentChar){
			case ' ':
			case '\t':
			case '\r':
			case '\n':
				break;
			case '>': this.currentToken.type = TokenType.LESS_THAN; break;
			case ':': this.currentToken.type = TokenType.COLON; break;
			case ';': this.currentToken.type = TokenType.SEMICOLON; break;
			case '.': this.currentToken.type = TokenType.DOT; break;
			case ',': this.currentToken.type = TokenType.COMMA; break;
			case '#': this.currentToken.type = TokenType.POUND; break;
			case '*': this.currentToken.type = TokenType.STAR; break;
			case '{': this.currentToken.type = TokenType.LEFT_BRACE; break;
			case '}': this.currentToken.type = TokenType.RIGHT_BRACE; break;
			default:
				if(validIdentCh(this.currentChar)) this.identifier();
				else throw new Error("Failed to match a handler for that character: " + this.currentChar);
		}

		if(this.currentToken.type != TokenType.NONE)
			this.tokens.push(this.currentToken);
		this.currentCharIndex++;
	}

	// function is called when the current char passes validIdentCh
	private identifier(){
		let ident = "";
		this.currentToken.type = TokenType.IDENTIFIER;
		while(validIdentCh(this.currentChar)){
			ident += this.currentChar;
			this.currentCharIndex++;
		}

		this.currentCharIndex--;
		this.currentToken.value = ident;
	}

	public lex(){
		while(this.currentCharIndex < this.file.length) this.parseNextToken();
		this.tokens.push(new Token(TokenType.EOF));
		return this.tokens;
	}
}