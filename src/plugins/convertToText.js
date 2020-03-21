// convertToText.js
export function convertToText (idValue,unitList) {
    var unit = "";
    var unitItem = null;
    //根据id找到unitList[i]，再找到它的name
    for(var i=0;i<unitList.length;i++){
    	if(unitList[i].id === idValue){
    		unitItem = unitList[i];
    		unit=unitItem.name;
    	}
    }
    return unit;
};
