import {panelData, panelOpen} from "./store.js";

let panelOpenValue;
let panelDataValue = null;

panelOpen.subscribe((value) => {
    panelOpenValue = value;
})

panelData.subscribe((value) => {
    panelDataValue = value;
})

function closePanel() {
    if(panelOpenValue) {
        panelData.set(null);
        document.body.classList.remove('html-panel')
        document.body.classList.remove('noscroll')
        panelOpen.set(false);
        document.title = "Projects | Armin Salihović";
    }
}

function openPanel() {
    document.body.classList.add('html-panel')
    document.body.classList.add('noscroll')
    document.title = `${panelDataValue?.title ?? 'Projects'} | Armin Salihović`;
    panelOpen.set(true);
}

export const usePanel = () => {  return {
    closePanel, openPanel,
}}
