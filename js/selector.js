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

    while (isUnique(selector) === false) {
        const parent = el.parentNode;
        const parentSelector = getSingleNodeSelector(parent);
        selector = `${parentSelector} > ${selector}`;
    }

    return selector;
}

export {getUniqueSelector as getUniqueSelector};
