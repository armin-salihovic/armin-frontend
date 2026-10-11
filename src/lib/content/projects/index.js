import MultiEffectsGuitarPedal from './multi-effects-guitar-pedal.js';
import StarQuest from './star-quest.js';
import Foodie from './foodie.js';
import MimoWebsite from './mimo-website.js';
import PickFix from './pick-fix.js';

export const projects = [
    MultiEffectsGuitarPedal,
    StarQuest,
    Foodie,
    MimoWebsite,
    PickFix,
];

export function getProject(slug) {
    return projects.find((project) => project.slug === slug) ?? null;
}
