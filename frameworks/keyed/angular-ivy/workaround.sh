#!/bin/bash

sed -i -e 's/module": ".\/fesm5/module": ".\/esm2015/g' node_modules/@angular/core/package.json
sed -i -e 's/module": ".\/fesm5/module": ".\/esm2015/g' node_modules/@angular/common/package.json

awk '!/ApplicationModule.ngModuleDef = ɵdefineNgModule/' node_modules/@angular/core/fesm2015/core.js > temp && mv temp node_modules/@angular/core/fesm2015/core.js
awk '!/ApplicationModule.ngModuleDef = ɵdefineNgModule/' node_modules/@angular/core/fesm5/core.js > temp && mv temp node_modules/@angular/core/fesm5/core.js
awk '!/ApplicationModule.ngModuleDef = ɵngcc0.ɵdefineNgModule/' node_modules/@angular/core/esm2015/src/application_module.js > temp && mv temp node_modules/@angular/core/esm2015/src/application_module.js
awk '!/ApplicationModule.ngModuleDef = ɵngcc0.ɵdefineNgModule/' node_modules/@angular/core/esm5/src/application_module.js > temp && mv temp node_modules/@angular/core/esm5/src/application_module.js
