/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var navigator = {"vendorSub":"","productSub":"20030107","vendor":"Google Inc.","maxTouchPoints":0,"hardwareConcurrency":4,"appCodeName":"Mozilla","appName":"Netscape","appVersion":"5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36","platform":"MacIntel","product":"Gecko","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36","language":"en-US","languages":["ru-RU","ru","en-US","en"],"onLine":true,"cookieEnabled":true,"doNotTrack":null,"geolocation":{},"mediaDevices":{},"plugins":{"0":{"0":{},"1":{}},"1":{"0":{}},"2":{"0":{}},"3":{"0":{},"1":{}},"4":{"0":{}}},"mimeTypes":{"0":{},"1":{},"2":{},"3":{},"4":{},"5":{},"6":{}},"webkitTemporaryStorage":{},"webkitPersistentStorage":{},"serviceWorker":{},"credentials":{},"storage":{},"permissions":{},"presentation":{},"bluetooth":{}};
var crypto;
var masterCrypto = crypto = require('react-native-crypto');
var Level = require('react-native-level')
var net = require('react-native-tcp');

BCOINLIB

var logger = new bcoin.logger({ level: 'debug', console: true });

logger.open();


var chain = new bcoin.chain({
  db: 'leveldb',
  location: process.env.HOME + '/spvchain12',
  spv: true,
  network: 'main',
  logConsole: true,
  logger: logger
});

var pool = new bcoin.pool({
  chain: chain,
  spv: true,
  maxPeers: 8 ,
  logger: logger
});


  logger.writeConsole = function(level, module, args) {
    console.log(level,module,args);
  };

  logger.info = function(level, module, args) {
    console.log(level,module,args);
  };
      

var walletdb = new bcoin.walletdb({ db: 'memory' });

pool.open().then(function() {
  return walletdb.open();
}).then(function() {

  var w = new bcoin.hd.PrivateKey()
  w.fromSeed("5ad1fd622f79236309614c85c39b32b7999ef2ae175872e683c317db7375af5a")
  var key = w.toJSON()
  
  console.log("XPRIV", key.xprivkey);

  return walletdb.create({
      "master": key.xprivkey,
      "id": "AirBitzMain"
    });
}).then(function(wallet) {
  console.log("Root m/0/0/0 => "+wallet.getID());

    console.log('Main address: '+ wallet.getAddress('base58check'));
    

  // Add our address to the spv filter.
  pool.watchAddress(wallet.getAddress());

  wallet.getAccountPaths(0).then(function(result){
      var a;
      for (var i in result){
        a =result[i].toAddress();

        // console.log("Paths======>",a.toString());
      }
    });
    pool.watchAddress(wallet.getAddress('base58check'));
    

    // wallet.getBalance(0).then(function(result){
    //     console.log("Balance======>",result);
    // });
    console.log("Generating 20 nearest addresses");
    for (var i=0;i<20;i++){
      wallet.createKey(0).then(function (res){
        pool.watchAddress(res.getAddress('base58check'));  
        console.log("watching " + res.getAddress('base58check'));
      });
    }

  // Connect, start retrieving and relaying txs
  pool.connect().then(function() {
    // Start the blockchain sync.
    pool.startSync();

    pool.on('tx', function(tx) {
      walletdb.addTX(tx);
    });

    wallet.on('balance', function(balance) {
      console.log('Balance updated.');
      console.log(bcoin.amount.btc(balance.unconfirmed));
    });
  });
});

logger.info = function(level, module, args) {
  // console.log(level,module,args);
};
    


export default class rbcoin extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Hi!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('rbcoin', () => rbcoin);
