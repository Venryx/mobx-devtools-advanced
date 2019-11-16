# Tree Traversal

## General

To see how react-devtools traverses the React component tree, the most helpful file is probably the following:
* When I inspected it: https://github.com/facebook/react/blob/34527063083195558f98108cde10b5d6ad0d6865/packages/react-devtools-shared/src/backend/renderer.js
* Latest version: https://github.com/facebook/react/blob/master/packages/react-devtools-shared/src/backend/renderer.js

## How to...

#### Using console...

###### Get selected DOM element or React Component
```
$0   // dev-tools -> Elements -> selected DOM element
$r   // React DevTools -> Components -> selected React component
```

#### Using React fibers/internals...

###### Get React component for DOM element
```
let domFiber = dom[Object.keys(dom).find(a=>a.startsWith("__reactInternalInstance$"))];
let compFiber = fiberForDOM.return
//compFiber = compFiber.return(.return+)   // if you need to traverse to wrapper/ancestor comps
let comp = compFiber.stateNode
```

###### Get parent of component
```
let childCompFiber = childComp._reactInternalFiber
let parentCompDOMFiber = childCompFiber.return
let parentCompFiber = parentCompDOMFiber.return
//let parentCompFiber = childCompFiber._debugOwner;   // alternative to .return.return (skips dom-fiber)
let parentComp = parentCompFiber.stateNode
```

###### Get first child of component
```
let parentFiber = parentComp._reactInternalFiber
let parentCompDOMFiber = compFiber.child
let childCompFiber = parentCompDOMFiber.child
let childComp = childCompFiber.stateNode
```

###### Get next sibling of component
```
comp._reactInternalFiber.sibling.stateNode
```

#### Using React dev-tools hook

Note: This requires the [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) extension to be installed.

For more information on how the hook functions operate, see the section of the react-devtools repo that's linked to at the top of this page.

###### Get hook
```
hook = __REACT_DEVTOOLS_GLOBAL_HOOK__
```

###### Get root fiber/component
```
rootFragmentFiber = hook.getFiberRoots(1).toJSON()[0].current
rootCompFiber = rootFragment.child
rootComp = rootFiber.stateNode
```

###### Get ancestors of component (using fiber id)
```
fiberID = 1   // fill in actual value here; not sure yet how to obtain from comp
childFragments = hook.rendererInterfaces.toJSON()[0][1].getOwnersList(fiberID)
```