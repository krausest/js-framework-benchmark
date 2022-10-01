cp webdriver-ts-results/table.html ../krausest.github.io/js-framework-benchmark/current.html
cp webdriver-ts-results/BoxPlotTable*.js ../krausest.github.io/js-framework-benchmark/
cd ../krausest.github.io
git add js-framework-benchmark/current.html
git add js-framework-benchmark/BoxPlotTable*.js
git commit -m "update results"
git push
cd ../js-framework-benchmark/webdriver-ts