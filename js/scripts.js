import {getUniqueSelector} from "./selector.js";

document.body.addEventListener("mouseenter", function (e) {
    const selector = getUniqueSelector(e.target);
    console.log(selector);
}, true);
