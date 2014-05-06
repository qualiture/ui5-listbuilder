(function() {
    "use strict";

    sap.ui.jsview("nl.qualiture.ui5.basis.ListBuilder", {

        /** Specifies the Controller belonging to this View. 
         * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
         * @memberOf js.ui.ListBuilder
         */
        getControllerName: function() {
            return "nl.qualiture.ui5.basis.ListBuilder";
        },

        /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
         * Since the Controller is given to this method, its event handlers can be attached right away.
         * @memberOf js.ui.ListBuilder
         */
        createContent: function(oController) {},


        /**
         * Returns the actual ListBuilder dialog
         */
        getListBuilderDialog: function(pArgs) {

            this.getController().initListBuilderModel(pArgs);

            return new sap.ui.commons.Dialog("oDListBuilderDialog", {
                title: pArgs.dialogTitle,
                modal: true,
                width: pArgs.initialWidth + "px",
                minHeight: pArgs.initialHeight + "px",
                maxHeight: pArgs.initialHeight + "px",
                content: [
                    this.getListBuilderLayout(pArgs)
                ],
                closed: function(oEvent) {
                    oEvent.getSource().destroy();
                }
            });
        },

        /**
         * Returns the basic layout of the ListBuilder dialog
         */
        getListBuilderLayout: function(pArgs) {
            var oLayout = new sap.ui.commons.layout.MatrixLayout({
                columns: 4,
                height: "100%",
                width: "100%",
                widths: ["auto", "80px", "auto", "50px"],
                rows: new sap.ui.commons.layout.MatrixLayoutRow({
                    height: "100%",
                    cells: [
                        this.getLeftPane(pArgs),
                        this.getSelectButtonsPane(pArgs),
                        this.getRightPane(pArgs),
                        this.getOrderButtonsPane()
                    ]
                })
            });

            this.setButtonState();

            return oLayout;
        },

        /**
         * Returns the left pane (search field + listbox with available items)
         */
        getLeftPane: function(pArgs) {
            var oController = this.getController();

            var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                content: [
                    new sap.ui.commons.SearchField({
                        width: "100%",
                        enableListSuggest: false,
                        startSuggestion: 0,
                        suggest: function(oEvent) {
                            var searchValue = oEvent.getParameter("value");
                            var oFilter = new sap.ui.model.Filter(pArgs.descrField, sap.ui.model.FilterOperator.Contains, searchValue);
                            var oLeftListBox = sap.ui.getCore().getElementById("lbleft");
                            oLeftListBox.getBinding("items").filter([oFilter], sap.ui.model.FilterType.Application);
                        }
                    }),
                    this.getListBox("left", pArgs, "listBuilderModel>/left/data", pArgs.initialHeight - 22)
                ]
            });

            return oCell;
        },

        /**
         * Returns the layot with swap buttons
         */
        getSelectButtonsPane: function(pArgs) {
            var oController = this.getController();
            var oView = this;
            var oModel = sap.ui.getCore().getModel("listBuilderModel");

            var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                vAlign: "Middle",
                hAlign: "Center",
                content: [
                    new sap.ui.commons.layout.VerticalLayout({
                        content: [
                            new sap.ui.commons.Button({
                                icon: "sap-icon://media-play",
                                width: "40px",
                                enabled: "{listBuilderModel>/uiSettings/btnAddEnabled}",
                                press: function(oEvent) {
                                    oController.swapItems("left", "right");
                                    oView.setButtonState();
                                }
                            }),
                            new sap.ui.commons.Button({
                                icon: "sap-icon://media-forward",
                                width: "40px",
                                enabled: "{listBuilderModel>/uiSettings/btnAddAllEnabled}",
                                press: function(oEvent) {
                                    oController.swapAllItems("left", "right");
                                    oView.setButtonState();
                                }
                            }),
                            new sap.ui.commons.HorizontalDivider({
                                width: "50%"
                            }),
                            new sap.ui.commons.Button({
                                icon: "sap-icon://media-rewind",
                                width: "40px",
                                enabled: "{listBuilderModel>/uiSettings/btnRemoveAllEnabled}",
                                press: function(oEvent) {
                                    oController.swapAllItems("right", "left");
                                    oView.setButtonState();
                                }
                            }),
                            new sap.ui.commons.Button({
                                icon: "sap-icon://media-reverse",
                                width: "40px",
                                enabled: "{listBuilderModel>/uiSettings/btnRemoveEnabled}",
                                press: function(oEvent) {
                                    oController.swapItems("right", "left");
                                    oView.setButtonState();
                                }
                            }),
                            new sap.ui.commons.HorizontalDivider({
                                width: "50%"
                            }),
                            new sap.ui.commons.Button({
                                icon: "sap-icon://accept",
                                width: "40px",
                                style: "Accept",
                                press: function(oEvent) {
                                    oController.applySelection(pArgs);
                                    sap.ui.getCore().getElementById("oDListBuilderDialog").close();
                                }
                            })
                        ]
                    })
                ]
            });

            return oCell;
        },

        /**
         * Returns the right pane (listbox with chosen items)
         */
        getRightPane: function(pArgs) {
            var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                content: [
                    this.getListBox("right", pArgs, "listBuilderModel>/right/data", pArgs.initialHeight)
                ]
            });

            return oCell;
        },

        /**
         * Returns the layout with order buttons
         */
        getOrderButtonsPane: function() {
            var oView = this;

            var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
                vAlign: "Middle",
                hAlign: "Center",
                content: [
                    new sap.ui.commons.layout.VerticalLayout({
                        content: [
                            new sap.ui.commons.Button({
                                icon: "sap-icon://slim-arrow-up",
                                width: "40px",
                                enabled: "{listBuilderModel>/uiSettings/btnUpEnabled}",
                                press: function(oEvent) {
                                    oView.performMoveItems(-1);
                                }
                            }),
                            new sap.ui.commons.Button({
                                icon: "sap-icon://slim-arrow-down",
                                width: "40px",
                                enabled: "{listBuilderModel>/uiSettings/btnDownEnabled}",
                                press: function(oEvent) {
                                    oView.performMoveItems(1);
                                }
                            }),
                        ]
                    })
                ]
            });

            return oCell;
        },

        /**
         * Performs the act of changing the order of the chosen items
         */
        performMoveItems: function(pDirection) {
            var oController = this.getController();

            var aItems = sap.ui.getCore().getModel("listBuilderModel").getProperty("/right/data");
            var oListbox = sap.ui.getCore().getElementById("lbright");
            var aSelectedIndices = oListbox.getSelectedIndices();
            var aNewSelectedIndices = pDirection == -1 ? oController.moveItemsUp(aItems, aSelectedIndices) : oController.moveItemsDown(aItems, aSelectedIndices);

            oListbox.fireSelect(aNewSelectedIndices);
            oListbox.setSelectedIndices(aNewSelectedIndices);

            this.setButtonState();
        },

        /**
         * Returns the listbox
         */
        getListBox: function(pId, pArgs, pBindpath, pHeight) {
            var oView = this;

            var oItemTemplate = new sap.ui.core.ListItem({
                text: "{listBuilderModel>" + pArgs.descrField + "}",
                key: "{listBuilderModel>" + pArgs.keyField + "}"
            });

            var oListBox = new sap.ui.commons.ListBox("lb" + pId, {
                width: "100%",
                height: pHeight - 65 + "px",
                allowMultiSelect: true,
                select: function(oEvent) {
                    sap.ui.getCore().getModel("listBuilderModel").setProperty("/" + pId + "/selectedKeys", oEvent.getSource().getSelectedKeys());
                    oView.setButtonState();
                }
            });

            oListBox.bindAggregation("items", pBindpath, oItemTemplate);

            return oListBox;
        },

        /**
         * Sets the state for all buttons according to any selections/item availability/item order
         */
        setButtonState: function() {
            var oModel = sap.ui.getCore().getModel("listBuilderModel");
            var keyField = oModel.getProperty("/uiSettings/keyField");

            oModel.setProperty("/uiSettings/btnAddEnabled", oModel.getProperty("/left/selectedKeys").length > 0);
            oModel.setProperty("/uiSettings/btnRemoveEnabled", oModel.getProperty("/right/selectedKeys").length > 0);
            oModel.setProperty("/uiSettings/btnAddAllEnabled", oModel.getProperty("/left/data").length > 0);
            oModel.setProperty("/uiSettings/btnRemoveAllEnabled", oModel.getProperty("/right/data").length > 0);

            if (oModel.getProperty("/right/selectedKeys").length > 0) {
                var aRightData = oModel.getProperty("/right/data");
                var aRightKeys = [];

                for (var i in aRightData) {
                    aRightKeys.push(aRightData[i][keyField]);
                }

                var iRightDataLength = oModel.getProperty("/right/data").length;
                oModel.setProperty("/uiSettings/btnUpEnabled", aRightKeys.indexOf(oModel.getProperty("/right/selectedKeys")[0]) > 0);
                oModel.setProperty("/uiSettings/btnDownEnabled", aRightKeys.indexOf(oModel.getProperty("/right/selectedKeys")[oModel.getProperty("/right/selectedKeys").length - 1]) < iRightDataLength - 1);
            } else {
                oModel.setProperty("/uiSettings/btnUpEnabled", false);
                oModel.setProperty("/uiSettings/btnDownEnabled", false);
            }
        }
    });
})();