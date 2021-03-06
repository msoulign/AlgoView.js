/**
 * class PointerMemoryValue extends MemoryValue
 * @param value : the value to store in the superclass field "value"
 * @author Michaël, Cédric
 **/

define("PointerMemoryValue",
// Attention: Ne pas inclure les autres xxMemoryValue comme dépendance car cela génère des pbs de dépendance circulaire
["BooleanMemoryValue", "MemoryState", "MemoryValue", "JSUtils"],
function(BooleanMemoryValue, MemoryState, MemoryValue, JSUtils) { 
 
	var PointerMemoryValue = function(value) {
		if (value != undefined) {
			MemoryValue.call(this, value, MemoryState.HAS_VALUE);
		} else {
			MemoryValue.call(this, undefined, MemoryState.UNDEFINED);
		}
		
		this.type = MemoryValue.POINTER;
	}

	// prototype based inheritance
	PointerMemoryValue.prototype = new MemoryValue();

	PointerMemoryValue.prototype.isNil = function() {
		if (this.value == 0) {
			return true;
		} else {
			return false;
		}
	}

	PointerMemoryValue.prototype.applyArithmeticOperator = function(operator, secondOperand) {
		JSUtils.throwException("CannotApplyArithmeticOperatorException");
	}

	PointerMemoryValue.prototype.applyTest = function(operator, secondOperand) {
		var expressionValue = 0;
		
		if (! (secondOperand instanceof PointerMemoryValue)) {
			JSUtils.throwException("CannotConvertMemoryValueException");
		}
		
		var val1 = this.value;
		var val2 = secondOperand.value;
		
		switch (operator) {
			case "EQ":
				expressionValue = (val1 == val2);
				break;
			case "NEQ":
				expressionValue = (val1 != val2);
				break;
			case "LT":
				JSUtils.throwException("CannotApplyTestOperatorException", "<");
				break;
			case "LTE":
				JSUtils.throwException("CannotApplyTestOperatorException", "<=");
				break;
			case "GT":
				JSUtils.throwException("CannotApplyTestOperatorException", ">");
				break;
			case "GTE":
				JSUtils.throwException("CannotApplyTestOperatorException", ">=");
				break;
		}
		return new BooleanMemoryValue(expressionValue);
	}

	PointerMemoryValue.prototype.convertTo = function(type) {
		// Attention: Faire les require ici pour éviter les pbs de dépendance circulaire
		switch (type) {
			case MemoryValue.BOOLEAN:
			case MemoryValue.INTEGER:
			case MemoryValue.CHARACTER:
			case MemoryValue.FLOAT:
				throw new CannotConvertTo();
				break;
			case MemoryValue.POINTER:
				return this;
				break;
		}
	}

	// @Override
	PointerMemoryValue.prototype.clone = function() { 	
		return new PointerMemoryValue(this.value, this.state);
	} 

	PointerMemoryValue.NIL = new PointerMemoryValue(0);

	return PointerMemoryValue;

});
