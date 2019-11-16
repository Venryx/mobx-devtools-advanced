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
let compFiber = domFiber.return
//compFiber = compFiber.return(.return+)		// if you need to traverse to wrapper/ancestor comps
let comp = compFiber.stateNode
```

For a more comprehensive helper function, see here: https://stackoverflow.com/a/39165137/2441655

###### Get parent of component
```
let childCompFiber = childComp._reactInternalFiber
let parentCompDOMFiber = childCompFiber.return			// usually a dom-fiber between; if not, remove this line
let parentCompFiber = parentCompDOMFiber.return
//let parentCompFiber = childCompFiber._debugOwner;	// alternative to .return.return (skips dom-fiber)
let parentComp = parentCompFiber.stateNode
```

###### Get first child of component
```
let parentFiber = parentComp._reactInternalFiber
let parentCompDOMFiber = compFiber.child				// usually a dom-fiber between; if not, remove this line
let childCompFiber = parentCompDOMFiber.child
let childComp = childCompFiber.stateNode
```

###### Get next sibling of component
```
comp._reactInternalFiber.sibling.stateNode
```

###### Check whether fiber is for dom-element or component
```
let isDomFiber = typeof fiber.type == "string";
let isCompFiber = typeof fiber.type != "string"; // or: == "function"
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