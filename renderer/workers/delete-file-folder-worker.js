/*----------------------------------------
* File/Folder delete worker
*----------------------------------------*/
self.addEventListener('message', async (event) => {
    const passedData = event.data;
    let jsonObject = passedData.jsonData;

    let returnObject = removeObjectById(passedData.object[0].id, jsonObject);

    // Sort the JSON objects using the custom sorting function
    jsonDataSort(returnObject);

    // Passed proceed data
    self.postMessage({
        directoryResources: returnObject,
    });
});

function removeObjectById(id, dataSource) {
    // Find the parent object containing the object to be removed
    let parentObject = null;
    let removeObjectIndex = -1;

    for (let i = 0; i < dataSource.length; i++) {
        const object = dataSource[i];

        // If the object's ID matches, remove it
        if (object.id === id) {
            parentObject = dataSource;
            removeObjectIndex = i;
            break;
        }

        // If the object has children, recursively search them
        if (object.children) {
            const result = removeObjectById(id, object.children);
            if (result.parentObject) {
                parentObject = result.parentObject;
                removeObjectIndex = result.removeObjectIndex;
                break;
            }
        }
    }

    // If the object to be removed is found, remove it and return the updated JSON object
    if (parentObject && removeObjectIndex !== -1) {
        parentObject.splice(removeObjectIndex, 1);
    }

    return dataSource;
}

function jsonDataSort(data) {
    data.sort((a, b) => {
        if (a.type === b.type) {
            // if both have children, sort by directory first
            if (a.children && b.children) {
                if (a.type === 'directory' && b.type === 'directory') {
                    return -1;
                } else if (a.type === 'file' && b.type === 'file') {
                    return 1;
                } else if (a.type === 'directory' && b.type === 'file') {
                    return -1;
                } else {
                    return 1;
                }
            } else if (a.children) {
                return -1; // a has children, b does not
            } else if (b.children) {
                return 1; // b has children, a does not
            } else {
                return 0; // both do not have children
            }
        } else if (a.type === 'directory' && b.type === 'file') {
            return -1; // sort directory before file
        } else {
            return 1; // sort file after directory
        }
    });
}
