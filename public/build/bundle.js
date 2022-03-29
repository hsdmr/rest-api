
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var us = {
      title: {
        home: "Home",
        dashboard: "Dashboard",
        options: "Options",
        users: "Users",
        layouts: "Layouts",
        fullName: "Full name",
        email: "Email",
        password: "Password",
        retypePassword: "Retype password",
      },
      footer: {
        text: "Anything you want",
        rights: "All rights reserved.",
        copyright: "Copyright"
      },
      any: {
        title: "Title",
        content: "Content",
        search: "Search",
        noElementFound: "No Element Found!"
      },
      login: {
        message: "Sign in to start your session",
        rememberMe: "Remember Me",
        signIn: "Sign In",
        forgetPassword: "I forgot my password",
        registerNew: "Register a new membership",
      },
      register: {
        message: "Register a new membership",
        register: "Register",
        alreadyMember: "I already have a membership",
      },
      password: {
        message: "You forgot your password? Here you can easily retrieve a new password.",
        requestNew: "Request new password",
        login: "Login",
      },
    };

    var tr = {
      title: {
        home: "Ana sayfa",
        dashboard: "Gösterge Paneli",
        options: "Ayarlar",
        users: "Kullanıcılar",
        layouts: "Düzenler",
        fullName: "İsim Soyisim",
        email: "Eposta",
        password: "Şifre",
        retypePassword: "Şifre tekrar",
      },
      footer: {
        text: "Ne isterseniz",
        rights: "Tüm Hakları Saklıdır.",
        copyright: "Telif Hakkı"
      },
      any: {
        title: "Başlık",
        content: "İçerik",
        search: "Ara",
        noElementFound: "Öğe Bulunamadı!"
      },
      login: {
        message: "Oturumunuzu başlatmak için giriş yapın",
        rememberMe: "Beni Hatırla",
        signIn: "Giriş",
        forgetPassword: "Şifremi unuttum",
        registerNew: "Yeni üyelik kaydı",
      },
      register: {
        message: "Yeni üyelik kaydı",
        register: "kaydol",
        alreadyMember: "Zaten üyeyim",
      },
      password: {
        message: "Şifrenizi mi unuttunuz? Burdan kolayca şifre alabilirsiniz.",
        requestNew: "Yeni şifre isteği",
        login: "Giriş",
      },
    };

    var translations = {
      tr: tr,
      us: us,
    };

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const dict = writable();
    const locale = writable('us');
    const languages = Object.keys(translations);

    const localizedDict = derived([dict, locale], ([dict, locale]) => {
      if (!dict || !locale) return;
      return (dict[locale]);
    });

    const getMessageFromLocalizedDict = (id, localizedDict) => {
      const splitId = id.split('.');
      let message = { ...localizedDict };
      splitId.forEach((partialId) => {
        message = message[partialId];
      });
      return (message);
    };

    const createMessageFormatter = (localizedDict) => (id) => getMessageFromLocalizedDict(id, localizedDict);

    const __ = derived(localizedDict, (localizedDict) => {
      return (createMessageFormatter(localizedDict));
    });

    /* src\components\Translator.svelte generated by Svelte v3.46.4 */

    function create_fragment$g(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Translator', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Translator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ translations, dict });
    	dict.set(translations);
    	return [$$scope, slots];
    }

    class Translator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Translator",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.46.4 */

    const file$f = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$f, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$f, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$f($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$f,
    			create_fragment$f,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.46.4 */
    const file$e = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$e, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$e, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$e($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.46.4 */
    const file$d = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$d(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$d, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    let href = window.location.href;
    let path = window.location.pathname;
    let root;

    if (path != '/') {
      root = href.split(path)[0];
    }

    const APP_ROOT = root ?? href.slice(0, -1);

    let apiUrl = 'http://localhost:8080/v2';

    const urls = {
      login: `${apiUrl}/login`,
      register: `${apiUrl}/register`,
      forgetPassword: `${apiUrl}/forget-password`,
      admin: `${apiUrl}/admin`,
      
      user: `${apiUrl}/user`,
      user_id: `${apiUrl}/user`,
    };

    const authUser = writable();

    /* src\components\Lang.svelte generated by Svelte v3.46.4 */
    const file$c = "src\\components\\Lang.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (15:4) {#each languages as lang}
    function create_each_block$2(ctx) {
    	let a;
    	let i;
    	let t0;
    	let t1_value = /*lang*/ ctx[3].toUpperCase() + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*lang*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", "flag-icon flag-icon-" + /*lang*/ ctx[3] + " mr-2");
    			add_location(i, file$c, 16, 8, 514);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "dropdown-item");
    			add_location(a, file$c, 15, 6, 437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(15:4) {#each languages as lang}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let span;
    	let a;
    	let i;
    	let i_class_value;
    	let t;
    	let div;
    	let each_value = languages;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			i = element("i");
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i, "class", i_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0]);
    			add_location(i, file$c, 8, 4, 243);
    			attr_dev(a, "data-toggle", "dropdown");
    			attr_dev(a, "href", "#");
    			attr_dev(a, "aria-expanded", "false");
    			add_location(a, file$c, 7, 2, 180);
    			attr_dev(div, "class", "dropdown-menu dropdown-menu-right p-0");
    			set_style(div, "left", "inherit");
    			set_style(div, "right", "0px");
    			add_location(div, file$c, 10, 2, 298);
    			attr_dev(span, "class", "dropdown float-right");
    			add_location(span, file$c, 6, 0, 141);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, i);
    			append_dev(span, t);
    			append_dev(span, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$locale*/ 1 && i_class_value !== (i_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0])) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*setLocale, languages*/ 2) {
    				each_value = languages;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $locale;
    	validate_store(locale, 'locale');
    	component_subscribe($$self, locale, $$value => $$invalidate(0, $locale = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Lang', slots, []);

    	function setLocale(lang) {
    		set_store_value(locale, $locale = lang, $locale);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Lang> was created with unknown prop '${key}'`);
    	});

    	const click_handler = lang => setLocale(lang);

    	$$self.$capture_state = () => ({
    		languages,
    		locale,
    		__,
    		setLocale,
    		$locale
    	});

    	return [$locale, setLocale, click_handler];
    }

    class Lang extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lang",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\pages\auth\Login.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$b = "src\\pages\\auth\\Login.svelte";

    // (98:10) <Link to="/forget-password">
    function create_default_slot_1$2(ctx) {
    	let t_value = /*$__*/ ctx[2]("login.forgetPassword") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 4 && t_value !== (t_value = /*$__*/ ctx[2]("login.forgetPassword") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(98:10) <Link to=\\\"/forget-password\\\">",
    		ctx
    	});

    	return block;
    }

    // (101:10) <Link to="/register" class="text-center"              >
    function create_default_slot$5(ctx) {
    	let t_value = /*$__*/ ctx[2]("login.registerNew") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 4 && t_value !== (t_value = /*$__*/ ctx[2]("login.registerNew") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(101:10) <Link to=\\\"/register\\\" class=\\\"text-center\\\"              >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div14;
    	let div13;
    	let div12;
    	let div0;
    	let lang;
    	let t0;
    	let a;
    	let b;
    	let t2;
    	let t3;
    	let div11;
    	let p0;
    	let t4_value = /*$__*/ ctx[2]("login.message") + "";
    	let t4;
    	let t5;
    	let div3;
    	let input0;
    	let input0_placeholder_value;
    	let t6;
    	let div2;
    	let div1;
    	let span0;
    	let t7;
    	let div6;
    	let input1;
    	let input1_placeholder_value;
    	let t8;
    	let div5;
    	let div4;
    	let span1;
    	let t9;
    	let div10;
    	let div8;
    	let div7;
    	let input2;
    	let t10;
    	let label;
    	let t11_value = /*$__*/ ctx[2]("login.rememberMe") + "";
    	let t11;
    	let t12;
    	let div9;
    	let button;
    	let t13_value = /*$__*/ ctx[2]("login.signIn") + "";
    	let t13;
    	let t14;
    	let p1;
    	let link0;
    	let t15;
    	let p2;
    	let link1;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });

    	link0 = new Link$1({
    			props: {
    				to: "/forget-password",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/register",
    				class: "text-center",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			div0 = element("div");
    			create_component(lang.$$.fragment);
    			t0 = space();
    			a = element("a");
    			b = element("b");
    			b.textContent = "KM";
    			t2 = text("PANEL");
    			t3 = space();
    			div11 = element("div");
    			p0 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t7 = space();
    			div6 = element("div");
    			input1 = element("input");
    			t8 = space();
    			div5 = element("div");
    			div4 = element("div");
    			span1 = element("span");
    			t9 = space();
    			div10 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			input2 = element("input");
    			t10 = space();
    			label = element("label");
    			t11 = text(t11_value);
    			t12 = space();
    			div9 = element("div");
    			button = element("button");
    			t13 = text(t13_value);
    			t14 = space();
    			p1 = element("p");
    			create_component(link0.$$.fragment);
    			t15 = space();
    			p2 = element("p");
    			create_component(link1.$$.fragment);
    			add_location(b, file$b, 46, 31, 1305);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "h1");
    			add_location(a, file$b, 46, 8, 1282);
    			attr_dev(div0, "class", "card-header text-center");
    			add_location(div0, file$b, 44, 6, 1217);
    			attr_dev(p0, "class", "login-box-msg");
    			add_location(p0, file$b, 49, 8, 1378);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", input0_placeholder_value = /*$__*/ ctx[2]("title.email"));
    			add_location(input0, file$b, 52, 10, 1483);
    			attr_dev(span0, "class", "fas fa-envelope");
    			add_location(span0, file$b, 60, 14, 1743);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$b, 59, 12, 1697);
    			attr_dev(div2, "class", "input-group-append");
    			add_location(div2, file$b, 58, 10, 1651);
    			attr_dev(div3, "class", "input-group mb-3");
    			add_location(div3, file$b, 51, 8, 1441);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "placeholder", input1_placeholder_value = /*$__*/ ctx[2]("title.password"));
    			add_location(input1, file$b, 65, 10, 1881);
    			attr_dev(span1, "class", "fas fa-lock");
    			add_location(span1, file$b, 73, 14, 2152);
    			attr_dev(div4, "class", "input-group-text");
    			add_location(div4, file$b, 72, 12, 2106);
    			attr_dev(div5, "class", "input-group-append");
    			add_location(div5, file$b, 71, 10, 2060);
    			attr_dev(div6, "class", "input-group mb-3");
    			add_location(div6, file$b, 64, 8, 1839);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "remember");
    			add_location(input2, file$b, 80, 14, 2350);
    			attr_dev(label, "for", "remember");
    			add_location(label, file$b, 81, 14, 2405);
    			attr_dev(div7, "class", "icheck-success");
    			add_location(div7, file$b, 79, 12, 2306);
    			attr_dev(div8, "class", "col-8");
    			add_location(div8, file$b, 78, 10, 2273);
    			attr_dev(button, "class", "btn btn-success btn-block");
    			add_location(button, file$b, 88, 12, 2603);
    			attr_dev(div9, "class", "col-4");
    			add_location(div9, file$b, 87, 10, 2570);
    			attr_dev(div10, "class", "row");
    			add_location(div10, file$b, 77, 8, 2244);
    			attr_dev(p1, "class", "mb-1");
    			add_location(p1, file$b, 96, 8, 2833);
    			attr_dev(p2, "class", "mb-0");
    			add_location(p2, file$b, 99, 8, 2949);
    			attr_dev(div11, "class", "card-body");
    			add_location(div11, file$b, 48, 6, 1345);
    			attr_dev(div12, "class", "card card-outline card-success");
    			add_location(div12, file$b, 43, 4, 1165);
    			attr_dev(div13, "class", "login-box");
    			add_location(div13, file$b, 41, 2, 1109);
    			attr_dev(div14, "class", "login-page");
    			add_location(div14, file$b, 40, 0, 1081);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div14, anchor);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div0);
    			mount_component(lang, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a);
    			append_dev(a, b);
    			append_dev(a, t2);
    			append_dev(div12, t3);
    			append_dev(div12, div11);
    			append_dev(div11, p0);
    			append_dev(p0, t4);
    			append_dev(div11, t5);
    			append_dev(div11, div3);
    			append_dev(div3, input0);
    			set_input_value(input0, /*user*/ ctx[0]);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div11, t7);
    			append_dev(div11, div6);
    			append_dev(div6, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, span1);
    			append_dev(div11, t9);
    			append_dev(div11, div10);
    			append_dev(div10, div8);
    			append_dev(div8, div7);
    			append_dev(div7, input2);
    			append_dev(div7, t10);
    			append_dev(div7, label);
    			append_dev(label, t11);
    			append_dev(div10, t12);
    			append_dev(div10, div9);
    			append_dev(div9, button);
    			append_dev(button, t13);
    			append_dev(div11, t14);
    			append_dev(div11, p1);
    			mount_component(link0, p1, null);
    			append_dev(div11, t15);
    			append_dev(div11, p2);
    			mount_component(link1, p2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*submit*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$__*/ 4) && t4_value !== (t4_value = /*$__*/ ctx[2]("login.message") + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*$__*/ 4 && input0_placeholder_value !== (input0_placeholder_value = /*$__*/ ctx[2]("title.email"))) {
    				attr_dev(input0, "placeholder", input0_placeholder_value);
    			}

    			if (dirty & /*user*/ 1 && input0.value !== /*user*/ ctx[0]) {
    				set_input_value(input0, /*user*/ ctx[0]);
    			}

    			if (!current || dirty & /*$__*/ 4 && input1_placeholder_value !== (input1_placeholder_value = /*$__*/ ctx[2]("title.password"))) {
    				attr_dev(input1, "placeholder", input1_placeholder_value);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			if ((!current || dirty & /*$__*/ 4) && t11_value !== (t11_value = /*$__*/ ctx[2]("login.rememberMe") + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*$__*/ 4) && t13_value !== (t13_value = /*$__*/ ctx[2]("login.signIn") + "")) set_data_dev(t13, t13_value);
    			const link0_changes = {};

    			if (dirty & /*$$scope, $__*/ 516) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope, $__*/ 516) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div14);
    			destroy_component(lang);
    			destroy_component(link0);
    			destroy_component(link1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $authUser;
    	let $__;
    	validate_store(authUser, 'authUser');
    	component_subscribe($$self, authUser, $$value => $$invalidate(7, $authUser = $$value));
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(2, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let user = "hsdmrsoft@gmail.com";
    	let password = "Rest135**";
    	let auth = [];

    	const submit = () => {
    		fetch(urls.login, {
    			method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    				Accept: "application/json"
    			},
    			body: JSON.stringify({ user, password })
    		}).then(response => {
    			if (!response.ok) {
    				console.error(`HTTP error: ${response.status}`);
    			}

    			return response.json();
    		}).then(json => {
    			auth = json;
    			initialize();
    		}).catch(err => console.error(`Fetch problem: ${err.message}`));
    	};

    	onMount(submit);

    	const initialize = () => {
    		set_store_value(authUser, $authUser = auth, $authUser);
    		useNavigate(urls.admin);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user = this.value;
    		$$invalidate(0, user);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		useNavigate,
    		__,
    		urls,
    		authUser,
    		onMount,
    		Lang,
    		user,
    		password,
    		auth,
    		submit,
    		initialize,
    		$authUser,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('auth' in $$props) auth = $$props.auth;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, password, $__, submit, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\pages\auth\Register.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1$1, console: console_1$1 } = globals;
    const file$a = "src\\pages\\auth\\Register.svelte";

    // (106:8) <Link to="/login" class="text-center"            >
    function create_default_slot$4(ctx) {
    	let t_value = /*$__*/ ctx[0]("register.alreadyMember") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 1 && t_value !== (t_value = /*$__*/ ctx[0]("register.alreadyMember") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(106:8) <Link to=\\\"/login\\\" class=\\\"text-center\\\"            >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div20;
    	let div19;
    	let div18;
    	let div0;
    	let lang;
    	let t0;
    	let a0;
    	let b;
    	let t2;
    	let t3;
    	let div17;
    	let p;
    	let t4_value = /*$__*/ ctx[0]("register.message") + "";
    	let t4;
    	let t5;
    	let div3;
    	let input0;
    	let input0_placeholder_value;
    	let t6;
    	let div2;
    	let div1;
    	let span0;
    	let t7;
    	let div6;
    	let input1;
    	let input1_placeholder_value;
    	let t8;
    	let div5;
    	let div4;
    	let span1;
    	let t9;
    	let div9;
    	let input2;
    	let input2_placeholder_value;
    	let t10;
    	let div8;
    	let div7;
    	let span2;
    	let t11;
    	let div12;
    	let input3;
    	let input3_placeholder_value;
    	let t12;
    	let div11;
    	let div10;
    	let span3;
    	let t13;
    	let div16;
    	let div14;
    	let div13;
    	let input4;
    	let t14;
    	let label;
    	let t15;
    	let a1;
    	let t17;
    	let div15;
    	let button;
    	let t18_value = /*$__*/ ctx[0]("register.register") + "";
    	let t18;
    	let t19;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });

    	link = new Link$1({
    			props: {
    				to: "/login",
    				class: "text-center",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div19 = element("div");
    			div18 = element("div");
    			div0 = element("div");
    			create_component(lang.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			b = element("b");
    			b.textContent = "KM";
    			t2 = text("PANEL");
    			t3 = space();
    			div17 = element("div");
    			p = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t7 = space();
    			div6 = element("div");
    			input1 = element("input");
    			t8 = space();
    			div5 = element("div");
    			div4 = element("div");
    			span1 = element("span");
    			t9 = space();
    			div9 = element("div");
    			input2 = element("input");
    			t10 = space();
    			div8 = element("div");
    			div7 = element("div");
    			span2 = element("span");
    			t11 = space();
    			div12 = element("div");
    			input3 = element("input");
    			t12 = space();
    			div11 = element("div");
    			div10 = element("div");
    			span3 = element("span");
    			t13 = space();
    			div16 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			input4 = element("input");
    			t14 = space();
    			label = element("label");
    			t15 = text("I agree to the ");
    			a1 = element("a");
    			a1.textContent = "terms";
    			t17 = space();
    			div15 = element("div");
    			button = element("button");
    			t18 = text(t18_value);
    			t19 = space();
    			create_component(link.$$.fragment);
    			add_location(b, file$a, 29, 31, 907);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "h1");
    			add_location(a0, file$a, 29, 8, 884);
    			attr_dev(div0, "class", "card-header text-center");
    			add_location(div0, file$a, 27, 6, 819);
    			attr_dev(p, "class", "login-box-msg");
    			add_location(p, file$a, 32, 8, 980);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "placeholder", input0_placeholder_value = /*$__*/ ctx[0]("title.fullName"));
    			add_location(input0, file$a, 35, 10, 1088);
    			attr_dev(span0, "class", "fas fa-user");
    			add_location(span0, file$a, 42, 14, 1320);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$a, 41, 12, 1274);
    			attr_dev(div2, "class", "input-group-append");
    			add_location(div2, file$a, 40, 10, 1228);
    			attr_dev(div3, "class", "input-group mb-3");
    			add_location(div3, file$a, 34, 8, 1046);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "placeholder", input1_placeholder_value = /*$__*/ ctx[0]("title.email"));
    			add_location(input1, file$a, 47, 10, 1454);
    			attr_dev(span1, "class", "fas fa-envelope");
    			add_location(span1, file$a, 54, 14, 1684);
    			attr_dev(div4, "class", "input-group-text");
    			add_location(div4, file$a, 53, 12, 1638);
    			attr_dev(div5, "class", "input-group-append");
    			add_location(div5, file$a, 52, 10, 1592);
    			attr_dev(div6, "class", "input-group mb-3");
    			add_location(div6, file$a, 46, 8, 1412);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "placeholder", input2_placeholder_value = /*$__*/ ctx[0]("title.password"));
    			add_location(input2, file$a, 59, 10, 1822);
    			attr_dev(span2, "class", "fas fa-lock");
    			add_location(span2, file$a, 66, 14, 2058);
    			attr_dev(div7, "class", "input-group-text");
    			add_location(div7, file$a, 65, 12, 2012);
    			attr_dev(div8, "class", "input-group-append");
    			add_location(div8, file$a, 64, 10, 1966);
    			attr_dev(div9, "class", "input-group mb-3");
    			add_location(div9, file$a, 58, 8, 1780);
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "placeholder", input3_placeholder_value = /*$__*/ ctx[0]("title.retypePassword"));
    			add_location(input3, file$a, 71, 10, 2192);
    			attr_dev(span3, "class", "fas fa-lock");
    			add_location(span3, file$a, 78, 14, 2434);
    			attr_dev(div10, "class", "input-group-text");
    			add_location(div10, file$a, 77, 12, 2388);
    			attr_dev(div11, "class", "input-group-append");
    			add_location(div11, file$a, 76, 10, 2342);
    			attr_dev(div12, "class", "input-group mb-3");
    			add_location(div12, file$a, 70, 8, 2150);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "id", "agreeTerms");
    			attr_dev(input4, "name", "terms");
    			input4.value = "agree";
    			add_location(input4, file$a, 85, 14, 2632);
    			attr_dev(a1, "href", "/");
    			add_location(a1, file$a, 92, 31, 2856);
    			attr_dev(label, "for", "agreeTerms");
    			add_location(label, file$a, 91, 14, 2799);
    			attr_dev(div13, "class", "icheck-success");
    			add_location(div13, file$a, 84, 12, 2588);
    			attr_dev(div14, "class", "col-8");
    			add_location(div14, file$a, 83, 10, 2555);
    			attr_dev(button, "class", "btn btn-success btn-block");
    			add_location(button, file$a, 98, 12, 3010);
    			attr_dev(div15, "class", "col-4");
    			add_location(div15, file$a, 97, 10, 2977);
    			attr_dev(div16, "class", "row");
    			add_location(div16, file$a, 82, 8, 2526);
    			attr_dev(div17, "class", "card-body");
    			add_location(div17, file$a, 31, 6, 947);
    			attr_dev(div18, "class", "card card-outline card-success");
    			add_location(div18, file$a, 26, 4, 767);
    			attr_dev(div19, "class", "register-box");
    			add_location(div19, file$a, 25, 2, 735);
    			attr_dev(div20, "class", "login-page");
    			add_location(div20, file$a, 24, 0, 707);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div0);
    			mount_component(lang, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(a0, b);
    			append_dev(a0, t2);
    			append_dev(div18, t3);
    			append_dev(div18, div17);
    			append_dev(div17, p);
    			append_dev(p, t4);
    			append_dev(div17, t5);
    			append_dev(div17, div3);
    			append_dev(div3, input0);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(div17, t7);
    			append_dev(div17, div6);
    			append_dev(div6, input1);
    			append_dev(div6, t8);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, span1);
    			append_dev(div17, t9);
    			append_dev(div17, div9);
    			append_dev(div9, input2);
    			append_dev(div9, t10);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, span2);
    			append_dev(div17, t11);
    			append_dev(div17, div12);
    			append_dev(div12, input3);
    			append_dev(div12, t12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, span3);
    			append_dev(div17, t13);
    			append_dev(div17, div16);
    			append_dev(div16, div14);
    			append_dev(div14, div13);
    			append_dev(div13, input4);
    			append_dev(div13, t14);
    			append_dev(div13, label);
    			append_dev(label, t15);
    			append_dev(label, a1);
    			append_dev(div16, t17);
    			append_dev(div16, div15);
    			append_dev(div15, button);
    			append_dev(button, t18);
    			append_dev(div17, t19);
    			mount_component(link, div17, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*submit*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$__*/ 1) && t4_value !== (t4_value = /*$__*/ ctx[0]("register.message") + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*$__*/ 1 && input0_placeholder_value !== (input0_placeholder_value = /*$__*/ ctx[0]("title.fullName"))) {
    				attr_dev(input0, "placeholder", input0_placeholder_value);
    			}

    			if (!current || dirty & /*$__*/ 1 && input1_placeholder_value !== (input1_placeholder_value = /*$__*/ ctx[0]("title.email"))) {
    				attr_dev(input1, "placeholder", input1_placeholder_value);
    			}

    			if (!current || dirty & /*$__*/ 1 && input2_placeholder_value !== (input2_placeholder_value = /*$__*/ ctx[0]("title.password"))) {
    				attr_dev(input2, "placeholder", input2_placeholder_value);
    			}

    			if (!current || dirty & /*$__*/ 1 && input3_placeholder_value !== (input3_placeholder_value = /*$__*/ ctx[0]("title.retypePassword"))) {
    				attr_dev(input3, "placeholder", input3_placeholder_value);
    			}

    			if ((!current || dirty & /*$__*/ 1) && t18_value !== (t18_value = /*$__*/ ctx[0]("register.register") + "")) set_data_dev(t18, t18_value);
    			const link_changes = {};

    			if (dirty & /*$$scope, $__*/ 5) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    			destroy_component(lang);
    			destroy_component(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);

    	const submit = () => {
    		fetch("https://jsonplaceholder.typicode.com/posts", {
    			headers: {
    				"Content-Type": "application/json",
    				Accept: "application/json"
    			}
    		}).then(response => {
    			if (!response.ok) {
    				throw new Error(`HTTP error: ${response.status}`);
    			}

    			return response.json();
    		}).then(json => initialize(json)).catch(err => console.error(`Fetch problem: ${err.message}`));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1, __, urls, Lang, submit, $__ });
    	return [$__, submit];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\pages\auth\Password.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1, console: console_1 } = globals;
    const file$9 = "src\\pages\\auth\\Password.svelte";

    // (61:10) <Link to="/login">
    function create_default_slot$3(ctx) {
    	let t_value = /*$__*/ ctx[0]("password.login") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 1 && t_value !== (t_value = /*$__*/ ctx[0]("password.login") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(61:10) <Link to=\\\"/login\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div9;
    	let div8;
    	let div7;
    	let div0;
    	let lang;
    	let t0;
    	let a;
    	let b;
    	let t2;
    	let t3;
    	let div6;
    	let p0;
    	let t4_value = /*$__*/ ctx[0]("password.message") + "";
    	let t4;
    	let t5;
    	let div3;
    	let input;
    	let input_placeholder_value;
    	let t6;
    	let div2;
    	let div1;
    	let span;
    	let t7;
    	let div5;
    	let div4;
    	let button;
    	let t8_value = /*$__*/ ctx[0]("password.requestNew") + "";
    	let t8;
    	let t9;
    	let p1;
    	let link;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });

    	link = new Link$1({
    			props: {
    				to: "/login",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			create_component(lang.$$.fragment);
    			t0 = space();
    			a = element("a");
    			b = element("b");
    			b.textContent = "KM";
    			t2 = text("PANEL");
    			t3 = space();
    			div6 = element("div");
    			p0 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			input = element("input");
    			t6 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span = element("span");
    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			button = element("button");
    			t8 = text(t8_value);
    			t9 = space();
    			p1 = element("p");
    			create_component(link.$$.fragment);
    			add_location(b, file$9, 29, 31, 869);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "h1");
    			add_location(a, file$9, 29, 8, 846);
    			attr_dev(div0, "class", "card-header text-center");
    			add_location(div0, file$9, 27, 6, 781);
    			attr_dev(p0, "class", "login-box-msg");
    			add_location(p0, file$9, 32, 8, 942);
    			attr_dev(input, "type", "email");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$__*/ ctx[0]("title.email"));
    			add_location(input, file$9, 36, 10, 1070);
    			attr_dev(span, "class", "fas fa-envelope");
    			add_location(span, file$9, 43, 14, 1300);
    			attr_dev(div1, "class", "input-group-text");
    			add_location(div1, file$9, 42, 12, 1254);
    			attr_dev(div2, "class", "input-group-append");
    			add_location(div2, file$9, 41, 10, 1208);
    			attr_dev(div3, "class", "input-group mb-3");
    			add_location(div3, file$9, 35, 8, 1028);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn btn-success btn-block");
    			add_location(button, file$9, 49, 12, 1459);
    			attr_dev(div4, "class", "col-12");
    			add_location(div4, file$9, 48, 10, 1425);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$9, 47, 8, 1396);
    			attr_dev(p1, "class", "mt-3 mb-1");
    			add_location(p1, file$9, 59, 8, 1729);
    			attr_dev(div6, "class", "card-body");
    			add_location(div6, file$9, 31, 6, 909);
    			attr_dev(div7, "class", "card card-outline card-success");
    			add_location(div7, file$9, 26, 4, 729);
    			attr_dev(div8, "class", "login-box");
    			add_location(div8, file$9, 25, 2, 700);
    			attr_dev(div9, "class", "login-page");
    			add_location(div9, file$9, 24, 0, 672);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div0);
    			mount_component(lang, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a);
    			append_dev(a, b);
    			append_dev(a, t2);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, p0);
    			append_dev(p0, t4);
    			append_dev(div6, t5);
    			append_dev(div6, div3);
    			append_dev(div3, input);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, button);
    			append_dev(button, t8);
    			append_dev(div6, t9);
    			append_dev(div6, p1);
    			mount_component(link, p1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*submit*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$__*/ 1) && t4_value !== (t4_value = /*$__*/ ctx[0]("password.message") + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*$__*/ 1 && input_placeholder_value !== (input_placeholder_value = /*$__*/ ctx[0]("title.email"))) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if ((!current || dirty & /*$__*/ 1) && t8_value !== (t8_value = /*$__*/ ctx[0]("password.requestNew") + "")) set_data_dev(t8, t8_value);
    			const link_changes = {};

    			if (dirty & /*$$scope, $__*/ 5) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(lang);
    			destroy_component(link);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Password', slots, []);

    	const submit = () => {
    		fetch(urls.user, {
    			headers: {
    				"Content-Type": "application/json",
    				Accept: "application/json"
    			}
    		}).then(response => {
    			if (!response.ok) {
    				throw new Error(`HTTP error: ${response.status}`);
    			}

    			return response.json();
    		}).then(json => initialize(json)).catch(err => console.error(`Fetch problem: ${err.message}`));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Password> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1, __, urls, Lang, submit, $__ });
    	return [$__, submit];
    }

    class Password extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Password",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\layouts\Nav.svelte generated by Svelte v3.46.4 */
    const file$8 = "src\\layouts\\Nav.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (172:8) {#each languages as lang}
    function create_each_block$1(ctx) {
    	let a;
    	let i;
    	let t0;
    	let t1_value = /*lang*/ ctx[3].toUpperCase() + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*lang*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", "flag-icon flag-icon-" + /*lang*/ ctx[3] + " mr-2");
    			add_location(i, file$8, 173, 12, 6220);
    			attr_dev(a, "href", "#");
    			attr_dev(a, "class", "dropdown-item");
    			add_location(a, file$8, 172, 10, 6139);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			append_dev(a, t2);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(172:8) {#each languages as lang}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let nav;
    	let ul0;
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let ul1;
    	let li1;
    	let a1;
    	let i1;
    	let t1;
    	let div2;
    	let form;
    	let div1;
    	let input;
    	let t2;
    	let div0;
    	let button0;
    	let i2;
    	let t3;
    	let button1;
    	let i3;
    	let t4;
    	let li2;
    	let a2;
    	let i4;
    	let t5;
    	let span0;
    	let t7;
    	let div12;
    	let a3;
    	let div4;
    	let img0;
    	let img0_src_value;
    	let t8;
    	let div3;
    	let h30;
    	let t9;
    	let span1;
    	let i5;
    	let t10;
    	let p0;
    	let t12;
    	let p1;
    	let i6;
    	let t13;
    	let t14;
    	let div5;
    	let t15;
    	let a4;
    	let div7;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let div6;
    	let h31;
    	let t17;
    	let span2;
    	let i7;
    	let t18;
    	let p2;
    	let t20;
    	let p3;
    	let i8;
    	let t21;
    	let t22;
    	let div8;
    	let t23;
    	let a5;
    	let div10;
    	let img2;
    	let img2_src_value;
    	let t24;
    	let div9;
    	let h32;
    	let t25;
    	let span3;
    	let i9;
    	let t26;
    	let p4;
    	let t28;
    	let p5;
    	let i10;
    	let t29;
    	let t30;
    	let div11;
    	let t31;
    	let a6;
    	let t33;
    	let li3;
    	let a7;
    	let i11;
    	let t34;
    	let span4;
    	let t36;
    	let div17;
    	let span5;
    	let t38;
    	let div13;
    	let t39;
    	let a8;
    	let i12;
    	let t40;
    	let span6;
    	let t42;
    	let div14;
    	let t43;
    	let a9;
    	let i13;
    	let t44;
    	let span7;
    	let t46;
    	let div15;
    	let t47;
    	let a10;
    	let i14;
    	let t48;
    	let span8;
    	let t50;
    	let div16;
    	let t51;
    	let a11;
    	let t53;
    	let li4;
    	let a12;
    	let i15;
    	let i15_class_value;
    	let t54;
    	let div18;
    	let t55;
    	let li5;
    	let a13;
    	let i16;
    	let t56;
    	let li6;
    	let a14;
    	let i17;
    	let each_value = languages;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			ul1 = element("ul");
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			div2 = element("div");
    			form = element("form");
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			i2 = element("i");
    			t3 = space();
    			button1 = element("button");
    			i3 = element("i");
    			t4 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i4 = element("i");
    			t5 = space();
    			span0 = element("span");
    			span0.textContent = "3";
    			t7 = space();
    			div12 = element("div");
    			a3 = element("a");
    			div4 = element("div");
    			img0 = element("img");
    			t8 = space();
    			div3 = element("div");
    			h30 = element("h3");
    			t9 = text("Brad Diesel\r\n                ");
    			span1 = element("span");
    			i5 = element("i");
    			t10 = space();
    			p0 = element("p");
    			p0.textContent = "Call me whenever you can...";
    			t12 = space();
    			p1 = element("p");
    			i6 = element("i");
    			t13 = text(" 4 Hours Ago");
    			t14 = space();
    			div5 = element("div");
    			t15 = space();
    			a4 = element("a");
    			div7 = element("div");
    			img1 = element("img");
    			t16 = space();
    			div6 = element("div");
    			h31 = element("h3");
    			t17 = text("John Pierce\r\n                ");
    			span2 = element("span");
    			i7 = element("i");
    			t18 = space();
    			p2 = element("p");
    			p2.textContent = "I got your message bro";
    			t20 = space();
    			p3 = element("p");
    			i8 = element("i");
    			t21 = text(" 4 Hours Ago");
    			t22 = space();
    			div8 = element("div");
    			t23 = space();
    			a5 = element("a");
    			div10 = element("div");
    			img2 = element("img");
    			t24 = space();
    			div9 = element("div");
    			h32 = element("h3");
    			t25 = text("Nora Silvester\r\n                ");
    			span3 = element("span");
    			i9 = element("i");
    			t26 = space();
    			p4 = element("p");
    			p4.textContent = "The subject goes here";
    			t28 = space();
    			p5 = element("p");
    			i10 = element("i");
    			t29 = text(" 4 Hours Ago");
    			t30 = space();
    			div11 = element("div");
    			t31 = space();
    			a6 = element("a");
    			a6.textContent = "See All Messages";
    			t33 = space();
    			li3 = element("li");
    			a7 = element("a");
    			i11 = element("i");
    			t34 = space();
    			span4 = element("span");
    			span4.textContent = "15";
    			t36 = space();
    			div17 = element("div");
    			span5 = element("span");
    			span5.textContent = "15 Notifications";
    			t38 = space();
    			div13 = element("div");
    			t39 = space();
    			a8 = element("a");
    			i12 = element("i");
    			t40 = text(" 4 new messages\r\n          ");
    			span6 = element("span");
    			span6.textContent = "3 mins";
    			t42 = space();
    			div14 = element("div");
    			t43 = space();
    			a9 = element("a");
    			i13 = element("i");
    			t44 = text(" 8 friend requests\r\n          ");
    			span7 = element("span");
    			span7.textContent = "12 hours";
    			t46 = space();
    			div15 = element("div");
    			t47 = space();
    			a10 = element("a");
    			i14 = element("i");
    			t48 = text(" 3 new reports\r\n          ");
    			span8 = element("span");
    			span8.textContent = "2 days";
    			t50 = space();
    			div16 = element("div");
    			t51 = space();
    			a11 = element("a");
    			a11.textContent = "See All Notifications";
    			t53 = space();
    			li4 = element("li");
    			a12 = element("a");
    			i15 = element("i");
    			t54 = space();
    			div18 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t55 = space();
    			li5 = element("li");
    			a13 = element("a");
    			i16 = element("i");
    			t56 = space();
    			li6 = element("li");
    			a14 = element("a");
    			i17 = element("i");
    			attr_dev(i0, "class", "fas fa-bars");
    			add_location(i0, file$8, 13, 9, 385);
    			attr_dev(a0, "class", "nav-link");
    			attr_dev(a0, "data-widget", "pushmenu");
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "role", "button");
    			add_location(a0, file$8, 12, 6, 309);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$8, 11, 4, 280);
    			attr_dev(ul0, "class", "navbar-nav");
    			add_location(ul0, file$8, 10, 2, 251);
    			attr_dev(i1, "class", "fas fa-search");
    			add_location(i1, file$8, 24, 8, 656);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "data-widget", "navbar-search");
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "role", "button");
    			add_location(a1, file$8, 23, 6, 575);
    			attr_dev(input, "class", "form-control form-control-navbar");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$8, 29, 12, 838);
    			attr_dev(i2, "class", "fas fa-search");
    			add_location(i2, file$8, 37, 16, 1141);
    			attr_dev(button0, "class", "btn btn-navbar");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$8, 36, 14, 1078);
    			attr_dev(i3, "class", "fas fa-times");
    			add_location(i3, file$8, 44, 16, 1367);
    			attr_dev(button1, "class", "btn btn-navbar");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-widget", "navbar-search");
    			add_location(button1, file$8, 39, 14, 1209);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$8, 35, 12, 1030);
    			attr_dev(div1, "class", "input-group input-group-sm");
    			add_location(div1, file$8, 28, 10, 784);
    			attr_dev(form, "class", "form-inline");
    			add_location(form, file$8, 27, 8, 746);
    			attr_dev(div2, "class", "navbar-search-block");
    			add_location(div2, file$8, 26, 6, 703);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$8, 22, 4, 546);
    			attr_dev(i4, "class", "far fa-comments");
    			add_location(i4, file$8, 55, 8, 1643);
    			attr_dev(span0, "class", "badge badge-danger navbar-badge");
    			add_location(span0, file$8, 56, 8, 1682);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "data-toggle", "dropdown");
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$8, 54, 6, 1581);
    			if (!src_url_equal(img0.src, img0_src_value = "/assets/admin/img/user1-128x128.jpg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "User Avatar");
    			attr_dev(img0, "class", "img-size-50 mr-3 img-circle");
    			add_location(img0, file$8, 62, 12, 1943);
    			attr_dev(i5, "class", "fas fa-star");
    			add_location(i5, file$8, 71, 19, 2303);
    			attr_dev(span1, "class", "float-right text-sm text-danger");
    			add_location(span1, file$8, 70, 16, 2237);
    			attr_dev(h30, "class", "dropdown-item-title");
    			add_location(h30, file$8, 68, 14, 2158);
    			attr_dev(p0, "class", "text-sm");
    			add_location(p0, file$8, 74, 14, 2390);
    			attr_dev(i6, "class", "far fa-clock mr-1");
    			add_location(i6, file$8, 76, 16, 2504);
    			attr_dev(p1, "class", "text-sm text-muted");
    			add_location(p1, file$8, 75, 14, 2456);
    			attr_dev(div3, "class", "media-body");
    			add_location(div3, file$8, 67, 12, 2118);
    			attr_dev(div4, "class", "media");
    			add_location(div4, file$8, 61, 10, 1910);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "dropdown-item");
    			add_location(a3, file$8, 59, 8, 1830);
    			attr_dev(div5, "class", "dropdown-divider");
    			add_location(div5, file$8, 82, 8, 2661);
    			if (!src_url_equal(img1.src, img1_src_value = "/assets/admin/img/user8-128x128.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "User Avatar");
    			attr_dev(img1, "class", "img-size-50 img-circle mr-3");
    			add_location(img1, file$8, 86, 12, 2816);
    			attr_dev(i7, "class", "fas fa-star");
    			add_location(i7, file$8, 95, 19, 3175);
    			attr_dev(span2, "class", "float-right text-sm text-muted");
    			add_location(span2, file$8, 94, 16, 3110);
    			attr_dev(h31, "class", "dropdown-item-title");
    			add_location(h31, file$8, 92, 14, 3031);
    			attr_dev(p2, "class", "text-sm");
    			add_location(p2, file$8, 98, 14, 3262);
    			attr_dev(i8, "class", "far fa-clock mr-1");
    			add_location(i8, file$8, 100, 16, 3371);
    			attr_dev(p3, "class", "text-sm text-muted");
    			add_location(p3, file$8, 99, 14, 3323);
    			attr_dev(div6, "class", "media-body");
    			add_location(div6, file$8, 91, 12, 2991);
    			attr_dev(div7, "class", "media");
    			add_location(div7, file$8, 85, 10, 2783);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "dropdown-item");
    			add_location(a4, file$8, 83, 8, 2703);
    			attr_dev(div8, "class", "dropdown-divider");
    			add_location(div8, file$8, 106, 8, 3528);
    			if (!src_url_equal(img2.src, img2_src_value = "..//assets/admin/img/user3-128x128.jpg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "User Avatar");
    			attr_dev(img2, "class", "img-size-50 img-circle mr-3");
    			add_location(img2, file$8, 110, 12, 3683);
    			attr_dev(i9, "class", "fas fa-star");
    			add_location(i9, file$8, 119, 19, 4050);
    			attr_dev(span3, "class", "float-right text-sm text-warning");
    			add_location(span3, file$8, 118, 16, 3983);
    			attr_dev(h32, "class", "dropdown-item-title");
    			add_location(h32, file$8, 116, 14, 3901);
    			attr_dev(p4, "class", "text-sm");
    			add_location(p4, file$8, 122, 14, 4137);
    			attr_dev(i10, "class", "far fa-clock mr-1");
    			add_location(i10, file$8, 124, 16, 4245);
    			attr_dev(p5, "class", "text-sm text-muted");
    			add_location(p5, file$8, 123, 14, 4197);
    			attr_dev(div9, "class", "media-body");
    			add_location(div9, file$8, 115, 12, 3861);
    			attr_dev(div10, "class", "media");
    			add_location(div10, file$8, 109, 10, 3650);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "dropdown-item");
    			add_location(a5, file$8, 107, 8, 3570);
    			attr_dev(div11, "class", "dropdown-divider");
    			add_location(div11, file$8, 130, 8, 4402);
    			attr_dev(a6, "href", "#");
    			attr_dev(a6, "class", "dropdown-item dropdown-footer");
    			add_location(a6, file$8, 131, 8, 4444);
    			attr_dev(div12, "class", "dropdown-menu dropdown-menu-lg dropdown-menu-right");
    			add_location(div12, file$8, 58, 6, 1756);
    			attr_dev(li2, "class", "nav-item dropdown");
    			add_location(li2, file$8, 53, 4, 1543);
    			attr_dev(i11, "class", "far fa-bell");
    			add_location(i11, file$8, 137, 8, 4687);
    			attr_dev(span4, "class", "badge badge-warning navbar-badge");
    			add_location(span4, file$8, 138, 8, 4722);
    			attr_dev(a7, "class", "nav-link");
    			attr_dev(a7, "data-toggle", "dropdown");
    			attr_dev(a7, "href", "#");
    			add_location(a7, file$8, 136, 6, 4625);
    			attr_dev(span5, "class", "dropdown-header");
    			add_location(span5, file$8, 141, 8, 4872);
    			attr_dev(div13, "class", "dropdown-divider");
    			add_location(div13, file$8, 142, 8, 4935);
    			attr_dev(i12, "class", "fas fa-envelope mr-2");
    			add_location(i12, file$8, 144, 10, 5023);
    			attr_dev(span6, "class", "float-right text-muted text-sm");
    			add_location(span6, file$8, 145, 10, 5084);
    			attr_dev(a8, "href", "#");
    			attr_dev(a8, "class", "dropdown-item");
    			add_location(a8, file$8, 143, 8, 4977);
    			attr_dev(div14, "class", "dropdown-divider");
    			add_location(div14, file$8, 147, 8, 5166);
    			attr_dev(i13, "class", "fas fa-users mr-2");
    			add_location(i13, file$8, 149, 10, 5254);
    			attr_dev(span7, "class", "float-right text-muted text-sm");
    			add_location(span7, file$8, 150, 10, 5315);
    			attr_dev(a9, "href", "#");
    			attr_dev(a9, "class", "dropdown-item");
    			add_location(a9, file$8, 148, 8, 5208);
    			attr_dev(div15, "class", "dropdown-divider");
    			add_location(div15, file$8, 152, 8, 5399);
    			attr_dev(i14, "class", "fas fa-file mr-2");
    			add_location(i14, file$8, 154, 10, 5487);
    			attr_dev(span8, "class", "float-right text-muted text-sm");
    			add_location(span8, file$8, 155, 10, 5543);
    			attr_dev(a10, "href", "#");
    			attr_dev(a10, "class", "dropdown-item");
    			add_location(a10, file$8, 153, 8, 5441);
    			attr_dev(div16, "class", "dropdown-divider");
    			add_location(div16, file$8, 157, 8, 5625);
    			attr_dev(a11, "href", "#");
    			attr_dev(a11, "class", "dropdown-item dropdown-footer");
    			add_location(a11, file$8, 158, 8, 5667);
    			attr_dev(div17, "class", "dropdown-menu dropdown-menu-lg dropdown-menu-right");
    			add_location(div17, file$8, 140, 6, 4798);
    			attr_dev(li3, "class", "nav-item dropdown");
    			add_location(li3, file$8, 135, 4, 4587);
    			attr_dev(i15, "class", i15_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0]);
    			add_location(i15, file$8, 165, 8, 5917);
    			attr_dev(a12, "class", "nav-link");
    			attr_dev(a12, "data-toggle", "dropdown");
    			attr_dev(a12, "href", "#");
    			attr_dev(a12, "aria-expanded", "false");
    			add_location(a12, file$8, 164, 6, 5833);
    			attr_dev(div18, "class", "dropdown-menu dropdown-menu-right p-0");
    			set_style(div18, "left", "inherit");
    			set_style(div18, "right", "0px");
    			add_location(div18, file$8, 167, 6, 5980);
    			attr_dev(li4, "class", "nav-item dropdown");
    			add_location(li4, file$8, 163, 4, 5795);
    			attr_dev(i16, "class", "fas fa-expand-arrows-alt");
    			add_location(i16, file$8, 181, 8, 6470);
    			attr_dev(a13, "class", "nav-link");
    			attr_dev(a13, "data-widget", "fullscreen");
    			attr_dev(a13, "href", "#");
    			attr_dev(a13, "role", "button");
    			add_location(a13, file$8, 180, 6, 6392);
    			attr_dev(li5, "class", "nav-item");
    			add_location(li5, file$8, 179, 4, 6363);
    			attr_dev(i17, "class", "fas fa-th-large");
    			add_location(i17, file$8, 192, 8, 6720);
    			attr_dev(a14, "class", "nav-link");
    			attr_dev(a14, "data-widget", "control-sidebar");
    			attr_dev(a14, "data-slide", "true");
    			attr_dev(a14, "href", "#");
    			attr_dev(a14, "role", "button");
    			add_location(a14, file$8, 185, 6, 6566);
    			attr_dev(li6, "class", "nav-item");
    			add_location(li6, file$8, 184, 4, 6537);
    			attr_dev(ul1, "class", "navbar-nav ml-auto");
    			add_location(ul1, file$8, 19, 2, 479);
    			attr_dev(nav, "class", "main-header navbar navbar-expand navbar-white navbar-light");
    			add_location(nav, file$8, 8, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(nav, t0);
    			append_dev(nav, ul1);
    			append_dev(ul1, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(li1, t1);
    			append_dev(li1, div2);
    			append_dev(div2, form);
    			append_dev(form, div1);
    			append_dev(div1, input);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, i2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, i3);
    			append_dev(ul1, t4);
    			append_dev(ul1, li2);
    			append_dev(li2, a2);
    			append_dev(a2, i4);
    			append_dev(a2, t5);
    			append_dev(a2, span0);
    			append_dev(li2, t7);
    			append_dev(li2, div12);
    			append_dev(div12, a3);
    			append_dev(a3, div4);
    			append_dev(div4, img0);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, h30);
    			append_dev(h30, t9);
    			append_dev(h30, span1);
    			append_dev(span1, i5);
    			append_dev(div3, t10);
    			append_dev(div3, p0);
    			append_dev(div3, t12);
    			append_dev(div3, p1);
    			append_dev(p1, i6);
    			append_dev(p1, t13);
    			append_dev(div12, t14);
    			append_dev(div12, div5);
    			append_dev(div12, t15);
    			append_dev(div12, a4);
    			append_dev(a4, div7);
    			append_dev(div7, img1);
    			append_dev(div7, t16);
    			append_dev(div7, div6);
    			append_dev(div6, h31);
    			append_dev(h31, t17);
    			append_dev(h31, span2);
    			append_dev(span2, i7);
    			append_dev(div6, t18);
    			append_dev(div6, p2);
    			append_dev(div6, t20);
    			append_dev(div6, p3);
    			append_dev(p3, i8);
    			append_dev(p3, t21);
    			append_dev(div12, t22);
    			append_dev(div12, div8);
    			append_dev(div12, t23);
    			append_dev(div12, a5);
    			append_dev(a5, div10);
    			append_dev(div10, img2);
    			append_dev(div10, t24);
    			append_dev(div10, div9);
    			append_dev(div9, h32);
    			append_dev(h32, t25);
    			append_dev(h32, span3);
    			append_dev(span3, i9);
    			append_dev(div9, t26);
    			append_dev(div9, p4);
    			append_dev(div9, t28);
    			append_dev(div9, p5);
    			append_dev(p5, i10);
    			append_dev(p5, t29);
    			append_dev(div12, t30);
    			append_dev(div12, div11);
    			append_dev(div12, t31);
    			append_dev(div12, a6);
    			append_dev(ul1, t33);
    			append_dev(ul1, li3);
    			append_dev(li3, a7);
    			append_dev(a7, i11);
    			append_dev(a7, t34);
    			append_dev(a7, span4);
    			append_dev(li3, t36);
    			append_dev(li3, div17);
    			append_dev(div17, span5);
    			append_dev(div17, t38);
    			append_dev(div17, div13);
    			append_dev(div17, t39);
    			append_dev(div17, a8);
    			append_dev(a8, i12);
    			append_dev(a8, t40);
    			append_dev(a8, span6);
    			append_dev(div17, t42);
    			append_dev(div17, div14);
    			append_dev(div17, t43);
    			append_dev(div17, a9);
    			append_dev(a9, i13);
    			append_dev(a9, t44);
    			append_dev(a9, span7);
    			append_dev(div17, t46);
    			append_dev(div17, div15);
    			append_dev(div17, t47);
    			append_dev(div17, a10);
    			append_dev(a10, i14);
    			append_dev(a10, t48);
    			append_dev(a10, span8);
    			append_dev(div17, t50);
    			append_dev(div17, div16);
    			append_dev(div17, t51);
    			append_dev(div17, a11);
    			append_dev(ul1, t53);
    			append_dev(ul1, li4);
    			append_dev(li4, a12);
    			append_dev(a12, i15);
    			append_dev(li4, t54);
    			append_dev(li4, div18);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div18, null);
    			}

    			append_dev(ul1, t55);
    			append_dev(ul1, li5);
    			append_dev(li5, a13);
    			append_dev(a13, i16);
    			append_dev(ul1, t56);
    			append_dev(ul1, li6);
    			append_dev(li6, a14);
    			append_dev(a14, i17);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$locale*/ 1 && i15_class_value !== (i15_class_value = "flag-icon flag-icon-" + /*$locale*/ ctx[0])) {
    				attr_dev(i15, "class", i15_class_value);
    			}

    			if (dirty & /*setLocale, languages*/ 2) {
    				each_value = languages;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div18, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $locale;
    	validate_store(locale, 'locale');
    	component_subscribe($$self, locale, $$value => $$invalidate(0, $locale = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);

    	function setLocale(lang) {
    		set_store_value(locale, $locale = lang, $locale);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = lang => setLocale(lang);

    	$$self.$capture_state = () => ({
    		languages,
    		locale,
    		__,
    		setLocale,
    		$locale
    	});

    	return [$locale, setLocale, click_handler];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\layouts\MainSidebar.svelte generated by Svelte v3.46.4 */
    const file$7 = "src\\layouts\\MainSidebar.svelte";

    // (49:10) <Link to="" class="nav-link">
    function create_default_slot_2$1(ctx) {
    	let i;
    	let t0;
    	let p;
    	let t1_value = /*$__*/ ctx[0]("title.dashboard") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "nav-icon fas fa-th");
    			add_location(i, file$7, 49, 12, 1521);
    			add_location(p, file$7, 50, 12, 1567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 1 && t1_value !== (t1_value = /*$__*/ ctx[0]("title.dashboard") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(49:10) <Link to=\\\"\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (57:10) <Link to="users" class="nav-link">
    function create_default_slot_1$1(ctx) {
    	let i;
    	let t0;
    	let p;
    	let t1_value = /*$__*/ ctx[0]("title.users") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "nav-icon fas fa-users");
    			add_location(i, file$7, 57, 12, 1753);
    			add_location(p, file$7, 58, 12, 1802);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 1 && t1_value !== (t1_value = /*$__*/ ctx[0]("title.users") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(57:10) <Link to=\\\"users\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (74:14) <Link to="layouts" class="nav-link">
    function create_default_slot$2(ctx) {
    	let i;
    	let t0;
    	let p;
    	let t1_value = /*$__*/ ctx[0]("title.layouts") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "nav-icon fas fa-table-columns");
    			add_location(i, file$7, 74, 16, 2319);
    			add_location(p, file$7, 75, 16, 2380);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$__*/ 1 && t1_value !== (t1_value = /*$__*/ ctx[0]("title.layouts") + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(74:14) <Link to=\\\"layouts\\\" class=\\\"nav-link\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let aside;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let t2;
    	let div3;
    	let div2;
    	let div1;
    	let input;
    	let input_placeholder_value;
    	let t3;
    	let div0;
    	let button;
    	let i0;
    	let t4;
    	let nav;
    	let ul1;
    	let li0;
    	let link0;
    	let t5;
    	let li1;
    	let link1;
    	let t6;
    	let li3;
    	let a1;
    	let i1;
    	let t7;
    	let p;
    	let t8_value = /*$__*/ ctx[0]("title.options") + "";
    	let t8;
    	let t9;
    	let i2;
    	let t10;
    	let ul0;
    	let li2;
    	let link2;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "users",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "layouts",
    				class: "nav-link",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			span.textContent = "AdminLTE 3";
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t3 = space();
    			div0 = element("div");
    			button = element("button");
    			i0 = element("i");
    			t4 = space();
    			nav = element("nav");
    			ul1 = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t5 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t6 = space();
    			li3 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t7 = space();
    			p = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			i2 = element("i");
    			t10 = space();
    			ul0 = element("ul");
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "" + (APP_ROOT + "/assets/admin/img/AdminLTELogo.png"))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "AdminLTE Logo");
    			attr_dev(img, "class", "brand-image img-circle elevation-3");
    			set_style(img, "opacity", "0.8");
    			add_location(img, file$7, 9, 4, 287);
    			attr_dev(span, "class", "brand-text font-weight-light");
    			add_location(span, file$7, 15, 4, 468);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "brand-link");
    			add_location(a0, file$7, 8, 2, 250);
    			attr_dev(input, "class", "form-control form-control-sidebar");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$__*/ ctx[0]("any.search"));
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$7, 23, 8, 724);
    			attr_dev(i0, "class", "fas fa-search fa-fw");
    			add_location(i0, file$7, 31, 12, 994);
    			attr_dev(button, "class", "btn btn-sidebar");
    			add_location(button, file$7, 30, 10, 948);
    			attr_dev(div0, "class", "input-group-append");
    			add_location(div0, file$7, 29, 8, 904);
    			attr_dev(div1, "class", "input-group");
    			attr_dev(div1, "data-widget", "sidebar-search");
    			add_location(div1, file$7, 22, 6, 660);
    			attr_dev(div2, "class", "form-inline mt-3");
    			add_location(div2, file$7, 21, 4, 622);
    			attr_dev(li0, "class", "nav-item");
    			add_location(li0, file$7, 47, 8, 1445);
    			attr_dev(li1, "class", "nav-item");
    			add_location(li1, file$7, 55, 8, 1672);
    			attr_dev(i1, "class", "nav-icon fa-solid fa-gears");
    			add_location(i1, file$7, 65, 12, 1991);
    			attr_dev(i2, "class", "right fas fa-angle-left");
    			add_location(i2, file$7, 68, 14, 2102);
    			add_location(p, file$7, 66, 12, 2045);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "nav-link");
    			add_location(a1, file$7, 64, 10, 1946);
    			attr_dev(li2, "class", "nav-item");
    			add_location(li2, file$7, 72, 12, 2228);
    			attr_dev(ul0, "class", "nav nav-treeview");
    			add_location(ul0, file$7, 71, 10, 2185);
    			attr_dev(li3, "class", "nav-item menu-open");
    			add_location(li3, file$7, 63, 8, 1903);
    			attr_dev(ul1, "class", "nav nav-pills nav-sidebar flex-column");
    			attr_dev(ul1, "data-widget", "treeview");
    			attr_dev(ul1, "role", "menu");
    			attr_dev(ul1, "data-accordion", "false");
    			add_location(ul1, file$7, 39, 6, 1151);
    			attr_dev(nav, "class", "mt-2");
    			add_location(nav, file$7, 38, 4, 1125);
    			attr_dev(div3, "class", "sidebar");
    			add_location(div3, file$7, 19, 2, 562);
    			attr_dev(aside, "class", "main-sidebar sidebar-dark-primary elevation-4");
    			add_location(aside, file$7, 6, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, a0);
    			append_dev(a0, img);
    			append_dev(a0, t0);
    			append_dev(a0, span);
    			append_dev(aside, t2);
    			append_dev(aside, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, i0);
    			append_dev(div3, t4);
    			append_dev(div3, nav);
    			append_dev(nav, ul1);
    			append_dev(ul1, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul1, t5);
    			append_dev(ul1, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul1, t6);
    			append_dev(ul1, li3);
    			append_dev(li3, a1);
    			append_dev(a1, i1);
    			append_dev(a1, t7);
    			append_dev(a1, p);
    			append_dev(p, t8);
    			append_dev(p, t9);
    			append_dev(p, i2);
    			append_dev(li3, t10);
    			append_dev(li3, ul0);
    			append_dev(ul0, li2);
    			mount_component(link2, li2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$__*/ 1 && input_placeholder_value !== (input_placeholder_value = /*$__*/ ctx[0]("any.search"))) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			const link0_changes = {};

    			if (dirty & /*$$scope, $__*/ 3) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope, $__*/ 3) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			if ((!current || dirty & /*$__*/ 1) && t8_value !== (t8_value = /*$__*/ ctx[0]("title.options") + "")) set_data_dev(t8, t8_value);
    			const link2_changes = {};

    			if (dirty & /*$$scope, $__*/ 3) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainSidebar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainSidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ APP_ROOT, Link: Link$1, __, $__ });
    	return [$__];
    }

    class MainSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainSidebar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\layouts\ControlSidebar.svelte generated by Svelte v3.46.4 */
    const file$6 = "src\\layouts\\ControlSidebar.svelte";

    function create_fragment$6(ctx) {
    	let aside;
    	let div;
    	let h5;
    	let t0_value = /*$__*/ ctx[0]('any.title') + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*$__*/ ctx[0]('any.content') + "";
    	let t2;

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div = element("div");
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			add_location(h5, file$6, 7, 4, 193);
    			add_location(p, file$6, 8, 4, 226);
    			attr_dev(div, "class", "p-3");
    			add_location(div, file$6, 6, 2, 170);
    			attr_dev(aside, "class", "control-sidebar control-sidebar-dark");
    			add_location(aside, file$6, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$__*/ 1 && t0_value !== (t0_value = /*$__*/ ctx[0]('any.title') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$__*/ 1 && t2_value !== (t2_value = /*$__*/ ctx[0]('any.content') + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ControlSidebar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ControlSidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ __, $__ });
    	return [$__];
    }

    class ControlSidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ControlSidebar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\layouts\Footer.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\layouts\\Footer.svelte";

    function create_fragment$5(ctx) {
    	let footer;
    	let div;
    	let t0_value = /*$__*/ ctx[0]('footer.text') + "";
    	let t0;
    	let t1;
    	let strong;
    	let t2_value = /*$__*/ ctx[0]('footer.copyright') + "";
    	let t2;
    	let t3;
    	let a;
    	let t5;
    	let t6;
    	let t7_value = /*$__*/ ctx[0]('footer.rights') + "";
    	let t7;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			strong = element("strong");
    			t2 = text(t2_value);
    			t3 = text(" © 2014-2021 ");
    			a = element("a");
    			a.textContent = "AdminLTE.io";
    			t5 = text(".");
    			t6 = space();
    			t7 = text(t7_value);
    			attr_dev(div, "class", "float-right d-none d-sm-inline");
    			add_location(div, file$5, 6, 2, 125);
    			attr_dev(a, "href", "https://adminlte.io");
    			add_location(a, file$5, 8, 53, 282);
    			add_location(strong, file$5, 8, 2, 231);
    			attr_dev(footer, "class", "main-footer");
    			add_location(footer, file$5, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, t0);
    			append_dev(footer, t1);
    			append_dev(footer, strong);
    			append_dev(strong, t2);
    			append_dev(strong, t3);
    			append_dev(strong, a);
    			append_dev(strong, t5);
    			append_dev(footer, t6);
    			append_dev(footer, t7);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$__*/ 1 && t0_value !== (t0_value = /*$__*/ ctx[0]('footer.text') + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$__*/ 1 && t2_value !== (t2_value = /*$__*/ ctx[0]('footer.copyright') + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$__*/ 1 && t7_value !== (t7_value = /*$__*/ ctx[0]('footer.rights') + "")) set_data_dev(t7, t7_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(0, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ __, $__ });
    	return [$__];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Breadcrump.svelte generated by Svelte v3.46.4 */
    const file$4 = "src\\components\\Breadcrump.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (20:14) <Link to={item.pageUrl}>
    function create_default_slot$1(ctx) {
    	let t_value = /*item*/ ctx[3].pageTitle + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 2 && t_value !== (t_value = /*item*/ ctx[3].pageTitle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(20:14) <Link to={item.pageUrl}>",
    		ctx
    	});

    	return block;
    }

    // (18:10) {#each links as item}
    function create_each_block(ctx) {
    	let li;
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*item*/ ctx[3].pageUrl,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			attr_dev(li, "class", "breadcrumb-item");
    			add_location(li, file$4, 18, 12, 451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*links*/ 2) link_changes.to = /*item*/ ctx[3].pageUrl;

    			if (dirty & /*$$scope, links*/ 66) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:10) {#each links as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let div1;
    	let ol;
    	let t2;
    	let li;
    	let t3;
    	let current;
    	let each_value = /*links*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			li = element("li");
    			t3 = text(/*active*/ ctx[2]);
    			attr_dev(h1, "class", "m-0");
    			add_location(h1, file$4, 12, 8, 262);
    			attr_dev(div0, "class", "col-sm-6");
    			add_location(div0, file$4, 11, 6, 230);
    			attr_dev(li, "class", "breadcrumb-item active");
    			add_location(li, file$4, 22, 10, 592);
    			attr_dev(ol, "class", "breadcrumb float-sm-right");
    			add_location(ol, file$4, 16, 8, 366);
    			attr_dev(div1, "class", "col-sm-6");
    			add_location(div1, file$4, 15, 6, 334);
    			attr_dev(div2, "class", "row mb-2");
    			add_location(div2, file$4, 10, 4, 200);
    			attr_dev(div3, "class", "container-fluid");
    			add_location(div3, file$4, 9, 2, 165);
    			attr_dev(div4, "class", "content-header");
    			add_location(div4, file$4, 8, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			append_dev(ol, t2);
    			append_dev(ol, li);
    			append_dev(li, t3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);

    			if (dirty & /*links*/ 2) {
    				each_value = /*links*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ol, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*active*/ 4) set_data_dev(t3, /*active*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Breadcrump', slots, []);
    	let { title } = $$props;
    	let { links } = $$props;
    	let { active } = $$props;
    	const writable_props = ['title', 'links', 'active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Breadcrump> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('links' in $$props) $$invalidate(1, links = $$props.links);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({ Link: Link$1, title, links, active });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('links' in $$props) $$invalidate(1, links = $$props.links);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, links, active];
    }

    class Breadcrump extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 0, links: 1, active: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrump",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Breadcrump> was created without expected prop 'title'");
    		}

    		if (/*links*/ ctx[1] === undefined && !('links' in props)) {
    			console.warn("<Breadcrump> was created without expected prop 'links'");
    		}

    		if (/*active*/ ctx[2] === undefined && !('active' in props)) {
    			console.warn("<Breadcrump> was created without expected prop 'active'");
    		}
    	}

    	get title() {
    		throw new Error("<Breadcrump>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Breadcrump>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get links() {
    		throw new Error("<Breadcrump>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set links(value) {
    		throw new Error("<Breadcrump>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Breadcrump>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Breadcrump>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\users\index.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\pages\\users\\index.svelte";

    function create_fragment$3(ctx) {
    	let breadcrump;
    	let t0;
    	let div;
    	let t1_value = /*$__*/ ctx[1]("title.users") + "";
    	let t1;
    	let current;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[3],
    				links: /*links*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "container-fluid users");
    			add_location(div, file$3, 11, 0, 347);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrump_changes = {};
    			if (dirty & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty & /*active*/ 8) breadcrump_changes.active = /*active*/ ctx[3];
    			if (dirty & /*links*/ 4) breadcrump_changes.links = /*links*/ ctx[2];
    			breadcrump.$set(breadcrump_changes);
    			if ((!current || dirty & /*$__*/ 2) && t1_value !== (t1_value = /*$__*/ ctx[1]("title.users") + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Users', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Users> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route: Route$1,
    		__,
    		Breadcrump,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('links' in $$props) $$invalidate(2, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.users"));
    		}

    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(3, active = title);
    		}

    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(2, links = [
    				{
    					pageUrl: "admin",
    					pageTitle: $__("title.dashboard")
    				}
    			]);
    		}
    	};

    	return [title, $__, links, active];
    }

    class Users extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Users",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\layouts\index.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\pages\\layouts\\index.svelte";

    function create_fragment$2(ctx) {
    	let breadcrump;
    	let t0;
    	let div;
    	let t1_value = /*$__*/ ctx[1]("title.layouts") + "";
    	let t1;
    	let current;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[3],
    				links: /*links*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "container-fluid layouts");
    			add_location(div, file$2, 11, 0, 349);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrump_changes = {};
    			if (dirty & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty & /*active*/ 8) breadcrump_changes.active = /*active*/ ctx[3];
    			if (dirty & /*links*/ 4) breadcrump_changes.links = /*links*/ ctx[2];
    			breadcrump.$set(breadcrump_changes);
    			if ((!current || dirty & /*$__*/ 2) && t1_value !== (t1_value = /*$__*/ ctx[1]("title.layouts") + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layouts', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layouts> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route: Route$1,
    		__,
    		Breadcrump,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('links' in $$props) $$invalidate(2, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.layouts"));
    		}

    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(3, active = title);
    		}

    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(2, links = [
    				{
    					pageUrl: "admin",
    					pageTitle: $__("title.dashboard")
    				}
    			]);
    		}
    	};

    	return [title, $__, links, active];
    }

    class Layouts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layouts",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Dashboard.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\pages\\Dashboard.svelte";

    function create_fragment$1(ctx) {
    	let breadcrump;
    	let t0;
    	let div;
    	let t1_value = /*$__*/ ctx[1]("title.dashboard") + "";
    	let t1;
    	let current;

    	breadcrump = new Breadcrump({
    			props: {
    				title: /*title*/ ctx[0],
    				active: /*active*/ ctx[3],
    				links: /*links*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(breadcrump.$$.fragment);
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "container-fluid dashboard");
    			add_location(div, file$1, 11, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(breadcrump, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const breadcrump_changes = {};
    			if (dirty & /*title*/ 1) breadcrump_changes.title = /*title*/ ctx[0];
    			if (dirty & /*active*/ 8) breadcrump_changes.active = /*active*/ ctx[3];
    			if (dirty & /*links*/ 4) breadcrump_changes.links = /*links*/ ctx[2];
    			breadcrump.$set(breadcrump_changes);
    			if ((!current || dirty & /*$__*/ 2) && t1_value !== (t1_value = /*$__*/ ctx[1]("title.dashboard") + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrump.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrump.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(breadcrump, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let title;
    	let active;
    	let links;
    	let $__;
    	validate_store(__, '__');
    	component_subscribe($$self, __, $$value => $$invalidate(1, $__ = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route: Route$1,
    		__,
    		Breadcrump,
    		links,
    		title,
    		active,
    		$__
    	});

    	$$self.$inject_state = $$props => {
    		if ('links' in $$props) $$invalidate(2, links = $$props.links);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$__*/ 2) {
    			$$invalidate(0, title = $__("title.dashboard"));
    		}

    		if ($$self.$$.dirty & /*title*/ 1) {
    			$$invalidate(3, active = title);
    		}
    	};

    	$$invalidate(2, links = []);
    	return [title, $__, links, active];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (37:14) <Route path="/">
    function create_default_slot_5(ctx) {
    	let dashboard;
    	let current;
    	dashboard = new Dashboard({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dashboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dashboard, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dashboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(37:14) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:14) <Route path="users">
    function create_default_slot_4(ctx) {
    	let users;
    	let current;
    	users = new Users({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(users.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(users, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(users.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(users.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(users, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(40:14) <Route path=\\\"users\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:14) <Route path="layouts">
    function create_default_slot_3(ctx) {
    	let layouts;
    	let current;
    	layouts = new Layouts({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(layouts.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layouts, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layouts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layouts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layouts, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(43:14) <Route path=\\\"layouts\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:6) <Route path="admin/*" meta={{ name: "admin" }}>
    function create_default_slot_2(ctx) {
    	let div2;
    	let nav;
    	let t0;
    	let mainsidebar;
    	let t1;
    	let div1;
    	let div0;
    	let route0;
    	let t2;
    	let route1;
    	let t3;
    	let route2;
    	let t4;
    	let controlsidebar;
    	let t5;
    	let footer;
    	let current;
    	nav = new Nav({ $$inline: true });
    	mainsidebar = new MainSidebar({ $$inline: true });

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "users",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "layouts",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	controlsidebar = new ControlSidebar({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			create_component(mainsidebar.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(route0.$$.fragment);
    			t2 = space();
    			create_component(route1.$$.fragment);
    			t3 = space();
    			create_component(route2.$$.fragment);
    			t4 = space();
    			create_component(controlsidebar.$$.fragment);
    			t5 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file, 35, 12, 1366);
    			attr_dev(div1, "class", "content-wrapper");
    			add_location(div1, file, 34, 10, 1323);
    			attr_dev(div2, "class", "wrapper");
    			add_location(div2, file, 25, 8, 1082);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(nav, div2, null);
    			append_dev(div2, t0);
    			mount_component(mainsidebar, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(route0, div0, null);
    			append_dev(div0, t2);
    			mount_component(route1, div0, null);
    			append_dev(div0, t3);
    			mount_component(route2, div0, null);
    			append_dev(div2, t4);
    			mount_component(controlsidebar, div2, null);
    			append_dev(div2, t5);
    			mount_component(footer, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(mainsidebar.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(controlsidebar.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(mainsidebar.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(controlsidebar.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(nav);
    			destroy_component(mainsidebar);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(controlsidebar);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(25:6) <Route path=\\\"admin/*\\\" meta={{ name: \\\"admin\\\" }}>",
    		ctx
    	});

    	return block;
    }

    // (20:2) <Router>
    function create_default_slot_1(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let current;

    	route0 = new Route$1({
    			props: { path: "login", component: Login },
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: { path: "register", component: Register },
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "forget-password",
    				component: Password
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "admin/*",
    				meta: { name: "admin" },
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			attr_dev(div, "class", /*authStatus*/ ctx[0] ? "sidebar-mini" : "login-page");
    			add_location(div, file, 20, 4, 798);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			append_dev(div, t2);
    			mount_component(route3, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(20:2) <Router>",
    		ctx
    	});

    	return block;
    }

    // (19:0) <Translator>
    function create_default_slot(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(19:0) <Translator>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let translator;
    	let current;

    	translator = new Translator({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(translator.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(translator, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const translator_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				translator_changes.$$scope = { dirty, ctx };
    			}

    			translator.$set(translator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(translator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(translator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(translator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let authStatus = true;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Translator,
    		__,
    		Route: Route$1,
    		Router: Router$1,
    		Login,
    		Register,
    		Password,
    		Nav,
    		MainSidebar,
    		ControlSidebar,
    		Footer,
    		Users,
    		Layouts,
    		Dashboard,
    		authStatus
    	});

    	$$self.$inject_state = $$props => {
    		if ('authStatus' in $$props) $$invalidate(0, authStatus = $$props.authStatus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [authStatus];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
