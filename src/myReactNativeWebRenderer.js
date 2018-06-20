import ReactReconciler from 'react-reconciler';

function traceWrap(hostConfig) {
  let traceWrappedHostConfig = {};
  Object.keys(hostConfig).map(key => {
    const func = hostConfig[key];
    traceWrappedHostConfig[key] = (...args) => {
      console.trace(key);
      return func(...args);
    };
  });
  return traceWrappedHostConfig;
}

function camel2Dash(str) {
  if (str === '') {
    return '';
  }

  str = str[0].toLowerCase() + str.substr(1);

  return str.replace(/([A-Z])/g, function($1) {
    return '-' + $1.toLowerCase();
  });
}

function convertCamelCasetoInlineStyle(style) {
  const transformedStyles = {};
  if (style) {
    Object.keys(style).forEach(key => {
      const dashedKey = camel2Dash(key);
      transformedStyles[dashedKey] = style[key];
      if (key === 'height') {
        transformedStyles[dashedKey] = style[key] + 'px';
      }
    });
  }
  const styleString = Object.keys(transformedStyles).map(key => {
    return `${key}:${transformedStyles[key]};`;
  });
  return styleString.join('');
}

const rootHostContext = {};
const childHostContext = {};

const hostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (type, props) => {
    return false;
  },
  /**
   This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
   */
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    const domElement = document.createElement('div');
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (type !== 'text') {
          if (typeof propValue === 'string' || typeof propValue === 'number') {
            throw new Error('Text strings must be rendered within a <Text> component.');
          }

          if (propValue instanceof Array) {
            propValue.forEach(item => {
              if (typeof item === 'string') {
                throw new Error('Text strings must be rendered within a <Text> component.');
              }
            });
          }
        }
      } else if (propName === 'style') {
        const styleString = convertCamelCasetoInlineStyle(propValue);
        domElement.setAttribute('style', styleString);
      } else {
        const propValue = newProps[propName];
        domElement.setAttribute(propName, propValue);
      }
    });
    return domElement;
  },
  createTextInstance: (text, rootContainerInstance, hostContext, internalInstanceHandle) => {
    return document.createTextNode(text);
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: (domElement, type, props) => {},
  supportsMutation: true,
  appendChildToContainer: (parent, child) => {
    parent.appendChild(child);
  },
  prepareUpdate(domElement, oldProps, newProps) {
    return true;
  },
  commitUpdate(domElement, updatePayload, type, oldProps, newProps) {},
  commitTextUpdate(textInstance, oldText, newText) {},
  removeChild(parentInstance, child) {}
};
const ReactReconcilerInst = ReactReconciler(traceWrap(hostConfig));
export default {
  render: (reactElement, domElement, callback) => {
    // Create a root Container if it doesnt exist
    if (!domElement._rootContainer) {
      domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(reactElement, domElement._rootContainer, null, callback);
  }
};
