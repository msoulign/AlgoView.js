define("FunctionParameterDeclarationNode",
["Node"],
function(Node){
	//Node
	function FunctionParameterDeclarationNode(tokenType, token) {	
		Node.call(this, tokenType, token); 
	}

	// prototype based inheritance
	FunctionParameterDeclarationNode.prototype = new Node();
	FunctionParameterDeclarationNode.prototype.constructor = FunctionParameterDeclarationNode;
return FunctionParameterDeclarationNode;
});