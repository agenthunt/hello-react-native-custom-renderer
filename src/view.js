import React, { Component } from 'react';

class View extends Component {
  render() {
    return (
      <view
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...this.props.style
        }}
      >
        {this.props.children}
      </view>
    );
  }
}

export default View;
