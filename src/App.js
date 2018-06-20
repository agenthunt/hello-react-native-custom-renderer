import React, { Component } from 'react';
import View from './view';
import Text from './text';

class App extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#8BBDD9',
          height: 400
        }}
      >
        <Text>Hello React Native Custom Renderer</Text>
      </View>
    );
  }
}

export default App;
