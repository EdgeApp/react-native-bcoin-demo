/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import './shim.js';
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

console.log("LOGGGG1");

var chain = new bcoin.chain({
  db: 'leveldb',
  location: process.env.HOME + '/spvchaind12',
  spv: true,
  network: 'main',
  logConsole: true,
  logger: logger
});

console.log("LOGGGG2");

var pool = new bcoin.pool({
  chain: chain,
  spv: true,
  maxPeers: 80 ,
  logger: logger
});

console.log("LOGGGG3");


  logger.writeConsole = function(level, module, args) {
    console.log(level,module,args);
  };

  logger.info = function(level, module, args) {
    // console.log(level,module,args);
  };
      

var walletdb = new bcoin.walletdb({ db: 'memory' });

var globalWallet = {} ;
var globalWallets = [] ;
var tcpClient = {};
var globalRecieveData = "";

//010000000185fee87929913bc0f5d681bdc7e6fc6f63f29a8f54d606cc6188de025bb7fea6010000006b483045022100e1234ba3d9180c1d15e50a787cf61be96fbfbc70390e121c0ace37dfb44a1b15022000c51d70179041ab5b5fb5dbae988884ffe66b7539866e7d17ed69973feb814d01210308aa1e20f29105c1d3eae4a8d243f8d5a753f57f984f819858ae11367000c5a6ffffffff02a00f0000000000001976a9146317939d4fd5153eb816e62f2c4a401ebc69cdd088acec9b1300000000001976a9144b2b2c201a792d37859176c660d972f64de0147588ac00000000

function handleData(data){
  if (data.id==10){
    console.log("GOT DATA 10");
    if (data.result.length>0){
      for (var j=0;j<=data.result.length-1;j++){
        tcpClient.write('{ "id": 15, "method":"blockchain.transaction.get", "params":["'+data.result[j].tx_hash+'"] }'+"\n");   
      } 
    }
  }
  if (data.id==15){
    globalWallet.db.addTXFromRaw(data.result);
    // console.log("TX HASHES!!:",data.result);   
    return;
  } 
}
 
function rescan(data){
  if (data!=0){

    var string = "";
    for (var ui=0;ui<=data.length-1;ui++){
      string+=String.fromCharCode(data[ui]);
    }
    globalRecieveData += string;
    var result = [];
    if (globalRecieveData.indexOf("\n")>-1){
      // console.log("stringbeforesplit ",globalRecieveData); 
      var mdata = globalRecieveData.split("\n");
      for (var k=0;k<=mdata.length-1;k++){
        if (mdata[k].length<3){
          continue;
        }
        // console.log("ssbefore parsing, mk ",mdata[k]);   
        var res = false;
        try{
          res = JSON.parse(mdata[k]);
          result.push(res);
        } catch(e){}
      }
    } else {
      // console.log("ssbefore parsing, s ",globalRecieveData);   
      try{
        data = JSON.parse(globalRecieveData);
        result.push(res);
      } catch(e){}
    } 
    if (result.length>0){
      globalRecieveData = "";
    }
    for (var o=0;o<=result.length-1;o++){

      handleData(result[o]);  
    }
  } else {
    console.log("GLOBALWALLETS", globalWallets.length); 
  }
  if (globalWallets.length==0)
    return;
   
    var wallet = globalWallets.shift();
    // console.log("JOINING, ",wallet);
    // globalWallets = [];
    tcpClient.write('{ "id": 10, "method":"blockchain.address.get_history", "params":["'+wallet+'"] }'+"\n");  

  // var client = net.connect("50001", "cluelessperson.com", function(res) {
  //   console.log('opened client on ' + JSON.stringify(client.address()));
  //   client.write('{ "id": 1, "method":"blockchain.address.get_balance", "params":["'+address+'"] }'+"\n");
  //   client.on("data",function(data){
  //     
  //     console.log("zzszincomming, ",string);  
  //     data = JSON.parse(string);
  //   console.log("zzzincomming, ",data);   
  //   })
  //   // client.write('Hello, server! Love, Client.');
  // });
}

console.log("LOGGGG4");

pool.open().then(function() {
  console.log("LOGGGG5");
  return walletdb.open();
}).then(function() {
console.log("LOGGGG6");
  var w = new bcoin.hd.PrivateKey()
  w.fromSeed("9f8c2359d1581ecc861600306a647f98b0bcfa258de9ece3a124ae1499988503")
  var key = w.toJSON()
  
  console.log("XPRIV", key.xprivkey);

  return walletdb.create({
      "master": key.xprivkey,
      "id": "AirBitzMain"
    });
  console.log("LOGGGG7");
}).then(function(wallet) {
  globalWallet = wallet;
  console.log("LOGGGG8");
  globalWallets.push(wallet.getID());
  console.log("Root m/0/0/0 => "+globalWallets[0]);

    console.log('Main address: '+ wallet.getAddress('base58check'));
    

  // Add our address to the spv filter.
  pool.watchAddress(globalWallets[0]);

  // wallet.getAccountPaths(0).then(function(result){
  //     var a;
  //     for (var i in result){
  //       a =result[i].toAddress();

  //       // console.log("Paths======>",a.toString());
  //     }
  //   });
    // pool.watchAddress(wallet.getAddress('base58check'));
    

    // wallet.getBalance(0).then(function(result){
    //     console.log("Balance======>",result);
    // });
    console.log("Generating 20 nearest addresses");
    for (var i=0;i<600;i++){
      wallet.createKey(0).then(function (res){
        pool.watchAddress(res.getAddress('base58check'));  
        globalWallets.push(res.getAddress('base58check'));
        console.log("watching " + res.getAddress('base58check'));
      });
    }
    


  // Connect, start retrieving and relaying txs
  pool.connect().then(function() {
    // Start the blockchain sync.
    pool.startSync();

    tcpClient = net.connect("50001", "cluelessperson.com", function(res) {
      rescan(0);
      tcpClient.on("data",function(data){
        rescan(data);
      })
    });

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
