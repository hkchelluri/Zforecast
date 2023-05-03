sap.ui.define([], function() {
	"use strict";
	return {
		
		addNewLine: function(Notes) {
			var notes = Notes;
			
		notes = 	notes.replace("<br>", "\n");

			return notes;
		}
		
		
	};
	
	
}

);