/**
 * Extensions of JS types
 * @author michael
 */
 
/** 
 * Adds all the elements in the
 * specified arrays to this array. 
 **/
Array.prototype.addAll = function(other) {

	for (var i = 0;  i < other.length;  i++) {
		this.push(other[i]);
	}
  
}

var JSUtils = {
	
	throwException : function() {
		if (arguments.length >= 1) {
			var exceptionName = arguments[0];
			var exceptionConstructor = eval(exceptionName);
			var exceptionConstructorArguments = Array.prototype.slice.call(arguments, 1);	// on retire le premier argument
			
			var exception = new exceptionConstructor();
			exceptionConstructor.apply(exception, exceptionConstructorArguments);

			var error = new Error(exceptionName);		
			error.wrappedException = exception;
			throw error;
		}
	}
	
};
 