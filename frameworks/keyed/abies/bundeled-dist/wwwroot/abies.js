// wwwroot/js/pine.js

import { dotnet } from './_framework/dotnet.js';

// ═══════════════════════════════════════════════════════════════════════════════
// TRACING VERBOSITY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
// Controls how much detail is traced. End users typically want 'user' level,
// while framework developers debugging Abies itself may want 'debug' level.
//
// Levels:
//   'off'   - No tracing at all
//   'user'  - UI Events and HTTP calls only (default for production)
//   'debug' - Everything including DOM mutations, attribute updates, etc.
//
// Configuration priority (highest to lowest):
//   1. window.__OTEL_VERBOSITY = 'debug'
//   2. <meta name="otel-verbosity" content="user">
//   3. URL parameter: ?otel_verbosity=debug
//   4. Default: 'user'
// ═══════════════════════════════════════════════════════════════════════════════

const VERBOSITY_LEVELS = { off: 0, user: 1, debug: 2 };

const getVerbosity = (() => {
  let cached = null;
  return () => {
    if (cached !== null) return cached;
    try {
      // Priority 1: Global variable
      if (window.__OTEL_VERBOSITY) {
        const v = String(window.__OTEL_VERBOSITY).toLowerCase();
        if (v in VERBOSITY_LEVELS) { cached = v; return cached; }
      }
      // Priority 2: Meta tag
      const meta = document.querySelector('meta[name="otel-verbosity"]');
      if (meta) {
        const v = (meta.getAttribute('content') || '').toLowerCase();
        if (v in VERBOSITY_LEVELS) { cached = v; return cached; }
      }
      // Priority 3: URL parameter
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('otel_verbosity');
      if (urlParam) {
        const v = urlParam.toLowerCase();
        if (v in VERBOSITY_LEVELS) { cached = v; return cached; }
      }
    } catch {}
    // Default
    cached = 'user';
    return cached;
  };
})();

// Check if a span should be recorded based on verbosity level
// 'user' spans: UI Event, HTTP (fetch/XHR)
// 'debug' spans: DOM mutations, attribute updates, etc.
function shouldTrace(spanName) {
  const verbosity = getVerbosity();
  if (verbosity === 'off') return false;
  if (verbosity === 'debug') return true;
  // 'user' level: only trace user interactions and HTTP calls
  const userLevelSpans = ['UI Event', 'HTTP GET', 'HTTP POST', 'HTTP PUT', 'HTTP DELETE', 'HTTP PATCH', 'HTTP OPTIONS', 'HTTP HEAD'];
  return userLevelSpans.some(prefix => spanName.startsWith(prefix)) || spanName === 'UI Event';
}

// Initialize a minimal no-op tracing API; upgrade to real OTel asynchronously if available
let trace = {
    getTracer: () => ({
        startSpan: () => ({
            setStatus: () => {},
            recordException: () => {},
            end: () => {}
        })
    })
};
let SpanStatusCode = { OK: 1, ERROR: 2 };

const isOtelDisabled = (() => {
  try {
    if (window.__OTEL_DISABLED === true) return true;
    if (getVerbosity() === 'off') return true;
    const enabledMeta = document.querySelector('meta[name="otel-enabled"]');
    const enabledValue = enabledMeta && enabledMeta.getAttribute('content');
    if (enabledValue && enabledValue.toLowerCase() === 'off') return true;
    const cdnMeta = document.querySelector('meta[name="otel-cdn"]');
    const cdnValue = cdnMeta && cdnMeta.getAttribute('content');
    if (cdnValue && cdnValue.toLowerCase() === 'off') return true;
  } catch {}
  return false;
})();

// Wire browser spans to Aspire via OTLP/HTTP if available, but never block app startup
void (async () => {
  try {
    if (isOtelDisabled) {
      return;
    }
    const otelInit = (async () => {
      // Allow disabling CDN-based OTel via flag or meta tag
      const useCdn = (() => {
        try {
          if (window.__OTEL_USE_CDN === false) return false;
          const m = document.querySelector('meta[name="otel-cdn"]');
          const v = (m && m.getAttribute('content')) || '';
          if (v && v.toLowerCase() === 'off') return false;
        } catch {}
        return true;
      })();
      if (!useCdn) throw new Error('OTel CDN disabled');
      // Try to load the OTel API first; if it fails, keep using no-op
      let api;
      try {
        api = await import('https://unpkg.com/@opentelemetry/api@1.8.0/build/esm/index.js');
        trace = api.trace;
        SpanStatusCode = api.SpanStatusCode;
      } catch (e) {
        // CDN API load failed, continue with no-op tracer
      }
      const [
        { WebTracerProvider },
        traceBase,
        exporterMod,
        resourcesMod,
        semconvMod
      ] = await Promise.all([
        import('https://unpkg.com/@opentelemetry/sdk-trace-web@1.18.1/build/esm/index.js'),
        import('https://unpkg.com/@opentelemetry/sdk-trace-base@1.18.1/build/esm/index.js'),
        import('https://unpkg.com/@opentelemetry/exporter-trace-otlp-http@0.50.0/build/esm/index.js'),
        import('https://unpkg.com/@opentelemetry/resources@1.18.1/build/esm/index.js'),
        import('https://unpkg.com/@opentelemetry/semantic-conventions@1.18.1/build/esm/index.js')
      ]);
      const { BatchSpanProcessor } = traceBase;
      const { OTLPTraceExporter } = exporterMod;
      const { Resource } = resourcesMod;
      const { SemanticResourceAttributes } = semconvMod;

      const guessOtlp = () => {
        // Allow explicit global override
        if (window.__OTLP_ENDPOINT) return window.__OTLP_ENDPOINT;
        // Allow per-app meta override: <meta name="otlp-endpoint" content="https://collector:4318/v1/traces">
        try {
          const meta = document.querySelector('meta[name="otlp-endpoint"]');
          const v = meta && meta.getAttribute('content');
          if (v) return v;
        } catch {}
        // Prefer a same-origin proxy to avoid CORS issues with collectors
        try { return new URL('/otlp/v1/traces', window.location.origin).href; } catch {}
        // Fallback to common local collector endpoints
        const candidates = [
          'http://localhost:4318/v1/traces', // default OTLP/HTTP collector
          'http://localhost:19062/v1/traces', // Aspire (http)
          'https://localhost:21202/v1/traces' // Aspire (https)
        ];
        return candidates[0];
      };

      const endpoint = guessOtlp();
      const exporter = new OTLPTraceExporter({ url: endpoint });
      const provider = new WebTracerProvider({
        resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: 'Abies.Web' })
      });
      const bsp = new BatchSpanProcessor(exporter, {
        scheduledDelayMillis: 500,
        exportTimeoutMillis: 3000,
        maxQueueSize: 2048,
        maxExportBatchSize: 64
      });
      provider.addSpanProcessor(bsp);
      // Prefer Zone.js context manager for better async context propagation
      try {
        const { ZoneContextManager } = await import('https://unpkg.com/@opentelemetry/context-zone@1.18.1/build/esm/index.js');
        provider.register({ contextManager: new ZoneContextManager() });
      } catch {
        provider.register();
      }
      try {
        const { setGlobalTracerProvider } = api ?? await import('https://unpkg.com/@opentelemetry/api@1.8.0/build/esm/index.js');
        setGlobalTracerProvider(provider);
      } catch {}
      // Auto-instrument browser fetch to propagate trace context to the API and capture client spans
      try {
        const [core, fetchI, xhrI, docI, uiI] = await Promise.all([
          import('https://unpkg.com/@opentelemetry/instrumentation@0.50.0/build/esm/index.js'),
          import('https://unpkg.com/@opentelemetry/instrumentation-fetch@0.50.0/build/esm/index.js'),
          import('https://unpkg.com/@opentelemetry/instrumentation-xml-http-request@0.50.0/build/esm/index.js'),
          import('https://unpkg.com/@opentelemetry/instrumentation-document-load@0.50.0/build/esm/index.js'),
          import('https://unpkg.com/@opentelemetry/instrumentation-user-interaction@0.50.0/build/esm/index.js')
        ]);
        const { registerInstrumentations } = core;
        const { FetchInstrumentation } = fetchI;
        const { XMLHttpRequestInstrumentation } = xhrI;
        const { DocumentLoadInstrumentation } = docI;
        const { UserInteractionInstrumentation } = uiI;
        const ignore = [/\/otlp\/v1\/traces$/, /\/_framework\//];
        const propagate = [/.*/];
        registerInstrumentations({
          instrumentations: [
            new FetchInstrumentation({
              ignoreUrls: ignore,
              propagateTraceHeaderCorsUrls: propagate
            }),
            new XMLHttpRequestInstrumentation({
              ignoreUrls: ignore,
              propagateTraceHeaderCorsUrls: propagate
            }),
            new DocumentLoadInstrumentation(),
            new UserInteractionInstrumentation()
          ]
        });
      } catch {}
      // Refresh tracer reference now that a real provider is registered
      try { tracer = trace.getTracer('Abies.JS'); } catch {}
      // Expose OTel handle for forceFlush on page unload
      try {
        window.__otel = { 
          provider, 
          exporter, 
          endpoint: guessOtlp(),
          // Expose verbosity controls
          getVerbosity,
          setVerbosity: (level) => {
            if (level in VERBOSITY_LEVELS) {
              window.__OTEL_VERBOSITY = level;
            }
          }
        };
      } catch {}
    })();

    // Cap OTel init time so poor connectivity doesn't delay the app
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('OTel init timeout')), 10000));
    await Promise.race([otelInit, timeout]).catch(() => {});
  } catch (e) {
    // OTel initialization failed, continue with no-op tracer
  }
  // Fallback: if OTel could not initialize (e.g., CDN blocked), install a lightweight local shim
  try {
    if (!window.__otel) {
      (function initLocalOtelShim() {
        const hex = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n))).map(b => b.toString(16).padStart(2, '0')).join('');
        const nowNs = () => {
          const t = performance.timeOrigin + performance.now();
          return Math.round(t * 1e6).toString();
        };
        const endpoint = (function() {
          const meta = document.querySelector('meta[name="otlp-endpoint"]');
          if (meta && meta.content) return meta.content;
          if (window.__OTLP_ENDPOINT) return window.__OTLP_ENDPOINT;
          try { return new URL('/otlp/v1/traces', window.location.origin).href; } catch {}
          return 'http://localhost:4318/v1/traces';
        })();

        // Track the active span stack for proper parent-child relationships
        // currentSpan: the span that is currently active (for creating children)
        // activeTraceContext: persists trace context even after span ends (for fetch calls)
        const state = { currentSpan: null, activeTraceContext: null, pendingSpans: [] };
        
        function makeSpan(name, kind = 1, explicitParent = undefined) {
          // Use explicit parent if provided, otherwise use current span, otherwise use active trace context
          const parent = explicitParent !== undefined ? explicitParent : (state.currentSpan || state.activeTraceContext);
          const traceId = parent?.traceId || hex(16);
          const spanId = hex(8);
          return { traceId, spanId, parentSpanId: parent?.spanId, name, kind, start: nowNs(), end: null, attributes: {} };
        }
        
        // Batch and export spans in OTLP JSON format
        let exportTimer = null;
        async function flushSpans() {
          if (state.pendingSpans.length === 0) return;
          const spans = state.pendingSpans.splice(0, state.pendingSpans.length);
          
          // Build OTLP JSON payload
          const payload = {
            resourceSpans: [{
              resource: {
                attributes: [
                  { key: 'service.name', value: { stringValue: 'Abies.Web' } }
                ]
              },
              scopeSpans: [{
                scope: { name: 'Abies.JS.Shim', version: '1.0.0' },
                spans: spans.map(s => ({
                  traceId: s.traceId,
                  spanId: s.spanId,
                  parentSpanId: s.parentSpanId || '',
                  name: s.name,
                  kind: s.kind,
                  startTimeUnixNano: s.start,
                  endTimeUnixNano: s.end,
                  attributes: Object.entries(s.attributes).map(([k, v]) => ({
                    key: k,
                    value: typeof v === 'number' ? { intValue: v } : { stringValue: String(v) }
                  })),
                  status: { code: 1 } // OK
                }))
              }]
            }]
          };
          
          try {
            await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch (e) {
            // Silently ignore export errors
          }
        }
        
        function scheduleFlush() {
          if (exportTimer) return;
          exportTimer = setTimeout(() => {
            exportTimer = null;
            flushSpans();
          }, 500);
        }
        
        async function exportSpan(span) {
          state.pendingSpans.push(span);
          scheduleFlush();
        }
        
        // Minimal shim tracer used by existing code paths
        trace = {
          getTracer: () => ({
            startSpan: (name, options) => {
              const s = makeSpan(name);
              // Copy attributes from options if provided
              if (options && options.attributes) {
                Object.assign(s.attributes, options.attributes);
              }
              const prev = state.currentSpan;
              state.currentSpan = s;
              // Also set as active trace context so fetch calls can use it
              state.activeTraceContext = s;
              return {
                spanContext: () => ({ traceId: s.traceId, spanId: s.spanId }),
                setAttribute: (key, value) => { s.attributes[key] = value; },
                setStatus: () => {},
                recordException: () => {},
                end: async () => { 
                  s.end = nowNs(); 
                  state.currentSpan = prev;
                  // Keep activeTraceContext alive briefly for async operations (fetch)
                  // Clear it after a short delay to allow pending fetches to inherit context
                  setTimeout(() => {
                    if (state.activeTraceContext === s) {
                      state.activeTraceContext = prev;
                    }
                  }, 100);
                  await exportSpan(s); 
                }
              };
            }
          })
        };
        SpanStatusCode = { OK: 1, ERROR: 2 };
        tracer = trace.getTracer('Abies.JS');

        // Patch fetch to create client spans and propagate traceparent
        // This runs BEFORE any fetch call, so it can inherit the active trace context
        try {
          const origFetch = window.fetch.bind(window);
          window.fetch = async function(input, init) {
            const url = (typeof input === 'string') ? input : input.url;
            // Don't instrument OTLP export calls (would cause infinite loop)
            if (/\/otlp\/v1\/traces$/.test(url)) return origFetch(input, init);
            
            const method = (init && init.method) || (typeof input !== 'string' && input.method) || 'GET';
            
            // Create HTTP span as child of current span OR active trace context
            // This ensures fetch calls made after span.end() still link to the trace
            const parent = state.currentSpan || state.activeTraceContext;
            const sp = makeSpan(`HTTP ${method}`, 3 /* CLIENT */, parent);
            sp.attributes['http.method'] = method;
            sp.attributes['http.url'] = url;
            
            // Build W3C traceparent header to propagate to backend
            const traceparent = `00-${sp.traceId}-${sp.spanId}-01`;
            const i = init ? { ...init } : {};
            const h = new Headers((i && i.headers) || (typeof input !== 'string' && input.headers) || {});
            h.set('traceparent', traceparent);
            i.headers = h;
            
            try {
              const res = await origFetch(input, i);
              sp.attributes['http.status_code'] = res.status;
              sp.end = nowNs();
              await exportSpan(sp);
              return res;
            } catch (e) {
              sp.attributes['error'] = true;
              sp.end = nowNs();
              await exportSpan(sp);
              throw e;
            }
          };
        } catch {}

        // Expose OTel handle for forceFlush on page unload
        window.__otel = { 
          provider: { forceFlush: async () => { await flushSpans(); } }, 
          exporter: { url: endpoint }, 
          endpoint,
          // Expose verbosity controls
          getVerbosity,
          setVerbosity: (level) => {
            if (level in VERBOSITY_LEVELS) {
              window.__OTEL_VERBOSITY = level;
              // Clear cache to pick up new value
              cached = null;
            }
          }
        };
      })();
    }
  } catch (e) {
    // Shim initialization failed, continue with no-op tracer
  }
})();

let tracer = trace.getTracer('Abies.JS');

// Wrap a function with tracing, respecting verbosity settings
function withSpan(name, fn) {
    return async (...args) => {
        // Skip tracing if verbosity level doesn't include this span
        if (!shouldTrace(name)) {
            return await fn(...args);
        }
        const span = tracer.startSpan(name);
        try {
            const result = await fn(...args);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (err) {
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR });
            throw err;
        } finally {
            span.end();
        }
    };
}

const { setModuleImports, getAssemblyExports, getConfig, runMain } = await dotnet
    .withDiagnosticTracing(false)
    .create();

const registeredEvents = new Set();

function ensureEventListener(eventName) {
    if (registeredEvents.has(eventName)) return;
    // Attach to document to survive body innerHTML changes and use capture for early handling
    const opts = (eventName === 'click') ? { capture: true } : undefined;
    document.addEventListener(eventName, genericEventHandler, opts);
    registeredEvents.add(eventName);
}

// Helper to find an element with a specific attribute, traversing through shadow DOM boundaries
function findEventTarget(event, attributeName) {
    // First try the composed path to handle shadow DOM (for Web Components like fluent-button)
    const path = event.composedPath ? event.composedPath() : [];
    for (const el of path) {
        if (el.nodeType === 1 /* ELEMENT_NODE */ && el.hasAttribute && el.hasAttribute(attributeName)) {
            return el;
        }
    }
    // Fallback to closest() for non-shadow DOM cases
    let origin = event.target;
    if (origin && origin.nodeType === 3 /* TEXT_NODE */) {
        origin = origin.parentElement;
    }
    return origin && origin.closest ? origin.closest(`[${attributeName}]`) : null;
}

function genericEventHandler(event) {
    const name = event.type;
    const attributeName = `data-event-${name}`;
    const target = findEventTarget(event, attributeName);
    if (!target) return;
    // Ignore events coming from nodes that have been detached/replaced
    if (!target.isConnected) return;
    // For Abies-managed clicks, prevent native navigation immediately
    if (name === 'click') {
        try {
            event.preventDefault();
            if (typeof event.stopPropagation === 'function') event.stopPropagation();
            if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        } catch { /* ignore */ }
    }
    const message = target.getAttribute(attributeName);
    if (!message) {
        console.error(`No message id found in data-event-${name} attribute.`);
        return;
    }
    // Prevent default only for Abies-managed Enter keydown events (scoped)
    if (name === 'keydown' && event && event.key === 'Enter') {
        try { event.preventDefault(); } catch { /* ignore */ }
    }
    
    // Build rich UI context for tracing
    const tag = (target.tagName || '').toLowerCase();
    const text = (target.textContent || '').trim().substring(0, 50); // Truncate long text
    const classes = target.className || '';
    const ariaLabel = target.getAttribute('aria-label') || '';
    const elId = target.id || '';
    
    // Build human-readable action description
    let action = '';
    if (name === 'click') {
        if (tag === 'button' || tag === 'a' || tag === 'fluent-button') {
            action = `Click ${tag === 'a' ? 'Link' : 'Button'}: ${text || ariaLabel || elId || '(unnamed)'}`;
        } else if (tag === 'input') {
            const inputType = target.getAttribute('type') || 'text';
            action = `Click Input (${inputType})`;
        } else {
            action = `Click ${tag}: ${text || elId || '(element)'}`;
        }
    } else if (name === 'input' || name === 'change') {
        action = `Input: ${tag}${elId ? '#' + elId : ''}`;
    } else if (name === 'submit') {
        action = `Submit Form: ${elId || '(form)'}`;
    } else if (name === 'keydown' || name === 'keyup') {
        action = `Key ${name === 'keydown' ? 'Down' : 'Up'}: ${event.key || ''}`;
    } else {
        action = `${name}: ${tag}${elId ? '#' + elId : ''}`;
    }
    
    const spanOptions = {
        attributes: {
            'ui.event.type': name,
            'ui.element.tag': tag,
            'ui.element.id': elId,
            'ui.element.text': text,
            'ui.element.classes': classes,
            'ui.element.aria_label': ariaLabel,
            'ui.action': action,
            'abies.message_id': message
        }
    };
    
    // Use startActiveSpan if available (CDN mode) to properly set context for nested spans
    // This ensures FetchInstrumentation creates child spans under this UI Event
    if (typeof tracer.startActiveSpan === 'function') {
        tracer.startActiveSpan('UI Event', spanOptions, (span) => {
            try {
                const data = buildEventData(event, target);
                exports.Abies.Runtime.DispatchData(message, JSON.stringify(data));
                span.setStatus({ code: SpanStatusCode.OK });
            } catch (err) {
                span.recordException(err);
                span.setStatus({ code: SpanStatusCode.ERROR });
                console.error(err);
            } finally {
                // Delay ending the span slightly to allow async fetch calls to start within this context
                // The FetchInstrumentation will capture the parent span at fetch() call time
                setTimeout(() => span.end(), 50);
            }
        });
    } else {
        // Shim mode - use startSpan (shim handles context tracking internally)
        const span = tracer.startSpan('UI Event', spanOptions);
        try {
            const data = buildEventData(event, target);
            exports.Abies.Runtime.DispatchData(message, JSON.stringify(data));
            span.setStatus({ code: SpanStatusCode.OK });
        } catch (err) {
            span.recordException(err);
            span.setStatus({ code: SpanStatusCode.ERROR });
            console.error(err);
        } finally {
            // Shim uses activeTraceContext which persists briefly after span.end()
            span.end();
        }
    }
}

function buildEventData(event, target) {
    const data = {};
    if (target && 'value' in target) data.value = target.value;
    if (target && 'checked' in target) data.checked = target.checked;
    if ('key' in event) {
        data.key = event.key;
        data.repeat = event.repeat === true;
        data.altKey = event.altKey;
        data.ctrlKey = event.ctrlKey;
        data.shiftKey = event.shiftKey;
    }
    if ('clientX' in event) {
        data.clientX = event.clientX;
        data.clientY = event.clientY;
        data.button = event.button;
    }
    return data;
}

const subscriptionRegistry = new Map();

function dispatchSubscription(key, data) {
    try {
        exports.Abies.Runtime.DispatchSubscriptionData(key, JSON.stringify(data));
    } catch (err) {
        console.error(err);
    }
}

function buildVisibilityState() {
    return document.visibilityState === 'visible' ? 'Visible' : 'Hidden';
}

function encodeBase64(bytes) {
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

async function toMessagePayload(data) {
    if (typeof data === 'string') {
        return { messageKind: 'text', data };
    }

    try {
        const buffer = data instanceof Blob ? await data.arrayBuffer() : data;
        const bytes = new Uint8Array(buffer);
        return { messageKind: 'binary', data: encodeBase64(bytes) };
    } catch {
        return { messageKind: 'text', data: '' };
    }
}

function subscribe(key, kind, data) {
    if (subscriptionRegistry.has(key)) return;

    let dispose;
    switch (kind) {
        case 'animationFrame': {
            let active = true;
            const loop = (timestamp) => {
                if (!active) return;
                dispatchSubscription(key, { timestamp });
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
            dispose = () => { active = false; };
            break;
        }
        case 'animationFrameDelta': {
            let active = true;
            let last = null;
            const loop = (timestamp) => {
                if (!active) return;
                const delta = last === null ? 0 : timestamp - last;
                last = timestamp;
                dispatchSubscription(key, { timestamp, delta });
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
            dispose = () => { active = false; };
            break;
        }
        case 'resize': {
            const handler = () => dispatchSubscription(key, {
                width: window.innerWidth,
                height: window.innerHeight
            });
            window.addEventListener('resize', handler);
            dispose = () => window.removeEventListener('resize', handler);
            break;
        }
        case 'visibilityChange': {
            const handler = () => dispatchSubscription(key, { state: buildVisibilityState() });
            document.addEventListener('visibilitychange', handler);
            dispose = () => document.removeEventListener('visibilitychange', handler);
            break;
        }
        case 'keyDown': {
            const pressed = new Set();
            const down = (event) => {
                if (event && event.repeat) return;
                const k = event?.key ?? '';
                if (pressed.has(k)) return;
                pressed.add(k);
                dispatchSubscription(key, buildEventData(event, event.target));
            };
            const up = (event) => {
                const k = event?.key ?? '';
                pressed.delete(k);
            };
            window.addEventListener('keydown', down);
            window.addEventListener('keyup', up);
            dispose = () => {
                window.removeEventListener('keydown', down);
                window.removeEventListener('keyup', up);
            };
            break;
        }
        case 'keyUp': {
            const handler = (event) => dispatchSubscription(key, buildEventData(event, event.target));
            window.addEventListener('keyup', handler);
            dispose = () => window.removeEventListener('keyup', handler);
            break;
        }
        case 'mouseDown': {
            const handler = (event) => dispatchSubscription(key, buildEventData(event, event.target));
            window.addEventListener('mousedown', handler);
            dispose = () => window.removeEventListener('mousedown', handler);
            break;
        }
        case 'mouseUp': {
            const handler = (event) => dispatchSubscription(key, buildEventData(event, event.target));
            window.addEventListener('mouseup', handler);
            dispose = () => window.removeEventListener('mouseup', handler);
            break;
        }
        case 'mouseMove': {
            // Throttle mouse move to once per animation frame (~60fps max) to prevent flooding
            let pending = null;
            let rafId = null;
            const handler = (event) => {
                pending = buildEventData(event, event.target);
                if (rafId === null) {
                    rafId = requestAnimationFrame(() => {
                        if (pending) {
                            dispatchSubscription(key, pending);
                            pending = null;
                        }
                        rafId = null;
                    });
                }
            };
            window.addEventListener('mousemove', handler);
            dispose = () => {
                window.removeEventListener('mousemove', handler);
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                }
            };
            break;
        }
        case 'click': {
            const handler = (event) => dispatchSubscription(key, buildEventData(event, event.target));
            window.addEventListener('click', handler);
            dispose = () => window.removeEventListener('click', handler);
            break;
        }
        case 'websocket': {
            const options = data ? JSON.parse(data) : null;
            if (!options || !options.url) {
                throw new Error('WebSocket subscription requires a url.');
            }

            const ws = Array.isArray(options.protocols) && options.protocols.length > 0
                ? new WebSocket(options.url, options.protocols)
                : new WebSocket(options.url);

            const openHandler = () => dispatchSubscription(key, { type: 'open' });
            const closeHandler = (event) => dispatchSubscription(key, {
                type: 'close',
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean
            });
            const errorHandler = () => dispatchSubscription(key, { type: 'error' });
            const messageHandler = async (event) => {
                const payload = await toMessagePayload(event.data);
                dispatchSubscription(key, {
                    type: 'message',
                    messageKind: payload.messageKind,
                    data: payload.data
                });
            };

            ws.addEventListener('open', openHandler);
            ws.addEventListener('close', closeHandler);
            ws.addEventListener('error', errorHandler);
            ws.addEventListener('message', messageHandler);

            dispose = () => {
                try {
                    ws.removeEventListener('open', openHandler);
                    ws.removeEventListener('close', closeHandler);
                    ws.removeEventListener('error', errorHandler);
                    ws.removeEventListener('message', messageHandler);
                    ws.close(1000, 'subscription disposed');
                } catch { }
            };
            break;
        }
        default:
            throw new Error(`Unknown subscription kind: ${kind}`);
    }

    subscriptionRegistry.set(key, dispose);
}

function unsubscribe(key) {
    const dispose = subscriptionRegistry.get(key);
    if (!dispose) return;
    try {
        dispose();
    } finally {
        subscriptionRegistry.delete(key);
    }
}

/**
 * Adds event listeners to the document body for interactive elements.
 */
function addEventListeners(root) {
    const scope = root || document;
    // Build a list including the scope element (if Element) plus all descendants
    const nodes = [];
    if (scope && scope.nodeType === 1 /* ELEMENT_NODE */) nodes.push(scope);
    scope.querySelectorAll('*').forEach(el => {
        nodes.push(el);
    });
    nodes.forEach(el => {
        for (const attr of el.attributes) {
            if (attr.name.startsWith('data-event-')) {
                const name = attr.name.substring('data-event-'.length);
                ensureEventListener(name);
            }
        }
    });
}

/**
 * Event handler for click events on elements with data-event-* attributes.
 * @param {Event} event - The DOM event.
 */

/**
 * Parses an HTML string fragment into a DOM element, using the appropriate
 * container element to ensure browser parsing succeeds. Browsers strip
 * table-related elements (tr, td, etc.) when placed inside invalid containers.
 * @param {string} html - The HTML string to parse.
 * @returns {Element} The first element child from the parsed HTML.
 */
function parseHtmlFragment(html) {
    const trimmedHtml = html.trimStart();
    let tempContainer;
    if (trimmedHtml.startsWith('<tr')) {
        tempContainer = document.createElement('tbody');
    } else if (trimmedHtml.startsWith('<td') || trimmedHtml.startsWith('<th')) {
        tempContainer = document.createElement('tr');
    } else if (trimmedHtml.startsWith('<thead') || trimmedHtml.startsWith('<tbody') || trimmedHtml.startsWith('<tfoot') || trimmedHtml.startsWith('<colgroup') || trimmedHtml.startsWith('<caption')) {
        tempContainer = document.createElement('table');
    } else if (trimmedHtml.startsWith('<col')) {
        tempContainer = document.createElement('colgroup');
    } else if (trimmedHtml.startsWith('<option') || trimmedHtml.startsWith('<optgroup')) {
        tempContainer = document.createElement('select');
    } else {
        tempContainer = document.createElement('div');
    }
    tempContainer.innerHTML = html;
    return tempContainer.firstElementChild;
}

setModuleImports('abies.js', {

    /**
     * Adds a child element to a parent element in the DOM using HTML content.
     * @param {number} parentId - The ID of the parent element.
     * @param {string} childHtml - The HTML string of the child element to add.
     */
    addChildHtml: withSpan('addChildHtml', async (parentId, childHtml) => {
        const parent = document.getElementById(parentId);
        if (parent) {
            const childElement = parseHtmlFragment(childHtml);
            parent.appendChild(childElement);
            // Reattach event listeners to new elements within this subtree
            addEventListeners(childElement);
        } else {
            console.error(`Parent element with ID ${parentId} not found.`);
        }
    }),


    /**
     * Sets the title of the document.
     * @param {string} title - The new title of the document.
     */
    setTitle: withSpan('setTitle', async (title) => {
        document.title = title;
    }),
    
    /**
     * Removes a child element from the DOM.
     * @param {number} parentId - The ID of the parent element.
     * @param {number} childId - The ID of the child element to remove.
     */
    removeChild: withSpan('removeChild', async (parentId, childId) =>  {
        const parent = document.getElementById(parentId);
        const child = document.getElementById(childId);
        if (parent && child && parent.contains(child)) {
            parent.removeChild(child);
        } else {
            console.error(`Cannot remove child with ID ${childId} from parent with ID ${parentId}.`);
        }
    }),

    /**
     * Replaces an existing node with new HTML content.
     * @param {number} oldNodeId - The ID of the node to replace.
     * @param {string} newHtml - The HTML string to replace with.
     */
    replaceChildHtml: withSpan('replaceChildHtml', async (oldNodeId, newHtml) => {
        const oldNode = document.getElementById(oldNodeId);
        if (oldNode && oldNode.parentNode) {
            const newElement = parseHtmlFragment(newHtml);
            try {
                oldNode.parentNode.replaceChild(newElement, oldNode);
                // Reattach event listeners to new elements within this subtree
                addEventListeners(newElement);
            } catch (err) {
                console.error(`Node with ID ${oldNodeId} not found or has no parent.`, err);
            }
        } else {
            console.error(`Node with ID ${oldNodeId} not found or has no parent.`);
        }
    }),

    /**
     * Updates the text content of a DOM element.
     * @param {number} nodeId - The ID of the node to update.
     * @param {string} newText - The new text content.
     */
    updateTextContent: withSpan('updateTextContent', async (nodeId, newText) => {
        const node = document.getElementById(nodeId);
        if (node) {
            // Keep text nodes and form control values in sync
            node.textContent = newText;
            // If this is a textarea, also update its value property
            const tag = (node.tagName || '').toUpperCase();
            if (tag === 'TEXTAREA') {
                try { node.value = newText; } catch { /* ignore */ }
            }
        } else {
            console.error(`Node with ID ${nodeId} not found.`);
        }
    }),

    /**
     * Updates or adds an attribute of a DOM element.
     * @param {number} nodeId - The ID of the node to update.
     * @param {string} propertyName - The name of the attribute/property.
     * @param {string} propertyValue - The new value for the attribute/property.
     */
    updateAttribute: withSpan('updateAttribute', async (nodeId, propertyName, propertyValue) => {
        const node = document.getElementById(nodeId);
        if (!node) {
            console.error(`Node with ID ${nodeId} not found.`);
            return;
        }
        const lower = propertyName.toLowerCase();
        const isBooleanAttr = (
            lower === 'disabled' || lower === 'checked' || lower === 'selected' || lower === 'readonly' ||
            lower === 'multiple' || lower === 'required' || lower === 'autofocus' || lower === 'inert' ||
            lower === 'hidden' || lower === 'open' || lower === 'loop' || lower === 'muted' || lower === 'controls'
        );
        if (lower === 'value' && ('value' in node)) {
            // Keep the live value in sync for inputs/textareas
            node.value = propertyValue;
            node.setAttribute(propertyName, propertyValue);
        } else if (isBooleanAttr) {
            // Boolean attributes: presence => true
            node.setAttribute(propertyName, '');
            try { if (lower in node) node[lower] = true; } catch { /* ignore */ }
        } else {
            node.setAttribute(propertyName, propertyValue);
        }
        if (propertyName.startsWith('data-event-')) {
            const name = propertyName.substring('data-event-'.length);
            ensureEventListener(name);
        }
    }),

    addAttribute: withSpan('addAttribute', async (nodeId, propertyName, propertyValue) => {
        const node = document.getElementById(nodeId);
        if (!node) {
            console.error(`Node with ID ${nodeId} not found.`);
            return;
        }
        const lower = propertyName.toLowerCase();
        const isBooleanAttr = (
            lower === 'disabled' || lower === 'checked' || lower === 'selected' || lower === 'readonly' ||
            lower === 'multiple' || lower === 'required' || lower === 'autofocus' || lower === 'inert' ||
            lower === 'hidden' || lower === 'open' || lower === 'loop' || lower === 'muted' || lower === 'controls'
        );
        if (lower === 'value' && ('value' in node)) {
            node.value = propertyValue;
            node.setAttribute(propertyName, propertyValue);
        } else if (isBooleanAttr) {
            node.setAttribute(propertyName, '');
            try { if (lower in node) node[lower] = true; } catch { /* ignore */ }
        } else {
            node.setAttribute(propertyName, propertyValue);
        }
        if (propertyName.startsWith('data-event-')) {
            const name = propertyName.substring('data-event-'.length);
            ensureEventListener(name);
        }
    }),

    /**
     * Removes an attribute/property from a DOM element.
     * @param {number} nodeId - The ID of the node to update.
     * @param {string} propertyName - The name of the attribute/property to remove.
     */
    removeAttribute: withSpan('removeAttribute', async (nodeId, propertyName) =>{
        const node = document.getElementById(nodeId);
        if (node) {
            const lower = propertyName.toLowerCase();
            const isBooleanAttr = (
                lower === 'disabled' || lower === 'checked' || lower === 'selected' || lower === 'readonly' ||
                lower === 'multiple' || lower === 'required' || lower === 'autofocus' || lower === 'inert' ||
                lower === 'hidden' || lower === 'open' || lower === 'loop' || lower === 'muted' || lower === 'controls'
            );
            node.removeAttribute(propertyName);
            if (isBooleanAttr) {
                try { if (lower in node) node[lower] = false; } catch { /* ignore */ }
            }
        } else {
            console.error(`Node with ID ${nodeId} not found.`);
        }
    }),

    setLocalStorage: withSpan('setLocalStorage', async (key, value) => {
        localStorage.setItem(key, value);
    }),

    getLocalStorage: withSpan('getLocalStorage', (key) => {
        return localStorage.getItem(key);
    }),

    removeLocalStorage: withSpan('removeLocalStorage', async (key) => {
        localStorage.removeItem(key);
    }),

    getValue: withSpan('getValue', (id) => {
        const el = document.getElementById(id);
        return el ? el.value : null;
    }),

    /**
     * Sets the inner HTML of the 'app' div.
     * @param {string} html - The HTML content to set.
     */
    setAppContent: withSpan('setAppContent', async (html) => {
        document.body.innerHTML = html;
    // Keep runtime generic: no app-specific hooks here
        addEventListeners(); // Ensure event listeners are attached
        // Signal that the app is ready for interaction
        window.abiesReady = true;
    }),

    // Expose functions to .NET via JS interop (if needed)
    getCurrentUrl: () => {
        return window.location.href;
    },

    pushState: withSpan('pushState', async (url) => {
        history.pushState(null, "", url);
    }),

    replaceState: withSpan('replaceState', async (url) => {
        history.replaceState(null, "", url);
    }),

    back: withSpan('back', async (x) => {
        history.go(-x);
    }),

    forward: withSpan('forward', async (x) => {
        history.go(x);
    }),

    go: withSpan('go', async (x) => {
        history.go(x);
    }),

    load: withSpan('load', async (url) => {
        window.location.reload(url);
    }),

    reload: withSpan('reload', async () => {
        window.location.reload();
    }),

    onUrlChange: (callback) => {
    window.addEventListener("popstate", () => callback(window.location.href));
    },

    onFormSubmit: (callback) => {
        document.addEventListener("submit", (event) => {
            event.preventDefault();
            const form = event.target;
            callback(form.action);
        });
    },

    onLinkClick: (callback) => {
    document.addEventListener("click", (event) => {
            const link = event.target.closest("a");
            if (!link) return;
            // Skip if this anchor has Abies handlers; genericEventHandler will dispatch
            const hasAbiesHandler = Array.from(link.attributes).some(a => a.name.startsWith('data-event-'));
            if (hasAbiesHandler) return;
            // Skip anchors with empty or hash hrefs which are used as UI controls
            const rawHref = link.getAttribute('href') || '';
            if (rawHref === '' || rawHref === '#') return;
            event.preventDefault();
            callback(link.href);
        });
    // Do not globally prevent Enter here; Abies-managed keydown handles scoped prevention
    },

    subscribe: (key, kind, data) => {
        subscribe(key, kind, data);
    },

    unsubscribe: (key) => {
        unsubscribe(key);
    }
});
    
const config = getConfig();
const exports = await getAssemblyExports("Abies");

await runMain(); // Ensure the .NET runtime is initialized

// Make sure any existing data-event-* attributes in the initial DOM are discovered
try { addEventListeners(); } catch (err) { /* ignore */ }
