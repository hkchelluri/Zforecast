function initModel() {
	var sUrl = "/sap/opu/odata/ui2/INTEROP/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}