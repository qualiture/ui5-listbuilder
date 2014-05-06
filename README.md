# _UI5 ListBuilder_

_Description: This project contains an OpenUI5 ListBuilder (synonyms: 'dual lists', 'swaplists', 'point&shoot' or even 'slushbuckets') control._

## Project Setup

1. Import the folder structure in your own project
2. Make a reference to the ListBuilder by adding `jQuery.sap.require("nl.qualiture.ui5.basis.ListBuilderManager");` in your code
3. Let's say you have a model `myModel` with a property where the selection will be stored `/selectedItems`. And an array of objects which will serve as the initial values for the list builder `var allItems = [ { ... }, etc]`. The items have, among other properties, a key field (e.g., `id`) and description field (e.g., `artDesc`)
3. Call the ListBuilder dialog via: 
```
nl.qualiture.ui5.basis.ListBuilderManager.showListBuilderDialog({
	targetModel    : sap.ui.getCore().getModel("myModel"),
	targetProperty : "/selectedItems",
	sourceData     : allItems,
	keyField       : "id",
	descrField     : "artDesc",
	dialogTitle    : "Choose articles",
	initialWidth   : 600, 
	initialHeight  : 350
});
```

This is a first, rough version, so if you have any contributions or sugesstions to add, feel free to do so!

Have fun!

Robin van het Hof / @Qualiture / http://www.qualiture.nl
