/* eslint-disable */

/**
 * NOTE: This file cannot `require` any other modules. We `.toString()` the
 *       function in some places and inject the source into the page.
 */

export default function installGlobalHook(window) {
	//console.log("Backend starting... (injected page code which adds the hook)");

	if (window.__MOBX_DEVTOOLS_GLOBAL_HOOK__ && window.__MOBX_DEVTOOLS_GLOBAL_HOOK__.collections) {
		return;
	}

	function valid(a, name) {
		if (!a) return false;
		switch (name) {
			case 'mobx':
				if (a[name] && !a[name].getDebugName && a[name].extras) {
					// Support MobX < 4 API
					var fixedMobx = {};
					for (let p in a[name]) if (Object.prototype.hasOwnProperty.call(a[name], p)) {
						fixedMobx[p] = a[name][p];
					}
					for (let p in a[name].extras) if (Object.prototype.hasOwnProperty.call(a[name].extras, p)) {
						fixedMobx[p] = a[name].extras[p];
					}
					a[name] = fixedMobx;
				}
				return Boolean(a[name] && a[name].spy);
			case 'mobxReact':
				return Boolean(a[name] && a[name].componentByNodeRegistery);
			default:
				return Boolean(a[name]);
		}
	}

	function sameMobxId(a, b) {
		for (let name in b)
			if (Object.prototype.hasOwnProperty.call(b, name)) {
				if (!a || !b) continue;
				const aa = a[name];
				const bb = b[name];
				if (!a[name] || !b[name]) continue;
				for (let key in aa) {
					if (
						Object.prototype.hasOwnProperty.call(aa, key) &&
						Object.prototype.hasOwnProperty.call(bb, key) &&
						aa[key] &&
						aa[key] instanceof Object &&
						aa[key] === bb[key]
					) {
						return true;
					}
				}
				for (let key in bb) {
					if (
						Object.prototype.hasOwnProperty.call(aa, key) &&
						Object.prototype.hasOwnProperty.call(bb, key) &&
						bb[key] &&
						bb[key] instanceof Object &&
						aa[key] === bb[key]
					) {
						return true;
					}
				}
			}
		return false;
	}

	Object.defineProperty(window, '__MOBX_DEVTOOLS_GLOBAL_HOOK__', {
		value: {
			hookVersion: 1,
			collections: {},
			inject(collection) {
				let mobxid;
				const injectedProps = [];
				for (let id in this.collections)
					if (this.collections.hasOwnProperty(id)) {
						if (sameMobxId(this.collections[id], collection)) {
							mobxid = id;
							break;
						}
					}
				if (!mobxid) {
					mobxid = Math.random().toString(32).slice(2);
					this.collections[mobxid] = {};
				}
				for (let prop in collection)
					if (Object.prototype.hasOwnProperty.call(collection, prop)) {
						if (!this.collections[mobxid][prop] && valid(collection, prop)) {
							this.collections[mobxid][prop] = collection[prop];
							injectedProps.push(prop);
						}
					}
				if (injectedProps.length > 0) this.emit('instances-injected', mobxid);
			},
			injectMobx(mobx: MobX) {
				this.inject({mobx});
			},
			injectMobxReact(mobxReact: MobXReact, mobx: MobX) {
				if (valid({mobxReact}, 'mobxReact')) {
					// new versions of mobx-react no longer support tracking components
					if (mobxReact["trackComponents"]) mobxReact["trackComponents"]();
					this.inject({mobxReact, mobx});
				}
			},
			_listeners: {},
			sub(evt, fn) {
				this.on(evt, fn);
				return () => this.off(evt, fn);
			},
			on(evt, fn) {
				if (!this._listeners[evt]) {
					this._listeners[evt] = [];
				}
				this._listeners[evt].push(fn);
			},
			off(evt, fn) {
				if (!this._listeners[evt]) {
					return;
				}
				const ix = this._listeners[evt].indexOf(fn);
				if (ix !== -1) {
					this._listeners[evt].splice(ix, 1);
				}
				if (!this._listeners[evt].length) {
					this._listeners[evt] = null;
				}
			},
			emit(evt, data) {
				if (this._listeners[evt]) {
					this._listeners[evt].map(fn => fn(data));
				}
			},

			// new stuff
			// ==========

			getReactHook() {
				return hook;
			},
		}
	});

	// react hook
	// ==========

	let hook = {
		fiberRoots: new Set(),
		onCommitFiberRoot: (rendererID, root, priorityLevel)=> {
			const mountedRoots = hook.fiberRoots;
			const current = root.current;
			const isKnownRoot = mountedRoots.has(root);
			const isUnmounting = current.memoizedState == null || current.memoizedState.element == null;
		
			// Keep track of mounted roots so we can hydrate when DevTools connect.
			if (!isKnownRoot && !isUnmounting) {
				mountedRoots.add(root);
			} else if (isKnownRoot && isUnmounting) {
				mountedRoots.delete(root);
			}
			
			if (officialHook) officialHookProps.onCommitFiberRoot(rendererID, root, priorityLevel);
		},
		onCommitFiberUnmount: (rendererID, fiber)=> {
			if (officialHook) officialHookProps.onCommitFiberUnmount(rendererID, fiber);
		},
	};

	let officialHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
	let officialHookProps = Object.assign({}, officialHook);
	// if we are running before react-devtools, temporarily place ourselves at the hook site
	/*if (officialHook == null) {
		window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook;
	}*/
	
	// wait until the official hook is added, then patch it
	let startTime = Date.now();
	let timerID = setInterval(()=> {
		//if (!__DEV__) {
		// cancel wait if in prod, and we've waited for more than 5s
		if (!__DEV__ && Date.now() - startTime > 5000) {
			return void clearInterval(timerID);
		}

		if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__ != hook) {
			officialHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
			officialHookProps = Object.assign({}, officialHook);
			//Object.assign(officialHook, hook);
			let entries = Object.entries(hook);
			for (let i = 0; i < entries.length; i++) {
				const key = entries[i][0], value = entries[i][1];
				// only transfer functions
				if (typeof value == "function") {
					officialHook[key] = value;
				}
			}
			// we've patched the official hook (provided by react-devtools), so we're done
			return void clearInterval(timerID);
		}
	}, 100);
}