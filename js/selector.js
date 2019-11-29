function getSingleNodeSelectors(el) {
    const attributesSelectors = Array.from(el.attributes).map(function (attribute) {
        return `[${attribute.name}='${attribute.value.replace(/'/g, "\\'")}']`;
    });

    const nodeIndex = Array.from(el.parentNode.children).indexOf(el);

    const nodeSelectors = [
        el.tagName,
        ...attributesSelectors,
        `:nth-child(${nodeIndex + 1})`
    ];

    const optionalSelectors = getSubArrays(nodeSelectors)
        .sort((a, b) => a.length - b.length);

    return optionalSelectors;
}

function getSelectorCombinationsByLength(selectorsByElement, length) {
    if (length === 0) {
        return [];
    }

    const relevantSelectors = [];
    if (selectorsByElement.length === 1) {
        for (const selectors of selectorsByElement[0]) {
            if (selectors.length === length) {
                relevantSelectors.push(selectors.join(''));
            }
        }
    } else {
        for (const selectors of selectorsByElement[0]) {
            if (selectors.length <= length) {
                const options = getSelectorCombinationsByLength(selectorsByElement.slice(1), length - selectors.length);
                for (const option of options) {
                    relevantSelectors.push(selectors.join('') + ' ' + option);
                }
            }
        }
    }

    // Remove unnecessary spaces
    return relevantSelectors.map(selector => selector.trim().replace(/  +/g, ' '));
}

function getSubArrays(array) {
    return array.reduce(
        (subsets, value) => subsets.concat(
            subsets.map(set => [...set, value])
        ),
        [[]]
    );
}

function isUnique(selector) {
    return document.querySelectorAll(selector).length === 1;
}

function getAllPathSelectors(el) {
    const targetElementSelectors = getSingleNodeSelectors(el).slice(1);
    const allPathSelectors = [targetElementSelectors];

    let parent = el.parentNode;
    while (parent.tagName !== 'HTML') {
        const parentSelector = getSingleNodeSelectors(parent);
        allPathSelectors.push(parentSelector);
        parent = parent.parentNode;
    }

    return allPathSelectors.reverse();
}

function getUniqueSelector(el) {
    const allPathSelectors = getAllPathSelectors(el);

    let maxSelectorsCount = 0;
    for (const nodeSelector of allPathSelectors) {
        maxSelectorsCount += nodeSelector[nodeSelector.length - 1].length;
    }

    for (let selectorsCount = 1; selectorsCount < maxSelectorsCount; selectorsCount++) {
        const selectors = getSelectorCombinationsByLength(allPathSelectors, selectorsCount);
        for (const selector of selectors) {
            if (isUnique(selector)) {
                return selector;
            }
        }
    }
}

export {getUniqueSelector as getUniqueSelector};
