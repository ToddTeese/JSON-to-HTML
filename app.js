const displayArea = document.querySelector('.displayArea');

let testObject = {
    Account: {
        Name: 'TestAccountName',
        ShippingPostalCode: 'T55 5TT',
        ShippingStreet : 'TestShippingStreet',
        Mailing: {
            Street : 'TestMailingStreet'
        }
    },
    Contact: {
        FirstName: 'TestFirstName',
        LastName: 'TestLastName',
        Entries: ['Apple', 'Orange', {Name:'Pear', Type:'Fruit'}]
    }
}

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

class ValueBlock {
    constructor(path, objectForValue) {
        this.setupInit();
        this.path = path;
        this.setupValue(path, objectForValue);

    }

    setupInit() {
        this.key = '';
        this.path = '';
        this.parentPath = '';
        this.value = '';
        this.depth = 0;
    }

    setupValue(path, objectForValue) {
        let splitPath = path.split('.');
        let parentPaths = [];
        this.depth = splitPath.length;
        let currentSource = objectForValue;
        for(let i = 0; i < splitPath.length; i++) {
            if(i == splitPath.length - 1) {
                
                this.key = splitPath[i];
                this.value = currentSource[splitPath[i]];
                if(this.value.toString() == '[object Object]' || Array.isArray(this.value)) {
                    this.value = '';
                }
            } else {
                parentPaths.push(splitPath[i]);
                currentSource = currentSource[splitPath[i]];

            }
        }
        this.parentPath = parentPaths.join('.');
    }
}

let flattenedKeys = flattenToArray(testObject, '');
let sortedKeys = sortKeysByDepth(flattenedKeys);
let keysWithValues = [];

for(let i = 0; i < sortedKeys.length; i++) {
    keysWithValues.push(new ValueBlock(sortedKeys[i], testObject))
}



// need to deal with parents and pathing

displayArea.innerHTML = '';
// so we add to the system from the top down.
for(let i = 0; i < keysWithValues.length; i++) {
    let currentValueBlock = keysWithValues[i];
    // get the target.
    // if no target, just default to display area
    let newBlock = document.createElement('div');
    newBlock.dataset.path = currentValueBlock.path;
    newBlock.dataset.key = currentValueBlock.key;

    // visible button toggle
    if(currentValueBlock.value == '') {
        let visibilityButton = document.createElement('button');
        // visibilityButton.innerText = 'Toggle Visibility';
        visibilityButton.dataset.target = currentValueBlock.path;
        visibilityButton.onclick = (event) => {handleValueBlockClick(event)};
        newBlock.appendChild(visibilityButton);
    }

    if(currentValueBlock.value) {
        newBlock.dataset.value = currentValueBlock.value;
    }
    let targetElement = document.querySelector('[data-path="'+currentValueBlock.parentPath+'"]');
    if(targetElement == null) {
        targetElement = displayArea;
    }

    targetElement.appendChild(newBlock);
}


function handleValueBlockClick(event) {
    let target = event.target.dataset.target;
    let element = document.querySelector('[data-path="'+ target +'"]');
    let currentHiddenState = element.dataset.hidden;
    currentHiddenState = currentHiddenState == undefined ? 'false' : currentHiddenState;
    element.dataset.hidden = currentHiddenState == 'false' ? true : false;
}

