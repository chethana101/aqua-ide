
self.addEventListener('message', async (event) => {
    let $tree = event.data;
    const div = document.createElement("div");
    div.appendChild($tree);
    console.log(div);
    $tree.collapseAll();
});
