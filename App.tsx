/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';

function App() {
  return (
    <View style={styles.container}>
      <Text>My APP ENV {Config.API_URL}</Text>
      <Text>My APP ENV {Config.APP_ENV}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
