/**
 * class StackTableView implements View
 * HTML tableView of the Stack
 * @param containerId : identifier of the HTML element that will contain the HeapView 
 * @author michael
 */

 define("StackTableView",
["View", "PointerDataType", "PointerMemoryValue"],
function(View, PointerDataType, PointerMemoryValue) {
	 
	function StackTableView(showDebugInfos, showIntermediateCells, extComponent) {
		View.call(this);		// View implementation

		this.showDebugInfos = showDebugInfos;
		this.showIntermediateCells = showIntermediateCells;		
		this.extComponent = extComponent;
		
		//this.update(undefined);
	}

	// Prototype based inheritance
	StackTableView.prototype = new View();
	StackTableView.prototype.constructor = StackTableView;

	// @Override
	StackTableView.prototype.update = function(memory) {
		var d1 = new Date();		
		
		var html = this.updateStack(memory);
		if (this.extComponent != undefined) {
			this.extComponent.update(html);
		//	this.extComponent.doLayout();
		}
		
		var d2 = new Date();
		this.log("stack view refresh: " + (d2 - d1));
	}	
	
	StackTableView.prototype.updateStack = function(memory) {		
		if (memory == undefined) {
			return "";
		}

		var stack = memory.getStack();
		
		var accumulatedNumberOfVariables = -1;		// - 1 est volontairement choisi pour compenser le accumulatedNumberOfVariables++ au premier tour de boucle
			
		var currentFunctionCall = stack.getCurrentNumberOfFunctions();  // on ne met pas de -1 pour compenser le premier currentFunctionCall--
		var numberOfVariablesInCurrentFunctionCall = 0;					// force l'initilisation de numberOfVariablesInCurrentFunctionCall au premier tour de boucle
			
		var stackTableHTML = "<table id='stackHTMLTable' border='1' class='flattenMemoryTable'>";
		stackTableHTML += "<col class='stackTableAddressColumn'/>";
		stackTableHTML += "<col class='stackTableValueColumn'/>";
		stackTableHTML += "<col class='stackTableVariableColumn'/>";
		stackTableHTML += "<col class='stackTableFunctionCallColumn'/>";
		stackTableHTML += "<tr><th colspan='4'>Stack</th>";
		stackTableHTML += "</tr><tr><th>Address</th><th>Value</th><th>Variable</th><th>Function<br/>call</th></tr>";

		var startAddress = memory.getSize();
		var endAddress = stack.getEndAddress();
			
		var valueRowSpan = 1;		// valeurs judicieusement choisies pour forcer une initialisation au premier tour de boucle
		var variableRowSpan = 1;
		var functionCallRowSpan = 0;
		var functionCallLimitClass;
		
		var dataType, enclosingDataType;		
		var dataSize, enclosingDataSize;

		//console.log("-------------");
		for (var i = endAddress + 1 ; i <= startAddress; i++) {
				
			stackTableHTML += "<tr>";		
								
			variableRowSpan--;
			
			if (numberOfVariablesInCurrentFunctionCall == 0) {
				functionCallLimitClass = "memoryTableLimitOfFunctionCall";
			} else {
				functionCallLimitClass = "";
			}
				 
			if (valueRowSpan > 1) {
				stackTableHTML += "<td> " + i + " </td>";
				stackTableHTML += "</tr>";
				valueRowSpan--;
				continue;
			}

			var value = memory.getValue(i, true); // true = internal access ; allows accessing to parts of memory values
			var unit = stack.getUnit(i);
			var dataAddress = unit.getAddress();
			var dataString = value.toString();
					
			if (unit.isComposedDataType()) {
				dataType = unit.getChild(i).getDataType();
			} else {
				dataType = unit.getDataType();
			}
					
			enclosingDataType = unit.getDataType();

			dataSize = dataType.getSize();						
			enclosingDataSize = enclosingDataType.getSize();

			stackTableHTML += "<td class='" + functionCallLimitClass + "'>" + i + " </td>";

			var valueBackgroundClassName = value.hasChanged() ? "changed" : "";		
			
			// special case of POINTER
			if (dataType instanceof PointerDataType) {
				typeClassName = "address";
				
				// le pointeur NIL n'est pas invalide
				if ( value != PointerMemoryValue.NIL.getPrimitiveValue() && memory.getUnit(value) == undefined) {
					valueBackgroundClassName = "invalid";
				}
				
			} else {
				typeClassName = "value";				
			}

			if (valueRowSpan == 1) {
				if (! this.showIntermediateCells) {
					valueRowSpan = dataSize;
				}
				stackTableHTML += "<td rowspan= '" + valueRowSpan + "' class='" + typeClassName + " " + valueBackgroundClassName + " " + functionCallLimitClass + "'> " + dataString + " </td>"; 						
			}


			var unitBackgroundClassName = unit.hasChangedRecursive() ? "changed" : "";	
			
			if (variableRowSpan == 0) {
				if (! this.showIntermediateCells) {
					variableRowSpan = enclosingDataSize;
				}								
				stackTableHTML += "<td rowspan= '" + variableRowSpan + "' class='" + typeClassName + " " + unitBackgroundClassName + " " + functionCallLimitClass + "'> " + stack.getVariableName(i) + "</td>";
				accumulatedNumberOfVariables++;	
			
				if (numberOfVariablesInCurrentFunctionCall == 0) {
					while ((currentFunctionCall >= 0) && (numberOfVariablesInCurrentFunctionCall == 0)) {
						currentFunctionCall--;
						numberOfVariablesInCurrentFunctionCall = stack.numberOfVariablesByFunction[currentFunctionCall];
					}
				
					if (currentFunctionCall >= 0) {
						if (numberOfVariablesInCurrentFunctionCall > 0) {
							var lastVariable = stack.variables[ stack.variables.length - accumulatedNumberOfVariables - numberOfVariablesInCurrentFunctionCall ];
							var endAddress = lastVariable.getAddress() + lastVariable.getSize();
							functionCallRowSpan = endAddress - i;
							stackTableHTML += "<td class='" + functionCallLimitClass + "' rowspan= '" + functionCallRowSpan + "'>" + currentFunctionCall  + "</td>";
						}
					}
				}
				if (numberOfVariablesInCurrentFunctionCall > 0) {
					--numberOfVariablesInCurrentFunctionCall;
				}
			}

		} // End for i
		
		stackTableHTML += "</table>";
				
		return stackTableHTML;
	}

	return StackTableView;
});
