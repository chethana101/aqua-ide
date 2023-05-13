/*----------------------------------------
* Directory created folder directory update worker start
*----------------------------------------*/
self.addEventListener('message', async (event) => {
    const passedData = event.data;
    const jsonObject = passedData.jsonData;

    // Passed proceed data
    self.postMessage({
        directoryResources: [],
    });

    if (passedData.parent == 0) {
        jsonObject.push(passedData.newObject);

        // Sort the JSON objects using the custom sorting function
        jsonDataSort(jsonObject);
        // Passed proceed data
        self.postMessage({
            directoryResources: jsonObject,
        });
    } else {
        let objectToUpdate = findObjectById(passedData.parent[0].id, jsonObject);
        if (objectToUpdate?.children) {
            objectToUpdate.children.push(passedData.newObject);
        } else {
            objectToUpdate.children = [passedData.newObject];
        }

        // Sort the JSON objects using the custom sorting function
        jsonDataSort(objectToUpdate.children);

        // Passed proceed data
        self.postMessage({
            directoryResources: jsonObject,
        });
    }
});

function findObjectById(id, dataSource) {
    // Check all objects in the data source
    for (let i = 0; i < dataSource.length; i++) {
        const object = dataSource[i];

        // If the object's ID matches, return it
        if (object.id === id) {
            return object;
        }

        // If the object has children, recursively search them
        if (object.children) {
            const childObject = findObjectById(id, object.children);
            if (childObject) {
                return childObject;
            }
        }
    }

    // If no matching object was found, return null
    return null;
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
