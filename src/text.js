import React, { Component } from 'react';

class Text extends Component {
  render() {
    return <text>{this.props.children}</text>;
  }
}

export default Text;
