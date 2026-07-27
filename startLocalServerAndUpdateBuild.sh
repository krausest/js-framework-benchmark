# private file to copy the zip file from my VPS
set -e
git pull
echo "running zip on $VPS_HOST"
ssh $VPS_HOST "bash -i -c 'cd js-framework-benchmark && npm run zip'"
scp $VPS_HOST:/home/stefan/js-framework-benchmark/build.zip .
unzip -o build.zip
ssh $VPS_HOST "ls -l js-framework-benchmark/build.zip"
ls -l build.zip
npm start
