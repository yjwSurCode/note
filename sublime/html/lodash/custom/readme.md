npm init
npm i jest @types/jest

目前只支持
const sum = require('../src/sum.js');

module.exports = sum;

npm install @babel/core@7.4.5 @babel/preset-env@7.4.5 -D

{
"presets":[
[
"@babel/preset-env",{
"targets":{
"node":"current"
}
}
]
]
}





实时在浏览器预览：
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader clean-webpack-plugin   