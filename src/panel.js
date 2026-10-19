import {panelData, panelOpen} from "./store.js";

let panelOpenValue;
let panelDataValue = {content: ''};

panelOpen.subscribe((value) => {
    panelOpenValue = value;
})

panelData.subscribe((value) => {
    panelDataValue = value;
})

function closePanel(projectsTitle = 'Projects') {
    if(panelOpenValue) {
        panelData.set({content: ''});
        document.body.classList.remove('html-panel')
        document.body.classList.remove('noscroll')
        panelOpen.set(false);
        document.title = `${projectsTitle} | Armin Salihović`;
    }
}

function openPanel() {
    document.body.classList.add('html-panel')
    document.body.classList.add('noscroll')
    document.title = panelDataValue.title + ' | Armin Salihović';
    panelOpen.set(true);
}

export const usePanel = () => {  return {
    closePanel, openPanel,
}}
