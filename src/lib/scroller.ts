import { setupObserver } from "./setupObserver";
export function scroller(){
    const root = document.querySelector("#frame")
    if(!root) {
        throw new Error("No root element found")
    }
    setupObserver(root, "0px 0px -20% 0px")
}