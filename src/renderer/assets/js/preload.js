const {ipcRenderer} = require('electron');
const fs = require("fs");
const path = require("path");
const css = require('css');

// const settingsOnPreLoad = fs.readFileSync(path.join("src/renderer/settings/config.json"));
const settingsOnPreLoad = fs.readFileSync(path.join(__dirname, '../../settings/config.json'));
// Parse the JSON data
const configJsonPreLoad = JSON.parse(settingsOnPreLoad);

// Check the settings theme
if (configJsonPreLoad.theme === "aqua-light") {
    // Usage example
    setCssVariablesFromCssFile(path.join(__dirname, "../css/theme/aqua-light.css"), 'aqua-light');
    // setCssVariablesFromCssFile("src\\renderer\\assets\\css\\theme\\aqua-light.css", 'aqua-light');
} else {
    setCssVariablesFromCssFile(path.join(__dirname, "../css/theme/aqua-dark.css"), 'aqua-dark');
    // setCssVariablesFromCssFile("src\\renderer\\assets\\css\\theme\\aqua-dark.css", 'aqua-dark');
}

// Set the theme css path and class name
function setCssVariablesFromCssFile(cssFilePath, className) {
    const cssContent = readCssFile(cssFilePath);
    const classProperties = getClassFromCss(cssContent, className);

    if (classProperties) {
        const rootProperties = Object.entries(classProperties)
            .map(([property, value]) => `${property}: ${value};`)
            .join(' ');

        const outputContent = `:root { ${rootProperties} }`;

        fs.writeFileSync(path.join(__dirname, "../css/variables.css"), outputContent, 'utf8');
    } else {
        console.log(`Class "${className}" not found in CSS file.`);
    }
}

// Get class from css file
function getClassFromCss(cssContent, className) {
    const parsedCss = css.parse(cssContent);
    const rule = parsedCss.stylesheet.rules.find((rule) => rule.type === 'rule' && rule.selectors.includes(`.${className}`));

    if (rule) {
        return rule.declarations.reduce((result, declaration) => {
            if (declaration.type === 'declaration') {
                result[declaration.property] = declaration.value;
            }
            return result;
        }, {});
    }

    return null;
}

// Read the css file
function readCssFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}
