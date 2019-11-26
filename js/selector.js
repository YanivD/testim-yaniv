function getSingleNodeSelector(el) {
    const attributesSelectors = Array.from(el.attributes).map(function (attribute) {
        return `[${attribute.name}='${attribute.value.replace(/'/g, "\\'")}']`;
    });

    const nodeIndex = Array.from(el.parentNode.children).indexOf(el);
    return `${el.tagName}${attributesSelectors.join('')}:nth-child(${nodeIndex + 1})`;
}

function isUnique(selector) {
    return document.querySelectorAll(selector).length === 1;
}

function getUniqueSelector(el) {
    let selector = getSingleNodeSelector(el);

    let parent = el.parentNode;
    while (isUnique(selector) === false) {
        const parentSelector = getSingleNodeSelector(parent);
        selector = `${parentSelector} > ${selector}`;
        parent = parent.parentNode;
    }

    return selector;
}

export {getUniqueSelector as getUniqueSelector};
