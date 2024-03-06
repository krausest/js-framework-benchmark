cp webdriver-ts-results/dist/index.html ../krausest.github.io/js-framework-benchmark/current.html
cp webdriver-ts-results/dist/BoxPlotTable*.js ../krausest.github.io/js-framework-benchmark/
cp webdriver-ts-results/dist/chartjs*.js ../krausest.github.io/js-framework-benchmark/
cp webdriver-ts-results/dist/index*.css ../krausest.github.io/js-framework-benchmark/
cp webdriver-ts-results/dist/index*.js ../krausest.github.io/js-framework-benchmark/
cd ../krausest.github.io
git add js-framework-benchmark/current.html
git add js-framework-benchmark/BoxPlotTable*.js
git add js-framework-benchmark/chartjs*.js
git add js-framework-benchmark/index*.css
git add js-framework-benchmark/index*.js
git commit -m "update results"
git push
cd ../js-framework-benchmark/webdriver-ts