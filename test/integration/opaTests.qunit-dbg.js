/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"E102/zForecast/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});