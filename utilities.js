function flattenToArray(objectToFlatten, path) {
    let keys = [];
    let objectKeys = [];
    // check if object is Object
    if(objectToFlatten.toString() == '[object Object]' || Array.isArray(objectToFlatten)) {
        objectKeys = Object.keys(objectToFlatten);
    }

    for(let i = 0; i < objectKeys.length; i++) {
        let currentKey = objectKeys[i];
        let currentPath = (path ? path + '.' : '') + currentKey;
        keys.push(currentPath);
        let subKeys = flattenToArray(objectToFlatten[currentKey], currentPath);
        for(let j = 0; j < subKeys.length; j++) {
            keys.push(subKeys[j]);
        }
    }
    return keys;
}

function sortKeysByDepth(arrayToSort) {
    let sortedArray = [];
    let keysByDepth = {};
    for(let i = 0; i < arrayToSort.length; i++) {
        let depth = arrayToSort[i].split('.').length;
        if(!keysByDepth[depth]) {
            keysByDepth[depth] = [];
        }
        keysByDepth[depth].push(arrayToSort[i]);
    }
    let depthKeys = Object.keys(keysByDepth);

    for(let i = 0; i < depthKeys.length; i++) {
        let keyArr = keysByDepth[depthKeys[i]];
        for(let j = 0; j < keyArr.length; j++) {
            sortedArray.push(keyArr[j]);
        }
    }
    return sortedArray;
}
