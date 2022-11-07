import { Token, TokenType } from "./Lexer";

export class Filter{
	public isDirectChild = false;
	public isClassName = false;
	public isIDName = false;
	public identifier: Token = new Token();
}

export class Rule{
	public constructor(
		public keys: Filter[],
		public values: Token[]
	){}
}

export class Scope{
	public subscopes: Scope[] = [];
	public rules: Rule[] = [];

	public constructor(public filters: Filter[]){}
}

export class Parser{
	public constructor(private readonly tokens: Token[]){}
	private currentTokenIndex = 0;
	
	public get currentToken(): Token{ return this.tokens[this.currentTokenIndex]; }
	public get previousToken(): Token{ return this.tokens[this.currentTokenIndex - 1]; }

	private match(...types: TokenType[]){
		const m = types.some(t => t === this.currentToken.type);
		if(m) this.currentTokenIndex++;
		return m;
	}

	private advance(){ return this.tokens[this.currentTokenIndex++] }

	private checkAndConsume(type: TokenType){
		if(this.currentToken.type == type){
			const ret = this.currentToken;
			this.currentTokenIndex++;
			return ret;
		}else{
			throw new Error(`Expected ${TokenType[type]} but received ${TokenType[this.currentToken.type]}`);
		}
	}

	private scopes: Scope[] = [];

	private parseFilters(){
		const filters: Filter[] = [];
		do{
			// match a single filter
			const filter = new Filter();
			
			if(this.match(TokenType.LESS_THAN)) filter.isDirectChild = true;
			if(this.match(TokenType.POUND)) filter.isIDName = true;
			else if(this.match(TokenType.DOT)) filter.isClassName = true;
			const identifier = this.checkAndConsume(TokenType.IDENTIFIER);
			filter.identifier = identifier;

			filters.push(filter);
		}while(this.match(TokenType.COMMA));

		return filters;
	}

	private getValues(): Token[]{
		const ret: Token[] = [];
		
		while(!this.match(TokenType.SEMICOLON)){
			ret.push(this.advance());	
		}

		return ret;
	}
	
	private getScope(filters: Filter[]): Scope{
		const scope = new Scope(filters);

		while(!this.match(TokenType.RIGHT_BRACE)){
			const subscopeFilters = this.parseFilters();
			if(this.match(TokenType.COLON)){
				// get the values to the right
				const values = this.getValues();
				scope.rules.push(new Rule(subscopeFilters, values));
			}else if(this.match(TokenType.LEFT_BRACE)){
				const subscope = this.getScope(subscopeFilters);
				scope.subscopes.push(subscope)
			}
		}

		return scope;
	}

	private parseNext(){
		// parse the filters for the current scope
		const filters = this.parseFilters();
		this.checkAndConsume(TokenType.LEFT_BRACE);
		const scope = this.getScope(filters);
		
		this.scopes.push(scope)
	}

	public parse(){
		while(this.currentToken.type != TokenType.EOF) this.parseNext();
		return this.scopes;
	}
}