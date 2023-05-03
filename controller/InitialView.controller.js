sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../util/Formatter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/Fragment",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/fe/navigation/NavigationHandler"
], function (Controller, Formatter, Export, ExportTypeCSV, Fragment, ValueState, Dialog, DialogType, Button, ButtonType, NavigationHandler) {
	"use strict";

	var jsonArr = [];

	return Controller.extend("E102.zForecast.controller.InitialView", {
		formatter: Formatter,

		onInit: function () {
			
			
			
			// POC: SaveAsTile with persistent data 
			
			var controller = this;
			this.oNavigationHandler = new NavigationHandler(this);
			var that = this;
			var oView = this.getView();
			var appStateKey = "";
			var url = window.location.href;
			var i = url.search('sap-iapp-state');
		
			if (i > 0) {
				i = i + 15;
				appStateKey = url.substring(i);
			}
		
			if (appStateKey) {
				var url1 = "/GlobalContainers('" + appStateKey + "')";
				var oModel = this.getOwnerComponent().getModel('GlobalContainers');
				var that1 = this;
				var functionSucess = function(oData, controller) {
					// sap.ui.core.BusyIndicator.hide();
					var oFilt = that1.getView().byId("smartFilterBar");
					var obj = JSON.parse(oData.value);
					oFilt.setDataSuiteFormat(JSON.stringify(obj.selectionVariant), true);
				};
		
				var functionError = function(oError) {
					// sap.ui.core.BusyIndicator.hide();
					var test = oError;
				}
		
				// sap.ui.core.BusyIndicator.show();
				var params = {
					success: function(oData, controller) {
						functionSucess(oData, controller);
					},
					error: function(oError) {
						functionError(oError);
					}
				};
		
				oModel.read(url1, params);
			}
			
			// if (oEvent.getSource().getSelectedKey() == "Report") {
				// this.byId("idSmartTable").setVisible(false);
				// this.byId("smartFilterBar").setVisible(false);
				// this.byId("idSmartTableReport").setVisible(true);
				// this.byId("smartFilterBarReport").setVisible(true);
				// this.byId("reportQty").setVisible(true);
				// this.byId("PurposeReport").setSelectedKey("Report");
				// this.byId("zSave").setVisible(false);
				// this.byId("zConvertPIR").setVisible(false);
				// this.beforeRebindTable();
			// } else if (oEvent.getSource().getSelectedKey() == "Review") {
				// this.byId("idSmartTable").setVisible(true);
				// this.byId("smartFilterBar").setVisible(true);
				// this.byId("reportQty").setVisible(false);
				// this.byId("idSmartTableReport").setVisible(false);
				// this.byId("smartFilterBarReport").setVisible(false);
				// this.byId("Purpose").setSelectedKey("Review");
				// this.byId("zSave").setVisible(true);
				// this.byId("zConvertPIR").setVisible(true);
			// }
			
			
			
			
			
			
			// this.getView().byId("PurposeReport").setSelectedKey("Review");
			// this.getView().byId("PurposeReport").fireChange(this);
			// this.getView().byId("Purpose").fireChange(this);
			// this.byId("idSmartTable").setVisible(true);
			// this.byId("smartFilterBar").setVisible(true);
			// this.byId("reportQty").setVisible(false);
			// this.byId("idSmartTableReport").setVisible(false);
			// this.byId("smartFilterBarReport").setVisible(false);
			// this.byId("Purpose").setSelectedKey("Review");
			// this.byId("zSave").setVisible(true);
			// this.byId("zConvertPIR").setVisible(true);
		},
		
		onAfterRendering: function(oEvent){
			this.getView().byId("PurposeReport").setSelectedKey("Review");
			this.getView().byId("PurposeReport").fireChange(this);
		},

		onSaveTilePress: function (oEvent) {
			debugger;
			var selPurpose = this.getView().byId("Purpose").getSelectedKey();
			var oSmartTable;
			if (selPurpose === "Report") {
				oSmartTable = this.getView().byId("idSmartTableReport").getTable();
			} else {
				oSmartTable = this.getView().byId("idSmartTable").getTable();
			}
			//save as tile code
			var that = this,
				oView = this.getView(),
				saveASTile = oView.byId("book");
			saveASTile.setBeforePressHandler(function () {
				var sFilterParams = oSmartTable.getBinding("rows").sFilterParams;
				sFilterParams = sFilterParams.replaceAll("%27", "'");
				sFilterParams = sFilterParams.replaceAll("%20", " ");
				// var filterParamPart1 = sFilterParams.split("%")[0];
				// var filterParamPart2 = "'" + sFilterParams.split("%27")[1] + "'";
				var serviceURL = that.getView().byId("idSmartTableReport").getTable().getBinding("rows").getModel().sServiceUrl +
					that.getView().byId("idSmartTableReport").getTable().getBinding("rows").sPath +
					"/$count?" + sFilterParams;
				var t = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(that.getOwnerComponent());
				t.setData(that.getView().byId("smartFilterBar").getUiState());
				t.save();
				var a = sap.ui.core.routing.HashChanger.getInstance();
				var i = "?" + "sap-iapp-state=" + t.getKey();
				a.replaceHash(i);
				saveASTile.setAppData({
					title: "SavedAppStateZ01",
					subtitle: "",
					info: "UserCreated",
					icon: "sap-icon://lightbulb",
					numberUnit: "",
					serviceUrl: serviceURL,
					serviceRefreshInterval: 0
				});
			});
		},

		_saveAppState: function (oEvent) {
			var t = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(oEvent.getOwnerComponent());
			t.setData(this.getView().byId("smartFilterBar").getUiState());
			t.save();
			var a = sap.ui.core.routing.HashChanger.getInstance();
			var i = "?" + "sap-iapp-state=" + t.getKey();
			a.replaceHash(i);
			// oEvent.getModel()
		},

		// onSaveTilePress: function () {
		// 	// create a new Application state (oAppState) for this Application instance
		// 	var oAppState = sap.ushell.Container
		// 		.getService("CrossApplicationNavigation")
		// 		.createEmptyAppState(this);
		// 	oAppState.setData(oStateToSave); // object of values needed to be restored
		// 	oAppState.save();
		// },
		
		// POC: SaveAsTile with persistent data 
		GoFilter: function(oEvent){
		debugger;	
		
		var oTable = this.oView.byId("idSmartTableReport");
		var oFilt = this.oView.byId("smartFilterBar");
		
		var mInnerAppData = {
			selectionVariant: oFilt.getDataSuiteFormat(),
			tableVariantId: oTable.getCurrentVariantId()
		};
		
		this.oNavigationHandler.storeInnerAppState(mInnerAppData);
		},

		onPressSaveAs: function (oEvent) {
			var oSource = oEvent.getSource();
			var oView = this.getView();
			var thisObj = this;
			if (!this.popOverInitialMethod) {
				this.popOverInitialMethod = Fragment.load({
					id: oView.getId(),
					name: "E102.zForecast.view.SaveAs",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;

				});
			}
			this.popOverInitialMethod.then(function (oPopover) {
				oPopover.openBy(oSource);
				thisObj.onSaveTilePress();

				// oPopover.open();
			});
		},

		onDataExport: function (oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(this.zFragment.getModel().oData);
			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
					fileExtension: "xls",
					separatorChar: "\t",
					charset: "utf-8"
				}),

				// Pass in the model created above
				models: oModel,

				// binding information for the rows aggregation
				rows: {
					path: "/results"
				},

				// column definitions with column name and binding info for the content

				columns: [{
						name: "W01",
						template: {
							content: "{W01}"
						}
					}, {
						name: "W02",
						template: {
							content: "{W02}"
						}
					}, {
						name: "W03",
						template: {
							content: "{W03}"
						}
					}, {
						name: "W04",
						template: {
							content: "{W04}"
						}
					}, {
						name: "W05",
						template: {
							content: "{W05}"
						}
					}, {
						name: "W06",
						template: {
							content: "{W06}"
						}

					}, {
						name: "W07",
						template: {
							content: "{W07}"
						}
					}, {
						name: "W08",
						template: {
							content: "{W08}"
						}
					}, {
						name: "W09",
						template: {
							content: "{W09}"
						}
					}, {
						name: "W10",
						template: {
							content: "{W10}"
						}
					}, {
						name: "W11",
						template: {
							content: "{W11}"
						}
					}, {
						name: "W12",
						template: {
							content: "{W12}"
						}
					}, {
						name: "W13",
						template: {
							content: "{W13}"
						}
					}, {
						name: "W14",
						template: {
							content: "{W14}"
						}
					}, {
						name: "W15",
						template: {
							content: "{W15}"
						}
					}, {
						name: "W16",
						template: {
							content: "{W16}"
						}

					}, {
						name: "W17",
						template: {
							content: "{W17}"
						}
					}, {
						name: "W18",
						template: {
							content: "{W18}"
						}
					}, {
						name: "W19",
						template: {
							content: "{W19}"
						}
					}, {
						name: "W20",
						template: {
							content: "{W20}"
						}
					}, {
						name: "W21",
						template: {
							content: "{W21}"
						}
					}, {
						name: "W22",
						template: {
							content: "{W22}"
						}
					}, {
						name: "W23",
						template: {
							content: "{W23}"
						}
					}, {
						name: "W24",
						template: {
							content: "{W24}"
						}
					}, {
						name: "W25",
						template: {
							content: "{W25}"
						}
					}, {
						name: "W26",
						template: {
							content: "{W26}"
						}

					}, {
						name: "W27",
						template: {
							content: "{W27}"
						}
					}, {
						name: "W28",
						template: {
							content: "{W28}"
						}
					}, {
						name: "W29",
						template: {
							content: "{W29}"
						}
					}, {
						name: "W30",
						template: {
							content: "{W30}"
						}
					}, {
						name: "W31",
						template: {
							content: "{W31}"
						}
					}, {
						name: "W32",
						template: {
							content: "{W32}"
						}
					}, {
						name: "W33",
						template: {
							content: "{W33}"
						}
					}, {
						name: "W34",
						template: {
							content: "{W34}"
						}
					}, {
						name: "W35",
						template: {
							content: "{W35}"
						}
					}, {
						name: "W36",
						template: {
							content: "{W36}"
						}

					}, {
						name: "W37",
						template: {
							content: "{W37}"
						}
					}, {
						name: "W38",
						template: {
							content: "{W38}"
						}
					}, {
						name: "W39",
						template: {
							content: "{W39}"
						}
					}, {
						name: "W40",
						template: {
							content: "{W40}"
						}
					}, {
						name: "W41",
						template: {
							content: "{W41}"
						}
					},

					{
						name: "W42",
						template: {
							content: "{W42}"
						}
					}, {
						name: "W43",
						template: {
							content: "{W43}"
						}
					}, {
						name: "W44",
						template: {
							content: "{W44}"
						}
					}, {
						name: "W45",
						template: {
							content: "{W45}"
						}
					}, {
						name: "W46",
						template: {
							content: "{W46}"
						}

					}, {
						name: "W47",
						template: {
							content: "{W47}"
						}
					}, {
						name: "W48",
						template: {
							content: "{W48}"
						}
					}, {
						name: "W49",
						template: {
							content: "{W49}"
						}
					}, {
						name: "W50",
						template: {
							content: "{W50}"
						}
					}, {
						name: "W51",
						template: {
							content: "{W51}"
						}
					}, {
						name: "W52",
						template: {
							content: "{W52}"
						}
					}
				]
			});

			// download exported file
			oExport.saveFile().catch(function (oError) {
				sap.m.MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function () {
				oExport.destroy();
			});
		},

		onpressClose: function () {
			this.zFragment.close();
		},

		//Called on change of Notes in Review Table. Updates the new notes value in the model.
		onNotesChange: function (oEvent) {
			var zKey = oEvent.getSource().getValue();
			var zPath = oEvent.getSource().getParent().getBindingContext().sPath;
			zPath = zPath.split("/")[1];
			this.byId("iduitable").getModel().oData[zPath].Notes = zKey;
		},

		// On Change of Status in Review - Updates the RecordStatus Value in the Model.
		onChangeStatus: function (oEvent) {
			var zKey = oEvent.getSource().getSelectedKey();
			var zPath = oEvent.getSource().getParent().getBindingContext().sPath;
			zPath = zPath.split("/")[1];
			this.byId("iduitable").getModel().oData[zPath].RecordStatus = zKey;

		},

		//Triggered on Refresh of Report Table. Sets the column width based on the values.
		beforeRebindTable: function (oEvent) {

			// var oTable = this.byId("idSmartTableReport");
			// // var i = 0;
			// oTable.getTable().getColumns().forEach(function (oLine,index) {
			// 	oLine.setWidth("100%");
			// 	oLine.getParent().autoResizeColumn(index);
			// // 	// i++;
			// });

		},
		beforeLoadTable: function (oEvent) {
			var zCount = oEvent.getSource()._getRowCount();
			// var oTable = this.byId("idSmartTable");
			// oTable.getTable().setVisibleRowCount(zCount);

		},

		// Called on press of Save button in Review Page. All the records with changes will be saved in C4.
		onSave: function (oEvent) {

			var that = this;
			var x = oEvent;
			var zIndices = this.byId("idSmartTable").getItems()[1].getSelectedIndices();
			if (zIndices === undefined || zIndices.length == 0) {

				var oErrorMessageDialog = new Dialog({
					type: DialogType.Message,
					title: "Error",
					state: ValueState.Error,
					content: new sap.m.Text({
						text: "Select atleast one line item"
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function () {
							that.byId("idSmartTable").getModel().refresh(true);
							that.byId("idSmartTable").rebindTable();
							oErrorMessageDialog.close();
						}
					})
				});

				oErrorMessageDialog.open();
			} else {
				sap.ui.core.BusyIndicator.show();
				var zArray = [];
				var Headers = {
					"ObjectId": "1234",
					"ForecastId": "123"
				};
				for (var x = 0; x < zIndices.length; x++) {
					// var tableArray = this.byId("iduitable").getRows()[zIndices[x]].getBindingContext().getObject();
					var tableArray = this.byId("iduitable").getContextByIndex(zIndices[x]).getObject();
					zArray.push({
						"ObjectId": tableArray.ObjectId,
						"ForecastId": tableArray.ForecastId,
						"VersionId": tableArray.VersionId,
						"RecordStatus": tableArray.RecordStatus,
						"Notes": tableArray.Notes,
						"NotesTemp": tableArray.NotesTemp,
						"ReOrdPtUpd": tableArray.ReOrdPtUpd
					});
				}
				Headers.toForecast = zArray;
				var qModel = that.getOwnerComponent().getModel();
				qModel.create("/Headers", Headers, {
					success: function (data) {

						sap.ui.core.BusyIndicator.hide();
						var dialog = new sap.m.Dialog({
							title: "Success!",
							type: "Message",
							state: "Success",
							content: new sap.m.Text({
								text: "Data posted to C4C Successfully!"
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function () {
									//sap.ui.core.BusyIndicator.show();
									that.byId("idSmartTable").rebindTable();
									sap.ui.core.BusyIndicator.hide();

									dialog.close();
								}
							}),

							afterClose: function () {
								dialog.destroy();
							}
						});
						dialog.open();

					},
					error: function (data) {
						sap.ui.core.BusyIndicator.hide();
						var resp = JSON.parse(data.responseText);
						var dialog = new sap.m.Dialog({
							title: "Error Occured",
							type: "Message",
							state: "Error",
							content: new sap.m.Text({
								text: resp.error.message.value
							}),
							beginButton: new sap.m.Button({
								text: 'OK',
								press: function () {
									//sap.ui.core.BusyIndicator.show();
									that.byId("idSmartTable").rebindTable();
									sap.ui.core.BusyIndicator.hide();

									dialog.close();
								}
							}),

							afterClose: function () {
								dialog.destroy();
							}
						});
						dialog.open();
					}

				});
			}
		},
		onPurposeChange: function (oEvent) {
			if (oEvent.getSource().getSelectedKey() == "Report") {
				this.byId("idSmartTable").setVisible(false);
				this.byId("smartFilterBar").setVisible(false);
				this.byId("idSmartTableReport").setVisible(true);
				this.byId("smartFilterBarReport").setVisible(true);
				// this.beforeRebindTable();
				this.byId("reportQty").setVisible(true);

				this.byId("PurposeReport").setSelectedKey("Report");
				this.byId("zSave").setVisible(false);
				this.byId("zConvertPIR").setVisible(false);
			} else if (oEvent.getSource().getSelectedKey() == "Review") {
				this.byId("idSmartTable").setVisible(true);
				this.byId("smartFilterBar").setVisible(true);
				this.byId("reportQty").setVisible(false);
				this.byId("idSmartTableReport").setVisible(false);
				this.byId("smartFilterBarReport").setVisible(false);
				this.byId("Purpose").setSelectedKey("Review");
				this.byId("zSave").setVisible(true);
				this.byId("zConvertPIR").setVisible(true);
			}
		},

		// Form the payload and call the batch function
		onConvertToPIR: function (Oevent) {
			var that = this;
			// sap.ui.core.BusyIndicator.show();
			var zIndices = this.byId("idSmartTable").getItems()[1].getSelectedIndices();
			if (zIndices === undefined || zIndices.length == 0) {

				var oErrorMessageDialog = new Dialog({
					type: DialogType.Message,
					title: "Error",
					state: ValueState.Error,
					content: new sap.m.Text({
						text: "Select atleast one line item"
					}),
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function () {
							that.byId("idSmartTable").rebindTable();
							oErrorMessageDialog.close();
						}
					})
				});

				oErrorMessageDialog.open();
			} else {
				sap.ui.core.BusyIndicator.show();
				this.zArray = [];
				var aFilters = this.byId("smartFilterBar").getFilters();
				var url = "/sap/opu/odata/sap/ZDTS_E102_FORECAST_V2_SRV/";
				var qModel = new sap.ui.model.odata.ODataModel(url, true);
				qModel.read("/Forecasts", {
					filters: aFilters,
					success: function (data) {
						for (var x = 0; x < zIndices.length; x++) {
							// Hari Chelluri - Incident 72520
							// var ObjectId = that.byId("iduitable").getBinding("rows").getContexts()[zIndices[x]].getObject()
							// 	.ObjectId;
							var ObjectId = that.byId("iduitable").getContextByIndex(zIndices[x]).getObject().ObjectId;
							// EOC - Archana Sakkuri - 7/29/2020
							for (var y = 0; y < data.results.length; y++) {
								if (data.results[y].ObjectId == ObjectId) {
									that.zArray.push(data.results[y]);
									break;
								}
							}
						}
						that.setPayload();
					},
					error: function (data) {}
				});
			}
		},

		setPayload: function () {
			this.statusCheckFlag = '';
			var that = this;
			var dFlag = true;
			var TableData = this.byId("iduitable").getRows();
			this.jsonArrayData = this.zArray;
			var zDate = "";
			var zWeek = "";
			that.Orders = [];

			for (var flag = 0; flag < this.jsonArrayData.length; flag++) {

				if (this.jsonArrayData[flag].RecordStatus !== "Z03" && this.jsonArrayData[flag].RecordStatus !== "Z08") {

					this.statusCheckFlag = 'X';
					break;
				} else {

					this.statusCheckFlag = '';

				}

				if (this.jsonArrayData[flag].PIRCreated === "YES") {
					this.statusCheckFlag = 'X';
					break;
				}

			}

			if (this.statusCheckFlag === 'X') {
				sap.ui.core.BusyIndicator.hide();
				var Statusdialog = new sap.m.Dialog({
					title: "Warning!",
					type: "Message",
					state: "Warning",
					content: new sap.m.Text({
						text: "Please select only Accepted / Cancelled records to post PIR / records Pending PIR creation ( PIRCreated not 'YES' ) "
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: function () {
							sap.ui.core.BusyIndicator.hide();
							dFlag = false;
							// Hari Chelluri - Incident 72520	
							//	that.byId("iduitable").getModel().refresh(true) ;
							Statusdialog.close();
						}
					})
				});
				Statusdialog.open();
			}

			if (this.statusCheckFlag !== 'X') {
				for (var i = 0; i < this.jsonArrayData.length; i++) {
					var SNo = "";
					var zNotes = "";
					var zStatus = "";
					var payload = {
						"SNo": SNo,
						"MaterialNumber": this.jsonArrayData[i].MaterialCode,
						"Plant": this.jsonArrayData[i].PlantCode,
						"RequirementType": "",
						"Version": this.jsonArrayData[i].VersionId,
						"DateType": "W",
						"FinishDate": zDate,
						"PlannedQuantity": this.jsonArrayData[i][zWeek],
						"VersionActive": "",
						"Status": "",
						"ForecastId": this.jsonArrayData[i].ForecastId,
						"VersionId": this.jsonArrayData[i].VersionId,
						"ObjectId": this.jsonArrayData[i].ObjectId,
						"CustomerNo": this.jsonArrayData[i].ShipToCustomerNo,
						"RecordStatus": zStatus,
						"Notes": zNotes,
						"Quarter": this.jsonArrayData[i].PlanningPeriod,
						"IsForecast": true,
						"Year": this.jsonArrayData[i].Year
					};
					this.arrayResponse = [];
					that.Orders.push(payload);
					jQuery.sap.ordersArr = that.Orders;

				}

				// break;

				// if ((i === this.jsonArrayData.length - 1) && (dFlag == true)) {
				var dialog = new sap.m.Dialog({
					title: "Warning!",
					type: "Message",
					state: "Warning",
					content: new sap.m.Text({
						text: "System will post the document now. Please confirm?"
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: function () {
							that.onPostDataForeground(that.Orders);
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function () {
							sap.ui.core.BusyIndicator.hide();
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();
				// }
			}
		},
		chunkArrayInGroups: function (arr, size) {
			//this function is for splitting the array into chunks of array
			var myArray = [];
			for (var i = 0; i < arr.length; i += size) {
				myArray.push(arr.slice(i, i + size));
			}
			return myArray;
		},

		// batch process - split the data into different batch calls and  submit batch - Gateway timeout based
		onPostDataForeground: function (overallRecords) {
			this.totalRecordsLength = overallRecords.length;
			var batchUrls = [];
			var stlmtRulesUrl = this.getOwnerComponent().getModel("PIR").sServiceUrl;
			var oModel = new sap.ui.model.odata.ODataModel(stlmtRulesUrl, {
				json: true
			});
			var chunkArr = [];
			var chunkArr = this.chunkArrayInGroups(overallRecords, 1);
			if (jQuery.sap.flg == undefined) {
				jQuery.sap.flg = 0;
			}
			var splitArr = [];
			splitArr = chunkArr[jQuery.sap.flg];
			for (var i = 0; i < overallRecords.length; i++) {
				var odatapayload = overallRecords[i];
				batchUrls.push(oModel.createBatchOperation("/Orders", "POST", odatapayload));
			}
			oModel.addBatchChangeOperations(batchUrls);
			oModel.setUseBatch(true);
			var that = this;
			oModel.submitBatch(function (oData, oResponse) {
					var arrayProcess = [];
					for (var b = 0; b < oData.__batchResponses[0].__changeResponses.length; b++) {
						arrayProcess.push(oData.__batchResponses[0].__changeResponses[b].data);
					}
					if (that.arrayResponse.length > 0) {
						Array.prototype.push.apply(that.arrayResponse, arrayProcess);
					} else {
						that.arrayResponse = arrayProcess;
					}
					if (that.totalRecordsLength === that.arrayResponse.length) {
						var jsonModel = new sap.ui.model.json.JSONModel();
						jsonModel.setData(that.arrayResponse);
						that.jsonArrayData = that.arrayResponse;
						jsonArr = that.arrayResponse;
						var fcSumm = that.arrayResponse[0].FCT_Summ;
						var csvJsonStr = that.csvJSON(fcSumm);

						var tModel = new sap.ui.model.json.JSONModel();
						tModel.refresh(true);
						tModel.setData(csvJsonStr);
						if (!that.zFragment) {
							that.zFragment = sap.ui.xmlfragment("E102.zForecast.view.PIRDialog", that);
						}
						that.zFragment.setModel(tModel);
						that.zFragment.setMultiSelect(true);
						sap.ui.getCore().byId("idTableSelect")._getOkButton().setText("Download Log File");
						// that.zFragment.setConfirmButtonText("Download Log File");
						tModel.setSizeLimit(500);
						that.zFragment.open();
						sap.ui.core.BusyIndicator.hide();
						that.byId("idSmartTable").getModel().refresh(true);
						that.byId("idSmartTable").rebindTable();
					}
					if (jQuery.sap.flg < chunkArr.length - 1) {
						jQuery.sap.flg++; // this will pick next set of 400 records
						this.onPostDataForeground(jQuery.sap.ordersArr); // this is a recursive function which calls itself after processing every 400 records
					} else if (jQuery.sap.flg == chunkArr.length - 1) {
						jQuery.sap.flg = undefined; // control comes here , once all 5000 records are processed
					}
				}.bind(this),

				function (err) {
					sap.ui.core.BusyIndicator.hide();
				});
		},
		onClose: function () {
			this.xFragment.close();
		},

		//Called on press of Display Mondays in Report View.Displays all the Mondays of the report.
		onPressMondays: function (oEvent) {
			var that = this;
			var qModel = that.getOwnerComponent().getModel();
			qModel.read("/F4YearDates", {
				success: function (data) {
					var tModel = new sap.ui.model.json.JSONModel();
					tModel.setData(data);
					that.zFragment = sap.ui.xmlfragment("E102.zForecast.view.CWReport", that);
					that.zFragment.setModel(tModel);
					tModel.setSizeLimit(500);
					that.zFragment.open();
				},
				error: function (data) {}
			});
		},

		csvJSON: function (csv) {
			var lines = csv.split("\n");
			var result = [];
			var headers = lines[0].split(",");
			for (var i = 1; i < lines.length; i++) {
				var obj = {};
				var currentline = lines[i].split(",");
				for (var j = 0; j < headers.length; j++) {
					obj[headers[j]] = currentline[j];
				}
				result.push(obj);
			}
			var oStringResult = JSON.stringify(result);
			var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ""));
			return oFinalResult;
		},

		downloadLogFile: function (oEvent) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(jsonArr);
			var oExport = new Export({

				exportType: new ExportTypeCSV({
					fileExtension: "xls",
					separatorChar: "\t"
				}),

				models: oModel,

				rows: {
					path: "/"
				},
				columns: [{
					name: "Material",
					template: {
						content: "{MaterialNumber}"
					}
				}, {
					name: "Plant",
					template: {
						content: "{Plant}"
					}
				}, {
					name: "ForecastId",
					template: {
						content: "{ForecastId}"
					}
				}, {
					name: "Status",
					template: {
						content: "{Status}"
					}
				}, {
					name: "Message",
					template: {
						content: "{ForecastMessage}"
					}
				}]
			});
			oExport.saveFile().catch(function (oError) {

			}).then(function () {
				oExport.destroy();
			});

		},

		handleOrdPtChange: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey(),
				sValue = oValidatedComboBox.getValue();

			if (!sSelectedKey && sValue) {
				oValidatedComboBox.setValueState("Error");
				oValidatedComboBox.setValueStateText("Please enter 'Yes' or 'No'!");
			} else {
				var zPath = oEvent.getSource().getParent().getBindingContext().sPath;
				zPath = zPath.split("/")[1];
				this.byId("iduitable").getModel().oData[zPath].ReOrdPtUpd = sSelectedKey;
			}
		}

	});
});