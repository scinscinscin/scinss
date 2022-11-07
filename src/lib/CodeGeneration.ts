import { Filter, Scope } from "./Parser";

export class CodeGenerator{
	public constructor(
		public readonly scopes: Scope[],
		public readonly shared: string[],
		public readonly parentPrefixes: string[] = [""]
	){}
	
	public buildFilters(filters: Filter[]){
		const ret: string[] = [];
		this.parentPrefixes.forEach(parentPrefix => {
			filters.forEach(filter => {
				let append = "";
				if(filter.isDirectChild) append += " >";
				if(filter.isClassName) append += " .";
				else if(filter.isIDName) append += " #";
				append += filter.identifier.value;

				ret.push(parentPrefix + append)
			})
		})
		return ret;
	}

	public generate(){
		this.scopes.forEach(currentScope => {
			const filters = this.buildFilters(currentScope.filters);

			// Handle current rules
			if(currentScope.rules.length != 0){
				let own = filters.join(", ") + "{\n"
				currentScope.rules.forEach(rule => {
					const value = rule.values.map(t => t.value).join(" ");
					rule.keys.forEach(t => {
						own += `\t${t.identifier.value}: ${value};\n`;
					})
				})
				own += "}\n";
				
				this.shared.push(own);
			}

			// Handle subscopes in the current scope
			const subscopeCodegen = new CodeGenerator(currentScope.subscopes, this.shared, filters);
			subscopeCodegen.generate();
		})
	}
}