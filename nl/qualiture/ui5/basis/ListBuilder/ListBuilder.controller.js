(function() {
    "use strict";

    sap.ui.controller("nl.qualiture.ui5.basis.ListBuilder", {

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf js.ui.ListBuilder
         */
        onInit: function() {},

        /**
         * Initializes the ListBuilder model
         */
        initListBuilderModel: function(pArgs) {
            var aAlreadySelectedKeys = this.getTargetKeys(pArgs);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
                left: {
                    data: pArgs.sourceData,
                    selectedKeys: aAlreadySelectedKeys
                },
                right: {
                    data: [],
                    selectedKeys: []
                },
                uiSettings: {
                    keyField: pArgs.keyField,
                    descrField: pArgs.descrField,
                    btnAddEnabled: false,
                    btnAddAllEnabled: false,
                    btnRemoveEnabled: false,
                    btnRemoveAllEnabled: false,
                    btnUpEnabled: false,
                    btnDownEnabled: false
                }
            });

            sap.ui.getCore().setModel(oModel, "listBuilderModel");

            this.swapItems("left", "right", pArgs.keyField);

        },

        /**
         * Extracts the key values from the target's model data array
         */
        getTargetKeys: function(pArgs) {
            var aTargetData = pArgs.targetModel.getProperty(pArgs.targetProperty);
            var aTargetKeys = [];

            for (var i in aTargetData) {
                aTargetKeys.push(aTargetData[i][pArgs.keyField]);
            }

            return aTargetKeys;
        },

        /**
         * Swaps the selected items from one pane to the other
         */
        swapItems: function(pFrom, pTo) {
            var oModel = sap.ui.getCore().getModel("listBuilderModel");
            var oSelectedKeys = oModel.getProperty("/" + pFrom + "/selectedKeys");
            var oItemsFrom = oModel.getProperty("/" + pFrom + "/data");
            var oItemsTo = oModel.getProperty("/" + pTo + "/data");
            var keyField = oModel.getProperty("/uiSettings/keyField");

            var aItemsToBeMoved = [];
            oSelectedKeys.forEach(function(key) {
                var selectedObject = $.grep(oItemsFrom, function(obj) {
                    return obj[keyField] === key;
                })[0];
                aItemsToBeMoved.push(selectedObject);
            });

            aItemsToBeMoved.forEach(function(item) {
                var index = oItemsFrom.indexOf(item);
                oItemsFrom.splice(index, 1);
            });

            oItemsTo.push.apply(oItemsTo, aItemsToBeMoved);

            sap.ui.getCore().getModel("listBuilderModel").setProperty("/" + pFrom + "/data", oItemsFrom);
            sap.ui.getCore().getModel("listBuilderModel").setProperty("/" + pTo + "/data", oItemsTo);
            sap.ui.getCore().getModel("listBuilderModel").setProperty("/" + pFrom + "/selectedKeys", []);
        },

        /**
         * Swaps all items from one pane to the other
         */
        swapAllItems: function(pFrom, pTo) {
            var oModel = sap.ui.getCore().getModel("listBuilderModel");
            var aAllItems = oModel.getProperty("/" + pFrom + "/data");
            var keyField = oModel.getProperty("/uiSettings/keyField");
            var aKeys = [];

            aAllItems.forEach(function(obj) {
                aKeys.push(obj[keyField]);
            });

            oModel.setProperty("/" + pFrom + "/selectedKeys", aKeys);

            this.swapItems(pFrom, pTo);
        },

        /**
         * Moves the selected items up one position
         */
        moveItemsUp: function(pItems, pIndices) {
            var aNewIndices = [];

            for (var i = 0; i < pIndices.length; i++) {
                var newIndex = pIndices[i] - 1;

                var element = pItems[pIndices[i]];
                pItems.splice(pIndices[i], 1);
                pItems.splice(newIndex, 0, element);

                aNewIndices.push(newIndex);
            }

            return aNewIndices;
        },

        /**
         * Moves the selected items down one position
         */
        moveItemsDown: function(pItems, pIndices) {
            var aNewIndices = [];

            for (var i = pIndices.length - 1; i >= 0; i--) {
                var newIndex = pIndices[i] + 1;

                var element = pItems[pIndices[i]];
                pItems.splice(pIndices[i], 1);
                pItems.splice(newIndex, 0, element);

                aNewIndices.push(newIndex);
            }

            return aNewIndices;
        },

        /**
         * Applies the constructed list to the target model
         */
        applySelection: function(pArgs) {
            var aItems = sap.ui.getCore().getModel("listBuilderModel").getProperty("/right/data");
            pArgs.targetModel.setProperty(pArgs.targetProperty, aItems);
        }
    });
})();