/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import './shim';
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
