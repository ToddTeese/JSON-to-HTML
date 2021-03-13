const displayArea = document.querySelector('.displayArea');
const jsonInput = document.querySelector('#jsonInput');

let flattenedKeys = [];
let sortedKeys = [];
let keysWithValues = [];
let objectToDisplay = {};

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

objectToDisplay = testObject;



function changeJSON() {
    let parsedObject = {};
    try {
        parsedObject = JSON.parse(jsonInput.value);
        console.log(parsedObject);
    } catch (error) {
        console.error(error);
    }
    objectToDisplay = parsedObject;
    displayJSON();
}

function displayJSON() {
    flattenedKeys = flattenToArray(objectToDisplay, '');
    sortedKeys = sortKeysByDepth(flattenedKeys);
    keysWithValues = [];
    
    for(let i = 0; i < sortedKeys.length; i++) {
        keysWithValues.push(new ValueBlock(sortedKeys[i], objectToDisplay))
    }

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
}

displayJSON();

function handleValueBlockClick(event) {
    let target = event.target.dataset.target;
    let element = document.querySelector('[data-path="'+ target +'"]');
    let currentHiddenState = element.dataset.hidden;
    currentHiddenState = currentHiddenState == undefined ? 'false' : currentHiddenState;
    element.dataset.hidden = currentHiddenState == 'false' ? true : false;
}

