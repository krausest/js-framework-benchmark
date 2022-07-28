window.nonKeyedDetector_reset = function() {
    window.nonKeyedDetector_tradded = [];
    window.nonKeyedDetector_trremoved = [];
    window.nonKeyedDetector_removedStoredTr = [];
}

window.nonKeyedDetector_setUseShadowDom = function(useShadowDom ) {
    window.nonKeyedDetector_shadowRoot = useShadowDom;
}

function countDiff(list1, list2) {
    let s = new Set(list1);
    for (let o of list2) {
        s.delete(o);
    }
    return s.size;
}

window.nonKeyedDetector_instrument = function() {
    let node = document;
    if (window.nonKeyedDetector_shadowRoot) {
        let main = document.querySelector(nonKeyedDetector_shadowRoot);
        if (!main) return;
        node = main.shadowRoot;
    }
    var target = node.querySelector('table.table');
    if (!target) return false;

    function filterTRInNodeList(nodeList) {
        let trs = [];
        nodeList.forEach(n => {
            if (n.tagName==='TR') {
                trs.push(n);
                trs = trs.concat(filterTRInNodeList(n.childNodes));
            }
        });
        return trs;
    }

    function countSelectedTRInNodeList(nodeList) {
        let trFoundCount = 0;
        nodeList.forEach(n => {
            if (n==window.storedTr) {
                trFoundCount +=1;
            }
        });
        return trFoundCount;
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log(mutation.type, mutation.addedNodes.length, mutation.removedNodes.length, mutation);
            if (mutation.type === 'childList') {
                console.log('ADDED', filterTRInNodeList(mutation.addedNodes))
                nonKeyedDetector_tradded = nonKeyedDetector_tradded.concat(filterTRInNodeList(mutation.addedNodes));
                console.log('REMOVED', filterTRInNodeList(mutation.removedNodes))
                nonKeyedDetector_trremoved = nonKeyedDetector_trremoved.concat(filterTRInNodeList(mutation.removedNodes));
                nonKeyedDetector_removedStoredTr = nonKeyedDetector_removedStoredTr.concat(filterTRInNodeList(mutation.removedNodes));
            }
        });
    });
    var config = { childList:true, attributes: true, subtree: true, characterData: true };

    observer.observe(target, config);
    return true;
}
window.nonKeyedDetector_result = function() {
    return {tradded: nonKeyedDetector_tradded.length, trremoved: nonKeyedDetector_trremoved.length, removedStoredTr: nonKeyedDetector_trremoved.indexOf(window.storedTr)>-1, newNodes: countDiff(window.nonKeyedDetector_tradded, window.nonKeyedDetector_trremoved),
//      storedTr_debug: window.storedTr.innerText, trremoved_debug: nonKeyedDetector_trremoved.map(t => t.innerText).join(","),
//      traddedDebug: JSON.stringify(nonKeyedDetector_tradded.map(d => d.innerHTML))
    };
}
window.nonKeyedDetector_storeTr = function() {
    let node = document;
    if (window.nonKeyedDetector_shadowRoot) {
        let main = document.querySelector('${shadowRootName}');
        if (main) node = main.shadowRoot;
    }
    // Workaround: alpine adds a template with a tr inside the tbody. tr:nth-child(1) seems to be the tr from the template and returns null here.
    let index = node.querySelector('tr:nth-child(1)') ? 2 : 3;
    window.storedTr = node.querySelector('tr:nth-child('+index+')');
}
window.nonKeyedDetector_reset();