cd ../bcoin;npm run browserify;npm run uglify;
cd ..;cp bcoin/browser/bcoin.min.js rbcoin/bcoin.min.js;
cp bcoin/browser/bcoin.js rbcoin/bcoin.js;
rm -rf rbcoin/index.ios.js;
sed -e "/BCOINLIB/r rbcoin/bcoin.min.js" -e "/BCOINLIB/d" rbcoin/lib/index.ios.js > rbcoin/index.ios.js
sh rbcoin/node_modules/react-native/packager/packager.sh