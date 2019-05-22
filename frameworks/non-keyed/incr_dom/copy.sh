RELEASE_PATH="$(pwd)/dist"
mkdir -p $RELEASE_PATH

built=$(find | grep .bc.js | grep src)

cp $built $RELEASE_PATH
