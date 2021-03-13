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