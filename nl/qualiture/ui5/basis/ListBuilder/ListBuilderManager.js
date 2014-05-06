(function() {

    "use strict";

    jQuery.sap.declare("nl.qualiture.ui5.basis.ListBuilderManager");

    js.ui.ListBuilderManager = {

        _listBuilderView: null,

        /**
         * Builds and shows the ListBuilder dialog
         *
         * @param pArgs contains a Javascript object with following signature:
         * {
         *     targetModel    : the model the results will be stored to,
         *     targetProperty : the model property containing the array of items,
         *     sourceData     : the array holding all the available source items,
         *     keyField       : the key field of the targetProperty array objects,
         *     descrField     : the description field of the targetProperty array objects,
         *     dialogTitle    : title for the dialog,
         *     initialWidth   : width in pixels,
         *     initialHeight  : height in pixels
         * }
         */
        showListBuilderDialog: function(pArgs) {

            if (!this._listBuilderView) {
                this._listBuilderView = sap.ui.view({
                    id: "listBuilderView",
                    viewName: "nl.qualiture.ui5.basis.ListBuilder",
                    type: sap.ui.core.mvc.ViewType.JS
                });
            }

            var oDialog = this._listBuilderView.getListBuilderDialog(pArgs);

            this._listBuilderView.setButtonState();

            oDialog.open();
        }
    };
}());