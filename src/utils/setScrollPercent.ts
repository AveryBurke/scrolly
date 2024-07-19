/**
 * Set the scroll-y css variable to the percentage of the page that has been scrolled
 * @example 250 means the second page is 50% visible
 */
export function setScrollPercent() {
    const doc = document.documentElement;
    doc.style.setProperty("--scroll", (doc.scrollTop/doc.clientHeight * 100).toFixed(0) ); // set the scroll-y css variable
}