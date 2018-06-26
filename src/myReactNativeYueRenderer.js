import ReactReconciler from 'react-reconciler';
import gui from 'gui';

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
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    const yueElement = gui.Container.create();
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
        yueElement.setStyle(propValue);
      }
    });
    return yueElement;
  },
  createTextInstance: (text, rootContainerInstance, hostContext, internalInstanceHandle) => {
    return gui.Label.create(text);
  },
  appendInitialChild: (parent, child) => {
    parent.addChildView(child);
  },
  appendChild(parent, child) {
    parent.addChildView(child);
  },
  finalizeInitialChildren: (yueElement, type, props) => {},
  supportsMutation: true,
  appendChildToContainer: (parent, child) => {
    parent.setContentView(child);
  },
  prepareUpdate(yueElement, oldProps, newProps) {
    return true;
  },
  commitUpdate(yueElement, updatePayload, type, oldProps, newProps) {},
  commitTextUpdate(textInstance, oldText, newText) {},
  removeChild(parentInstance, child) {}
};
const ReactReconcilerInst = ReactReconciler(traceWrap(hostConfig));
export default {
  render: (reactElement, guiWindow, callback) => {
    // Create a root Container if it doesnt exist
    if (!guiWindow._rootContainer) {
      guiWindow._rootContainer = ReactReconcilerInst.createContainer(guiWindow, false);
    }

    // update the root Container
    return ReactReconcilerInst.updateContainer(reactElement, guiWindow._rootContainer, null, callback);
  }
};
