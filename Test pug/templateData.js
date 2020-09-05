import fs from 'fs';
import path from 'path';

export function getSlideByDirectories(directories) {
    const slideByDirectory = {};
    for (let directory of directories) {
        slideByDirectory[directory] = [];
        const dir = fs.readdirSync(directory);
        for (let picture of dir) {
            const picturePath = path.join(directory, picture);
            slideByDirectory[directory].push(picturePath);
        }
    }
    return slideByDirectory;
};