import * as firebase from 'firebase';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';

const firebaseConfig = {
  apiKey: "AIzaSyBfYFw1eSQsoEMp2c0s8lFdKgWKt7SiVEs",
  authDomain: "arduino-johnny.firebaseapp.com",
  databaseURL: "https://arduino-johnny.firebaseio.com",
  projectId: "arduino-johnny",
  storageBucket: "arduino-johnny.appspot.com",
  messagingSenderId: "284015856655",
  appId: "1:284015856655:web:c67c7236adc2ebc054677a",
};

firebase.initializeApp(firebaseConfig);


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState(false);

  const referencia = firebase.database().ref('LED');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const updateDoorValue = (type) => {
    referencia.set(type)
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    const qrCodeHash = 'Victor';

    if (qrCodeHash === data) {
      referencia.once("value", function (snapshot) {
        var doorStatus = snapshot.val();

        if (doorStatus === false) {
          updateDoorValue(true)
        } else {
          updateDoorValue(false)
        }
      });
    } else {
      alert("Erro ao abrir porta")
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#000",
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },

  textButton: {
    fontSize: 30,
    color: "#fff",
  },
});
