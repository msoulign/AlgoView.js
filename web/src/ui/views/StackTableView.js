/**
 * class StackTableView implements View
 * HTML tableView of the Stack
 * @param containerId : identifier of the HTML element that will contain the HeapView 
 * @author michael
 */
 
var StackTableView = function(containerId, showDebugInfos, showIntermediateCells, extComponent) {

	View.call(this);		// View implementation
	
	var containerElement = document.getElementById(containerId);
	
	this.extComponent = extComponent;
	
	// @Override
	this.update = function(memory) {
		var d1 = new Date();		
		this.updateStack(memory);
		var d2 = new Date();
		this.log("stack view refresh: " + (d2 - d1));	
	}	
	
	this.updateStack = function(memory) {
		if (memory == undefined) {
			containerElement.innerHTML = "";
			return;
		}

		var stack = memory.getStack();
		
		var accumulatedNumberOfVariables = -1;		// - 1 est volontairement choisi pour compenser le accumulatedNumberOfVariables++ au premier tour de boucle
			
		var currentFunctionCall = stack.getCurrentNumberOfFunctions();  // on ne met pas de -1 pour compenser le premier currentFunctionCall--
		var numberOfVariablesInCurrentFunctionCall = 0;					// force l'initilisation de numberOfVariablesInCurrentFunctionCall au premier tour de boucle
			
		var stackTableHTML = "<table id='stackHTMLTable' border='1' class='flattenMemoryTable'>";
		stackTableHTML += "<tr><th colspan='4'>Stack</th>";
		stackTableHTML += "</tr><tr><th class='stackTableAddressCell'>Address</th><th>Value</th><th>Variable</th><th>Function<br/>call</th></tr>";

		var startAddress = memory.getSize();
		var endAddress = stack.getEndAddress();
			
		var valueRowSpan = 1;		// valeurs judicieusement choisies pour forcer une initialisation au premier tour de boucle
		var variableRowSpan = 1;
		var functionCallRowSpan = 0;
		
		var dataType, enclosingDataType;		
		var dataSize, enclosingDataSize;

		//console.log("-------------");
		for (var i = endAddress + 1 ; i <= startAddress; i++) {
				
			stackTableHTML += "<tr>";		
								
			variableRowSpan--;
				 
			if (valueRowSpan > 1) {
				stackTableHTML += "<td class='stackTableAddressCell'> " + i + " </td>";
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

			stackTableHTML += "<td>" + i + " </td>";


			var backgroundClassName = value.hasChanged() ? "changed" : "";		
			
			// special case of POINTER
			if (dataType instanceof PointerDataType) {
				typeClassName = "address";
				/*
				if( !unit.isValidPointer() ){
					backgroundClassName = "invalid";
				}*/

							
				
			} else {
				typeClassName = "value";				
			}

				

			if (valueRowSpan == 1) {
				if (! showIntermediateCells) {
					valueRowSpan = dataSize;
				}
				stackTableHTML += "<td rowspan= '" + valueRowSpan + "' class='" + typeClassName + " " + backgroundClassName + "'> " + dataString + " </td>"; 						
			}


			
			
			if (variableRowSpan == 0) {
				if (! showIntermediateCells) {
					variableRowSpan = enclosingDataSize;
				}								
				stackTableHTML += "<td rowspan= '" + variableRowSpan + "' class='" + typeClassName + " " + backgroundClassName + "'> " + stack.getVariableName(i) + "</td>";
				accumulatedNumberOfVariables++;	

			}
			
	

			if (numberOfVariablesInCurrentFunctionCall == 0) {
				currentFunctionCall--;		
				if (currentFunctionCall >= 0) {
					numberOfVariablesInCurrentFunctionCall = stack.numberOfVariablesByFunction[currentFunctionCall];

					
					var lastVariable = stack.variables[ stack.variables.length - accumulatedNumberOfVariables - numberOfVariablesInCurrentFunctionCall ];
					var endAddress = lastVariable.getAddress() + lastVariable.getSize();
					functionCallRowSpan = endAddress - i;

					
					stackTableHTML += "<td rowspan= '" + functionCallRowSpan + "'>" + currentFunctionCall  + "</td>";	
					
					
				}
			}				
			
		
				
			--numberOfVariablesInCurrentFunctionCall;



		} // End for i
		
		stackTableHTML += "</table>";
		containerElement.innerHTML = stackTableHTML;
		
		if (extComponent != undefined) {
			extComponent.doLayout();
		}
	}

}
