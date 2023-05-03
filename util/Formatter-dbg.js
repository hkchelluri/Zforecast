sap.ui.define([], function () {
	"use strict";
	return {
			CalendarWeekConvert: function(number) {
				// alert("Hi from Formatter");
				if(number != null){
				var zPeriod = this.byId("PeriodReport").getSelectedKey();
				if (zPeriod === 'Week') {
					return "CW" + number;
				}
				
				else{
					// var zYearModel = this.getView().getModel("yearModel");
					// var zDate = zYearModel.oData.results[number].Value;
					// return zDate;
				}
			}
			},
			
			addNewLine: function(Notes) {
				
				
			var notes = Notes;
			
		notes = notes.replace("<br>", "\n");
			

			return notes;
		},
			productCount : 	function(oValue) {
    //return the number of products linked to Category // sync call only to get $count
   
       return oValue.length;
    
},
		
	};
});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
			// CalendarWeekConvert: function(number) {
			// 	// alert("Hi from Formatter");
			// 	var zPeriod = this.byId("PeriodReport").selectedKey();
			// 	if (zPeriod === 'Week') {
			// 		return "CW" + number;
			// 	}
			// 	else{
			// 		var zYearModel = this.getView().getModel("yearModel");
			// 		var zDate = zYearModel.oData.results[number].Value;
			// 		return zDate;
			// 	}
			// }