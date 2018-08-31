/**
 * Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var i, arg, page, urlCount, viewport, webpage = require("webpage"),
    args = require('system').args,
    len = args.length,
    urls = [],
    yslowArgs = { info: "all", format: "json", ruleset: "ydefault", beacon: false, ua: false, viewport: false, headers: false, console: 0, threshold: 80, cdns: "" },
    unaryArgs = { help: false, version: false, dict: false, verbose: false },
    argsAlias = { i: "info", f: "format", r: "ruleset", h: "help", V: "version", d: "dict", u: "ua", vp: "viewport", c: "console", b: "beacon", v: "verbose", t: "threshold", ch: "headers" };
for (i = 0; i < len; i += 1) { arg = args[i];
    if (arg[0] !== "-") {
        if (arg.indexOf("http") !== 0) { arg = "http://" + arg }
        urls.push(arg) }
    arg = arg.replace(/^\-\-?/, "");
    if (yslowArgs.hasOwnProperty(arg)) { i += 1;
        yslowArgs[arg] = args[i] } else {
        if (yslowArgs.hasOwnProperty(argsAlias[arg])) { i += 1;
            yslowArgs[argsAlias[arg]] = args[i] } else {
            if (unaryArgs.hasOwnProperty(arg)) { unaryArgs[arg] = true } else {
                if (unaryArgs.hasOwnProperty(argsAlias[arg])) { unaryArgs[argsAlias[arg]] = true } } } } }
urlCount = urls.length;
if (unaryArgs.version) { console.log("3.1.8");
    phantom.exit() }
if (len === 0 || urlCount === 0 || unaryArgs.help) { console.log(["", "  Usage: phantomjs [phantomjs options] " + phantom.scriptName + " [yslow options] [url ...]", "", "  PhantomJS Options:", "", "    http://y.ahoo.it/phantomjs/options", "", "  YSlow Options:", "", "    -h, --help               output usage information", "    -V, --version            output the version number", "    -i, --info <info>        specify the information to display/log (basic|grade|stats|comps|all) [all]", "    -f, --format <format>    specify the output results format (json|xml|plain|tap|junit) [json]", "    -r, --ruleset <ruleset>  specify the YSlow performance ruleset to be used (ydefault|yslow1|yblog) [ydefault]", "    -b, --beacon <url>       specify an URL to log the results", "    -d, --dict               include dictionary of results fields", "    -v, --verbose            output beacon response information", "    -t, --threshold <score>  for test formats, the threshold to test scores ([0-100]|[A-F]|{JSON}) [80]", '                             e.g.: -t B or -t 75 or -t \'{"overall": "B", "ycdn": "F", "yexpires": 85}\'', '    -u, --ua "<user agent>"  specify the user agent string sent to server when the page requests resources', "    -vp, --viewport <WxH>    specify page viewport size WxY, where W = width and H = height [400x300]", '    -ch, --headers <JSON>    specify custom request headers, e.g.: -ch \'{"Cookie": "foo=bar"}\'', "    -c, --console <level>    output page console messages (0: none, 1: message, 2: message + line + source) [0]", '    --cdns "<list>"          specify comma separated list of additional CDNs', "", "  Examples:", "", "    phantomjs " + phantom.scriptName + " http://yslow.org", "    phantomjs " + phantom.scriptName + " -i grade -f xml www.yahoo.com www.cnn.com www.nytimes.com", "    phantomjs " + phantom.scriptName + ' --info all --format plain --ua "MSIE 9.0" http://yslow.org', "    phantomjs " + phantom.scriptName + " -i basic --rulseset yslow1 -d http://yslow.org", "    phantomjs " + phantom.scriptName + " -i grade -b http://www.showslow.com/beacon/yslow/ -v yslow.org", "    phantomjs --load-plugins=yes " + phantom.scriptName + " -vp 800x600 http://www.yahoo.com", "    phantomjs " + phantom.scriptName + " -i grade -f tap -t 85 http://yslow.org", ""].join("\n"));
    phantom.exit() }
yslowArgs.dict = unaryArgs.dict;
yslowArgs.verbose = unaryArgs.verbose;
urls.forEach(function(a) {
    var c = webpage.create();
    c.resources = {};
    c.settings.webSecurityEnabled = false;
    c.onResourceRequested = function(d) { c.resources[d.url] = { request: d } };
    c.onResourceReceived = function(d) {
        var e, f = c.resources[d.url].response;
        if (!f) { c.resources[d.url].response = d } else {
            for (e in d) {
                if (d.hasOwnProperty(e)) { f[e] = d[e] } } } };
    yslowArgs.console = parseInt(yslowArgs.console, 10) || 0;
    if (yslowArgs.console) {
        if (yslowArgs.console === 1) { c.onConsoleMessage = function(d) { console.log(d) };
            c.onError = function(d) { console.error(d) } } else { c.onConsoleMessage = function(f, d, e) { console.log(JSON.stringify({ message: f, lineNumber: d, source: e }, null, 4)) };
            c.onError = function(e, d) { console.error(JSON.stringify({ message: e, stacktrace: d })) } } } else { c.onError = function() {} }
    if (yslowArgs.ua) { c.settings.userAgent = yslowArgs.ua }
    if (yslowArgs.viewport) { viewport = yslowArgs.viewport.toLowerCase();
        c.viewportSize = { width: parseInt(viewport.slice(0, viewport.indexOf("x")), 10) || c.viewportSize.width, height: parseInt(viewport.slice(viewport.indexOf("x") + 1), 10) || c.viewportSize.height } }
    if (yslowArgs.headers) {
        try { c.customHeaders = JSON.parse(yslowArgs.headers) } catch (b) { console.log("Invalid custom headers: " + b) } }
    c.startTime = new Date();
    c.open(a, function(m) {
        console.log(a);
        var g, l, o, p, n, d, k, j, f = 0,
            e = c.startTime,
            h = c.resources;
        if (m !== "success") { console.log("FAIL to load " + d) } else { n = new Date() - e;
            for (d in h) {
                if (h.hasOwnProperty(d)) { k = h[d].response;
                    if (k) { k.time = new Date(k.time) - e } } }
            g = function() {
                if (typeof YSLOW === "undefined") { YSLOW = {} }
                YSLOW.DEBUG = true;
                YSLOW.registerRule = function(q) { YSLOW.controller.addRule(q) };
                YSLOW.registerRuleset = function(q) { YSLOW.controller.addRuleset(q) };
                YSLOW.registerRenderer = function(q) { YSLOW.controller.addRenderer(q) };
                YSLOW.registerTool = function(q) { YSLOW.Tools.addCustomTool(q) };
                YSLOW.addEventListener = function(r, s, q) { YSLOW.util.event.addListener(r, s, q) };
                YSLOW.removeEventListener = function(q, r) {
                    return YSLOW.util.event.removeListener(q, r) };
                YSLOW.Error = function(q, r) { this.name = q;
                    this.message = r };
                YSLOW.Error.prototype = { toString: function() {
                        return this.name + "\n" + this.message } };
                YSLOW.version = "3.1.8";
                YSLOW.ComponentSet = function(q, r) { this.root_node = q;
                    this.components = [];
                    this.outstanding_net_request = 0;
                    this.component_info = [];
                    this.onloadTimestamp = r;
                    this.nextID = 1;
                    this.notified_fetch_done = false };
                YSLOW.ComponentSet.prototype = { clear: function() { this.components = [];
                        this.component_info = [];
                        this.cleared = true;
                        if (this.outstanding_net_request > 0) { YSLOW.util.dump("YSLOW.ComponentSet.Clearing component set before all net requests finish.") } }, addComponent: function(t, u, r, w) {
                        var q, v, s;
                        if (!t) {
                            if (!this.empty_url) { this.empty_url = [] }
                            this.empty_url[u] = (this.empty_url[u] || 0) + 1 }
                        if (t && u) {
                            if (!YSLOW.ComponentSet.isValidProtocol(t) || !YSLOW.ComponentSet.isValidURL(t)) {
                                return q }
                            t = YSLOW.util.makeAbsoluteUrl(t, r);
                            t = YSLOW.util.escapeHtml(t);
                            v = typeof this.component_info[t] !== "undefined";
                            s = u === "doc";
                            if (!v || s) { this.component_info[t] = { state: "NONE", count: v ? this.component_info[t].count : 0 };
                                q = new YSLOW.Component(t, u, this, w);
                                if (q) { q.id = this.nextID += 1;
                                    this.components[this.components.length] = q;
                                    if (!this.doc_comp && s) { this.doc_comp = q }
                                    if (this.component_info[t].state === "NONE") { this.component_info[t].state = "REQUESTED";
                                        this.outstanding_net_request += 1 } } else { this.component_info[t].state = "ERROR";
                                    YSLOW.util.event.fire("componentFetchError") } }
                            this.component_info[t].count += 1 }
                        return q }, addComponentNoDuplicate: function(r, s, q) {
                        if (r && s) { r = YSLOW.util.escapeHtml(r);
                            r = YSLOW.util.makeAbsoluteUrl(r, q);
                            if (this.component_info[r] === undefined) {
                                return this.addComponent(r, s, q) } } }, getComponentsByType: function(D, A, u) {
                        var w, v, B, s, E, y, r, x = this.components,
                            C = this.component_info,
                            q = [],
                            z = {};
                        if (typeof A === "undefined") { A = !(YSLOW.util.Preference.getPref("excludeAfterOnload", true)) }
                        if (typeof u === "undefined") { u = !(YSLOW.util.Preference.getPref("excludeBeaconsFromLint", true)) }
                        if (typeof D === "string") { z[D] = 1 } else {
                            for (w = 0, B = D.length; w < B; w += 1) { E = D[w];
                                if (E) { z[E] = 1 } } }
                        for (w = 0, B = x.length; w < B; w += 1) { y = x[w];
                            if (!y || (y && !z[y.type]) || (y.is_beacon && !u) || (y.after_onload && !A)) {
                                continue }
                            q[q.length] = y;
                            r = C[w];
                            if (!r || (r && r.count <= 1)) {
                                continue }
                            for (v = 1, s = r.count; v < s; v += 1) { q[q.length] = y } }
                        return q }, getProgress: function() {
                        var q, r = 0,
                            s = 0;
                        for (q in this.component_info) {
                            if (this.component_info.hasOwnProperty(q) && this.component_info[q]) {
                                if (this.component_info[q].state === "RECEIVED") { s += 1 }
                                r += 1 } }
                        return { total: r, received: s } }, onComponentGetInfoStateChange: function(t) {
                        var q, s, r;
                        if (t) {
                            if (typeof t.comp !== "undefined") { q = t.comp }
                            if (typeof t.state !== "undefined") { s = t.state } }
                        if (typeof this.component_info[q.url] === "undefined") { YSLOW.util.dump("YSLOW.ComponentSet.onComponentGetInfoStateChange(): Unexpected component: " + q.url);
                            return }
                        if (this.component_info[q.url].state === "NONE" && s === "DONE") { this.component_info[q.url].state = "RECEIVED" } else {
                            if (this.component_info[q.url].state === "REQUESTED" && s === "DONE") { this.component_info[q.url].state = "RECEIVED";
                                this.outstanding_net_request -= 1;
                                if (this.outstanding_net_request === 0) { this.notified_fetch_done = true;
                                    YSLOW.util.event.fire("componentFetchDone", { component_set: this }) } } else { YSLOW.util.dump("Unexpected component info state: [" + q.type + "]" + q.url + "state: " + s + " comp_info_state: " + this.component_info[q.url].state) } }
                        r = this.getProgress();
                        YSLOW.util.event.fire("componentFetchProgress", { total: r.total, current: r.received, last_component_url: q.url }) }, notifyPeelDone: function() {
                        if (this.outstanding_net_request === 0 && !this.notified_fetch_done) { this.notified_fetch_done = true;
                            YSLOW.util.event.fire("componentFetchDone", { component_set: this }) } }, setSimpleAfterOnload: function(v, A) {
                        var D, C, G, r, w, x, s, u, q, t, E, F, z, H, B, y;
                        if (A) { z = A.docBody;
                            H = A.doc;
                            B = A.components;
                            y = A.components } else { z = this.doc_comp && this.doc_comp.body;
                            H = this.root_node;
                            B = this.components;
                            y = this }
                        if (!z) { YSLOW.util.dump("doc body is empty");
                            return v(y) }
                        r = H.createElement("div");
                        r.innerHTML = z;
                        w = r.getElementsByTagName("*");
                        for (D = 0, E = B.length; D < E; D += 1) { G = B[D];
                            t = G.type;
                            if (t === "cssimage" || t === "doc") {
                                continue }
                            s = false;
                            u = G.url;
                            for (C = 0, F = w.length; !s && C < F; C += 1) { q = w[C];
                                x = q.src || q.href || q.getAttribute("src") || q.getAttribute("href") || (q.nodeName === "PARAM" && q.value);
                                s = (x === u) }
                            G.after_onload = !s }
                        v(y) }, setAfterOnload: function(s, y) {
                        var A, F, I, x, C, q, u, v, N, z, L, t, w, r = YSLOW.util,
                            D = r.addEventListener,
                            E = r.removeEventListener,
                            K = setTimeout,
                            H = clearTimeout,
                            B = [],
                            M = {},
                            J = function(S) {
                                var Q, O, R, T, P;
                                H(x);
                                Q = S.type;
                                O = S.attrName;
                                R = S.target;
                                T = R.src || R.href || (R.getAttribute && (R.getAttribute("src") || R.getAttribute("href")));
                                P = R.dataOldSrc;
                                if (T && (Q === "DOMNodeInserted" || (Q === "DOMSubtreeModified" && T !== P) || (Q === "DOMAttrModified" && (O === "src" || O === "href"))) && !M[T]) { M[T] = 1;
                                    B.push(R) }
                                x = K(C, 1000) },
                            G = function() {
                                var P, O, R, Q, S;
                                H(q);
                                R = F.getElementsByTagName("*");
                                for (P = 0, O = R.length; P < O; P += 1) { Q = R[P];
                                    S = Q.src || Q.href;
                                    if (S) { Q.dataOldSrc = S } }
                                D(I, "DOMSubtreeModified", J);
                                D(I, "DOMNodeInserted", J);
                                D(I, "DOMAttrModified", J);
                                x = K(C, 3000);
                                t = K(C, 10000) };
                        if (y) { u = YSLOW.ComponentSet.prototype;
                            v = y.docBody;
                            N = y.doc;
                            z = y.components;
                            L = z } else { u = this;
                            v = u.doc_comp && u.doc_comp.body;
                            N = u.root_node;
                            z = u.components;
                            L = u }
                        if (typeof MutationEvent === "undefined" || YSLOW.antiIframe) {
                            return u.setSimpleAfterOnload(s, y) }
                        if (!v) { r.dump("doc body is empty");
                            return s(L) }
                        C = function() {
                            var S, R, P, O, Q, U, T;
                            if (w) {
                                return }
                            H(t);
                            H(x);
                            E(I, "DOMSubtreeModified", J);
                            E(I, "DOMNodeInserted", J);
                            E(I, "DOMAttrModified", J);
                            E(A, "load", G);
                            E(I, "load", G);
                            for (S = 0, P = B.length; S < P; S += 1) { Q = B[S];
                                U = Q.src || Q.href || (Q.getAttribute && (Q.getAttribute("src") || Q.getAttribute("href")));
                                if (!U) {
                                    continue }
                                for (R = 0, O = z.length; R < O; R += 1) { T = z[R];
                                    if (T.url === U) { T.after_onload = true } } }
                            A.parentNode.removeChild(A);
                            w = 1;
                            s(L) };
                        A = N.createElement("iframe");
                        A.style.cssText = "position:absolute;top:-999em;";
                        N.body.appendChild(A);
                        I = A.contentWindow;
                        q = K(C, 3000);
                        if (I) { F = I.document } else { I = F = A.contentDocument }
                        D(I, "load", G);
                        D(A, "load", G);
                        F.open().write(v);
                        F.close();
                        D(I, "load", G) } };
                YSLOW.ComponentSet.validProtocols = ["http", "https", "ftp"];
                YSLOW.ComponentSet.isValidProtocol = function(u) {
                    var t, r, w, v = this.validProtocols,
                        q = v.length;
                    u = u.toLowerCase();
                    r = u.indexOf(":");
                    if (r > 0) { w = u.substr(0, r);
                        for (t = 0; t < q; t += 1) {
                            if (w === v[t]) {
                                return true } } }
                    return false };
                YSLOW.ComponentSet.isValidURL = function(r) {
                    var q, s;
                    r = r.toLowerCase();
                    q = r.split(":");
                    if (q[0] === "http" || q[0] === "https") {
                        if (q[1].substr(0, 2) !== "//") {
                            return false }
                        s = q[1].substr(2);
                        if (s.length === 0 || s.indexOf("/") === 0) {
                            return false } }
                    return true };
                YSLOW.Component = function(r, s, u, v) {
                    var t = v && v.obj,
                        q = (v && v.comp) || {};
                    this.url = r;
                    this.type = s;
                    this.parent = u;
                    this.headers = {};
                    this.raw_headers = "";
                    this.req_headers = null;
                    this.body = "";
                    this.compressed = false;
                    this.expires = undefined;
                    this.size = 0;
                    this.status = 0;
                    this.is_beacon = false;
                    this.method = "unknown";
                    this.cookie = "";
                    this.respTime = null;
                    this.after_onload = false;
                    this.object_prop = undefined;
                    if (s === undefined) { this.type = "unknown" }
                    this.get_info_state = "NONE";
                    if (t && s === "image" && t.width && t.height) { this.object_prop = { width: t.width, height: t.height } }
                    if (q.containerNode) { this.containerNode = q.containerNode }
                    this.setComponentDetails(v) };
                YSLOW.Component.prototype.getInfoState = function() {
                    return this.get_info_state };
                YSLOW.Component.prototype.populateProperties = function(A, s) {
                    var v, q, r, x, y, u, z, w = this,
                        t = null,
                        B = "undefined";
                    if (w.headers.location && A && w.headers.location !== w.url) { v = w.parent.addComponentNoDuplicate(w.headers.location, (w.type !== "redirect" ? w.type : "unknown"), w.url);
                        if (v && w.after_onload) { v.after_onload = true }
                        w.type = "redirect" }
                    x = w.headers["content-length"];
                    q = YSLOW.util.trim(w.headers["content-encoding"]);
                    if (q === "gzip" || q === "deflate") { w.compressed = q;
                        w.size = (w.body.length) ? w.body.length : t;
                        if (x) { w.size_compressed = parseInt(x, 10) || x } else {
                            if (typeof w.nsize !== B) { w.size_compressed = w.nsize } else { w.size_compressed = Math.round(w.size / 3) } } } else { w.compressed = false;
                        w.size_compressed = t;
                        if (x) { w.size = parseInt(x, 10) } else {
                            if (typeof w.nsize !== B) { w.size = parseInt(w.nsize, 10) } else { w.size = w.body.length } } }
                    if (!w.size) {
                        if (typeof w.nsize !== B) { w.size = w.nsize } else { w.size = w.body.length } }
                    w.uncompressed_size = w.body.length;
                    if (w.getMaxAge() !== undefined) { w.expires = w.getMaxAge() } else {
                        if (w.headers.expires && w.headers.expires.length > 0) { w.expires = new Date(w.headers.expires) } }
                    if (w.type === "image" && !s) {
                        if (typeof Image !== B) { u = new Image() } else { u = document.createElement("img") }
                        if (w.body.length) { y = "data:" + w.headers["content-type"] + ";base64," + YSLOW.util.base64Encode(w.body);
                            z = 1 } else { y = w.url }
                        u.onerror = function() { u.onerror = t;
                            if (z) { u.src = w.url } };
                        u.onload = function() { u.onload = t;
                            if (u && u.width && u.height) {
                                if (w.object_prop) { w.object_prop.actual_width = u.width;
                                    w.object_prop.actual_height = u.height } else { w.object_prop = { width: u.width, height: u.height, actual_width: u.width, actual_height: u.height } }
                                if (u.width < 2 && u.height < 2) { w.is_beacon = true } } };
                        u.src = y } };
                YSLOW.Component.prototype.hasOldModifiedDate = function() {
                    var q = Number(new Date()),
                        r = this.headers["last-modified"];
                    if (typeof r !== "undefined") {
                        return ((q - Number(new Date(r))) > (24 * 60 * 60 * 1000)) }
                    return false };
                YSLOW.Component.prototype.hasFarFutureExpiresOrMaxAge = function() {
                    var t, r = Number(new Date()),
                        s = YSLOW.util.Preference.getPref("minFutureExpiresSeconds", 2 * 24 * 60 * 60),
                        q = s * 1000;
                    if (typeof this.expires === "object") { t = Number(this.expires);
                        if ((t - r) > q) {
                            return true } }
                    return false };
                YSLOW.Component.prototype.getEtag = function() {
                    return this.headers.etag || "" };
                YSLOW.Component.prototype.getMaxAge = function() {
                    var r, s, q, t = this.headers["cache-control"];
                    if (t) { r = t.indexOf("max-age");
                        if (r > -1) { s = parseInt(t.substring(r + 8), 10);
                            if (s > 0) { q = YSLOW.util.maxAgeToDate(s) } } }
                    return q };
                YSLOW.Component.prototype.getSetCookieSize = function() {
                    var s, q, r = 0;
                    if (this.headers && this.headers["set-cookie"]) { s = this.headers["set-cookie"].split("\n");
                        if (s.length > 0) {
                            for (q = 0; q < s.length; q += 1) { r += s[q].length } } }
                    return r };
                YSLOW.Component.prototype.getReceivedCookieSize = function() {
                    var s, q, r = 0;
                    if (this.cookie && this.cookie.length > 0) { s = this.cookie.split("\n");
                        if (s.length > 0) {
                            for (q = 0; q < s.length; q += 1) { r += s[q].length } } }
                    return r };
                YSLOW.Component.prototype.setComponentDetails = function(s) {
                    var q = this,
                        r = function(v, t) {
                            var w;
                            q.status = t.status;
                            q.headers = {};
                            q.raw_headers = "";
                            t.headers.forEach(function(x) { q.headers[x.name.toLowerCase()] = x.value;
                                q.raw_headers += x.name + ": " + x.value + "\n" });
                            q.req_headers = {};
                            v.headers.forEach(function(x) { q.req_headers[x.name.toLowerCase()] = x.value });
                            q.method = v.method;
                            if (t.contentText) { q.body = t.contentText } else {
                                try { w = new XMLHttpRequest();
                                    w.open("GET", q.url, false);
                                    w.send();
                                    q.body = w.responseText } catch (u) { q.body = { toString: function() {
                                            return "" }, length: t.bodySize || 0 } } }
                            q.response_type = q.type;
                            q.cookie = (q.headers["set-cookie"] || "") + (q.req_headers.cookie || "");
                            q.nsize = parseInt(q.headers["content-length"], 10) || t.bodySize;
                            q.respTime = t.time;
                            q.after_onload = (new Date(v.time).getTime()) > q.parent.onloadTimestamp;
                            q.populateProperties(false, true);
                            q.get_info_state = "DONE";
                            q.parent.onComponentGetInfoStateChange({ comp: q, state: "DONE" }) };
                    if (s.request && s.response) { r(s.request, s.response) } };
                YSLOW.controller = { rules: {}, rulesets: {}, onloadTimestamp: null, renderers: {}, default_ruleset_id: "ydefault", run_pending: 0, init: function() {
                        var r, q, t, s;
                        YSLOW.util.event.addListener("onload", function(u) { this.onloadTimestamp = u.time;
                            YSLOW.util.setTimer(function() { YSLOW.controller.run_pending_event() }) }, this);
                        YSLOW.util.event.addListener("onUnload", function(u) { this.run_pending = 0;
                            this.onloadTimestamp = null }, this);
                        r = YSLOW.util.Preference.getPrefList("customRuleset.", undefined);
                        if (r && r.length > 0) {
                            for (q = 0; q < r.length; q += 1) { s = r[q].value;
                                if (typeof s === "string" && s.length > 0) { t = JSON.parse(s, null);
                                    t.custom = true;
                                    this.addRuleset(t) } } }
                        this.default_ruleset_id = YSLOW.util.Preference.getPref("defaultRuleset", "ydefault");
                        this.loadRulePreference() }, run: function(t, u, r) {
                        var v, q, s = t.document;
                        if (!s || !s.location || s.location.href.indexOf("about:") === 0 || "undefined" === typeof s.location.hostname) {
                            if (!r) { q = "Please enter a valid website address before running YSlow.";
                                YSLOW.ysview.openDialog(YSLOW.ysview.panel_doc, 389, 150, q, "", "Ok") }
                            return }
                        if (!u.PAGE.loaded) { this.run_pending = { win: t, yscontext: u };
                            return }
                        YSLOW.util.event.fire("peelStart", undefined);
                        v = YSLOW.peeler.peel(s, this.onloadTimestamp);
                        u.component_set = v;
                        YSLOW.util.event.fire("peelComplete", { component_set: v });
                        v.notifyPeelDone() }, run_pending_event: function() {
                        if (this.run_pending) { this.run(this.run_pending.win, this.run_pending.yscontext, false);
                            this.run_pending = 0 } }, lint: function(H, s, q) {
                        var t, x, F, w, y, z, G, E = [],
                            C = [],
                            D = 0,
                            B = 0,
                            u = this,
                            v = u.rulesets,
                            A = u.default_ruleset_id;
                        if (q) { E = v[q] } else {
                            if (A && v[A]) { E = v[A] } else {
                                for (F in v) {
                                    if (v.hasOwnProperty(F) && v[F]) { E = v[F];
                                        break } } } }
                        x = E.rules;
                        for (F in x) {
                            if (x.hasOwnProperty(F) && x[F] && this.rules.hasOwnProperty(F)) {
                                try { t = this.rules[F];
                                    w = YSLOW.util.merge(t.config, x[F]);
                                    y = t.lint(H, s.component_set, w);
                                    z = (E.weights ? E.weights[F] : undefined);
                                    if (z !== undefined) { z = parseInt(z, 10) }
                                    if (z === undefined || z < 0 || z > 100) {
                                        if (v.ydefault.weights[F]) { z = v.ydefault.weights[F] } else { z = 5 } }
                                    y.weight = z;
                                    if (y.score !== undefined) {
                                        if (typeof y.score !== "number") { G = parseInt(y.score, 10);
                                            if (!isNaN(G)) { y.score = G } }
                                        if (typeof y.score === "number") { B += y.weight;
                                            if (!YSLOW.util.Preference.getPref("allowNegativeScore", false)) {
                                                if (y.score < 0) { y.score = 0 }
                                                if (typeof y.score !== "number") { y.score = -1 } }
                                            if (y.score !== 0) { D += y.score * (typeof y.weight !== "undefined" ? y.weight : 1) } } }
                                    y.name = t.name;
                                    y.category = t.category;
                                    y.rule_id = F;
                                    C[C.length] = y } catch (r) { YSLOW.util.dump("YSLOW.controller.lint: " + F, r);
                                    YSLOW.util.event.fire("lintError", { rule: F, message: r }) } } }
                        s.PAGE.overallScore = D / (B > 0 ? B : 1);
                        s.result_set = new YSLOW.ResultSet(C, s.PAGE.overallScore, E);
                        s.result_set.url = s.component_set.doc_comp.url;
                        YSLOW.util.event.fire("lintResultReady", { yslowContext: s });
                        return s.result_set }, runTool: function(D, A, r) {
                        var G, w, C, v, y, q, B, t, F, E, x, z = YSLOW.Tools.getTool(D);
                        try {
                            if (typeof z === "object") { G = z.run(A.document, A.component_set, r);
                                if (z.print_output) { w = "";
                                    if (typeof G === "object") { w = G.html } else {
                                        if (typeof G === "string") { w = G } }
                                    C = YSLOW.util.getNewDoc();
                                    x = C.body || C.documentElement;
                                    x.innerHTML = w;
                                    v = C.getElementsByTagName("head")[0];
                                    if (typeof G.css === "undefined") { q = "chrome://yslow/content/yslow/tool.css";
                                        B = new XMLHttpRequest();
                                        B.open("GET", q, false);
                                        B.send(null);
                                        y = B.responseText } else { y = G.css }
                                    if (typeof y === "string") { t = C.createElement("style");
                                        t.setAttribute("type", "text/css");
                                        t.appendChild(C.createTextNode(y));
                                        v.appendChild(t) }
                                    if (typeof G.js !== "undefined") { F = C.createElement("script");
                                        F.setAttribute("type", "text/javascript");
                                        F.appendChild(C.createTextNode(G.js));
                                        v.appendChild(F) }
                                    if (typeof G.plot_component !== "undefined" && G.plot_component === true) { YSLOW.renderer.plotComponents(C, A) } } } else { E = D + " is not a tool.";
                                YSLOW.util.dump(E);
                                YSLOW.util.event.fire("toolError", { tool_id: D, message: E }) } } catch (u) { YSLOW.util.dump("YSLOW.controller.runTool: " + D, u);
                            YSLOW.util.event.fire("toolError", { tool_id: D, message: u }) } }, render: function(u, q, t) {
                        var s = this.renderers[u],
                            r = "";
                        if (s.supports[q] !== undefined && s.supports[q] === 1) {
                            switch (q) {
                                case "components":
                                    r = s.componentsView(t.comps, t.total_size);
                                    break;
                                case "reportcard":
                                    r = s.reportcardView(t.result_set);
                                    break;
                                case "stats":
                                    r = s.statsView(t.stats);
                                    break;
                                case "tools":
                                    r = s.toolsView(t.tools);
                                    break;
                                case "rulesetEdit":
                                    r = s.rulesetEditView(t.rulesets);
                                    break } }
                        return r }, getRenderer: function(q) {
                        return this.renderers[q] }, addRule: function(s) {
                        var q, r, t = ["id", "name", "config", "info", "lint"];
                        if (YSLOW.doc.rules && YSLOW.doc.rules[s.id]) { r = YSLOW.doc.rules[s.id];
                            if (r.name) { s.name = r.name }
                            if (r.info) { s.info = r.info } }
                        for (q = 0; q < t.length; q += 1) {
                            if (typeof s[t[q]] === "undefined") {
                                throw new YSLOW.Error("Interface error", "Improperly implemented rule interface") } }
                        if (this.rules[s.id] !== undefined) {
                            throw new YSLOW.Error("Rule register error", s.id + " is already defined.") }
                        this.rules[s.id] = s }, addRuleset: function(q, t) {
                        var r, s = ["id", "name", "rules"];
                        for (r = 0; r < s.length; r += 1) {
                            if (typeof q[s[r]] === "undefined") {
                                throw new YSLOW.Error("Interface error", "Improperly implemented ruleset interface") }
                            if (this.checkRulesetName(q.id) && t !== true) {
                                throw new YSLOW.Error("Ruleset register error", q.id + " is already defined.") } }
                        this.rulesets[q.id] = q }, removeRuleset: function(r) {
                        var q = this.rulesets[r];
                        if (q && q.custom === true) { delete this.rulesets[r];
                            if (this.default_ruleset_id === r) { this.default_ruleset_id = "ydefault";
                                YSLOW.util.Preference.setPref("defaultRuleset", this.default_ruleset_id) }
                            return q }
                        return null }, saveRulesetToPref: function(q) {
                        if (q.custom === true) { YSLOW.util.Preference.setPref("customRuleset." + q.id, JSON.stringify(q, null, 2)) } }, deleteRulesetFromPref: function(q) {
                        if (q.custom === true) { YSLOW.util.Preference.deletePref("customRuleset." + q.id) } }, getRuleset: function(q) {
                        return this.rulesets[q] }, addRenderer: function(q) { this.renderers[q.id] = q }, getRegisteredRuleset: function() {
                        return this.rulesets }, getRegisteredRules: function() {
                        return this.rules }, getRule: function(q) {
                        return this.rules[q] }, checkRulesetName: function(s) {
                        var t, r, q = this.rulesets;
                        s = s.toLowerCase();
                        for (t in q) {
                            if (q.hasOwnProperty(t)) { r = q[t];
                                if (r.id.toLowerCase() === s || r.name.toLowerCase() === s) {
                                    return true } } }
                        return false }, setDefaultRuleset: function(q) {
                        if (this.rulesets[q] !== undefined) { this.default_ruleset_id = q;
                            YSLOW.util.Preference.setPref("defaultRuleset", q) } }, getDefaultRuleset: function() {
                        if (this.rulesets[this.default_ruleset_id] === undefined) { this.setDefaultRuleset("ydefault") }
                        return this.rulesets[this.default_ruleset_id] }, getDefaultRulesetId: function() {
                        return this.default_ruleset_id }, loadRulePreference: function() {
                        var r = this.getRule("yexpires"),
                            q = YSLOW.util.Preference.getPref("minFutureExpiresSeconds", 2 * 24 * 60 * 60);
                        if (q > 0 && r) { r.config.howfar = q } } };
                YSLOW.util = { merge: function(r, q) {
                        var s, t = {};
                        for (s in r) {
                            if (r.hasOwnProperty(s)) { t[s] = r[s] } }
                        for (s in q) {
                            if (q.hasOwnProperty(s)) { t[s] = q[s] } }
                        return t }, dump: function() {
                        var q;
                        if (!YSLOW.DEBUG) {
                            return }
                        q = Array.prototype.slice.apply(arguments);
                        q = q && q.length === 1 ? q[0] : q;
                        try {
                            if (typeof Firebug !== "undefined" && Firebug.Console && Firebug.Console.log) { Firebug.Console.log(q) } else {
                                if (typeof Components !== "undefined" && Components.classes && Components.interfaces) { Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage(JSON.stringify(q, null, 2)) } } } catch (s) {
                            try { console.log(q) } catch (r) {} } }, filter: function(t, u, r) {
                        var s, q = r ? [] : {};
                        for (s in t) {
                            if (t.hasOwnProperty(s) && u(s, t[s])) { q[r ? q.length : s] = t[s] } }
                        return q }, expires_month: { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }, prettyExpiresDate: function(q) {
                        var r;
                        if (Object.prototype.toString.call(q) === "[object Date]" && q.toString() !== "Invalid Date" && !isNaN(q)) { r = q.getMonth() + 1;
                            return q.getFullYear() + "/" + r + "/" + q.getDate() } else {
                            if (!q) {
                                return "no expires" } }
                        return "invalid date object" }, maxAgeToDate: function(r) {
                        var q = new Date();
                        q = q.getTime() + parseInt(r, 10) * 1000;
                        return new Date(q) }, plural: function(s, t) {
                        var r, q = s,
                            u = { are: ["are", "is"], s: ["s", ""], "do": ["do", "does"], num: [t, t] };
                        for (r in u) {
                            if (u.hasOwnProperty(r)) { q = q.replace(new RegExp("%" + r + "%", "gm"), (t === 1) ? u[r][1] : u[r][0]) } }
                        return q }, countExpressions: function(s) {
                        var q = 0,
                            r;
                        r = s.indexOf("expression(");
                        while (r !== -1) { q += 1;
                            r = s.indexOf("expression(", r + 1) }
                        return q }, countAlphaImageLoaderFilter: function(v) {
                        var t, u, s, w, r = 0,
                            x = 0,
                            q = {};
                        t = v.indexOf("filter:");
                        while (t !== -1) { s = false;
                            if (t > 0 && v.charAt(t - 1) === "_") { s = true }
                            u = v.indexOf(";", t + 7);
                            if (u !== -1) { w = v.substring(t + 7, u);
                                if (w.indexOf("AlphaImageLoader") !== -1) {
                                    if (s) { x += 1 } else { r += 1 } } }
                            t = v.indexOf("filter:", t + 1) }
                        if (x > 0) { q.hackFilter = x }
                        if (r > 0) { q.filter = r }
                        return q }, getHostname: function(r) {
                        var q = r.split("/")[2];
                        return (q && q.split(":")[0]) || "" }, getUniqueDomains: function(w, u) {
                        var t, r, v, q = {},
                            s = [];
                        for (t = 0, r = w.length; t < r; t += 1) { v = w[t].url.split("/");
                            if (v[2]) { q[v[2].split(":")[0]] = 1 } }
                        for (t in q) {
                            if (q.hasOwnProperty(t)) {
                                if (!u) { s.push(t) } else { v = t.split(".");
                                    if (isNaN(parseInt(v[v.length - 1], 10))) { s.push(t) } } } }
                        return s }, summaryByDomain: function(r, B, s) {
                        var x, w, A, v, C, u, y, t, D, z, E = {},
                            q = [];
                        B = [].concat(B);
                        t = B.length;
                        for (x = 0, A = r.length; x < A; x += 1) { y = r[x];
                            v = y.url.split("/");
                            if (v[2]) { C = v[2].split(":")[0];
                                u = E[C];
                                if (!u) { u = { domain: C, count: 0 };
                                    E[C] = u }
                                u.count += 1;
                                for (w = 0; w < t; w += 1) { D = B[w];
                                    z = u["sum_" + D] || 0;
                                    z += parseInt(y[D], 10) || 0;
                                    u["sum_" + D] = z } } }
                        for (u in E) {
                            if (E.hasOwnProperty(u)) {
                                if (!s) { q.push(E[u]) } else { v = u.split(".");
                                    if (isNaN(parseInt(v[v.length - 1], 10))) { q.push(E[u]) } } } }
                        return q }, isMinified: function(s) {
                        var q = s.length,
                            r;
                        if (q === 0) {
                            return true }
                        r = s.replace(/\n| {2}|\t|\r/g, "").length;
                        if (((q - r) / q) > 0.2) {
                            return false }
                        return true }, isETagGood: function(q) {
                        var s = /^[0-9a-f]+:([1-9a-f]|[0-9a-f]{2,})$/,
                            r = /^[0-9a-f]+\-[0-9a-f]+\-[0-9a-f]+$/;
                        if (!q) {
                            return true }
                        q = q.replace(/^["']|["'][\s\S]*$/g, "");
                        return !(r.test(q) || s.test(q)) }, getComponentType: function(q) {
                        var r = "unknown";
                        if (q && typeof q === "string") {
                            if (q === "text/html" || q === "text/plain") { r = "doc" } else {
                                if (q === "text/css") { r = "css" } else {
                                    if (/javascript/.test(q)) { r = "js" } else {
                                        if (/flash/.test(q)) { r = "flash" } else {
                                            if (/image/.test(q)) { r = "image" } else {
                                                if (/font/.test(q)) { r = "font" } } } } } } }
                        return r }, base64Encode: function(v) {
                        var u, t, s, x, r = "",
                            w = 0,
                            q = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"];
                        for (u = 0; u < v.length; u += 3) { t = v.charCodeAt(u);
                            if ((u + 1) < v.length) { s = v.charCodeAt(u + 1) } else { s = 0;
                                w += 1 }
                            if ((u + 2) < v.length) { x = v.charCodeAt(u + 2) } else { x = 0;
                                w += 1 }
                            r += q[(t & 252) >> 2];
                            r += q[((t & 3) << 4) | ((s & 240) >> 4)];
                            if (w > 0) { r += "=" } else { r += q[((s & 15) << 2) | ((x & 192) >> 6)] }
                            if (w > 1) { r += "=" } else { r += q[(x & 63)] } }
                        return r }, getXHR: function() {
                        var q = 0,
                            t = null,
                            r = ["MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
                        if (typeof XMLHttpRequest === "function") {
                            return new XMLHttpRequest() }
                        for (q = 0; q < r.length; q += 1) {
                            try { t = new ActiveXObject(r[q]);
                                break } catch (s) {} }
                        return t }, getComputedStyle: function(v, r, q) {
                        var u, t, s = "";
                        if (v.currentStyle) { s = v.currentStyle[r] }
                        if (v.ownerDocument && v.ownerDocument.defaultView && document.defaultView.getComputedStyle) { u = v.ownerDocument.defaultView.getComputedStyle(v, "");
                            if (u) { s = u[r] } }
                        if (!q) {
                            return s }
                        if (typeof s !== "string") {
                            return false }
                        t = s.match(/\burl\((\'|\"|)([^\'\"]+?)\1\)/);
                        if (t) {
                            return t[2] } else {
                            return false } }, escapeHtml: function(q) {
                        return (q || "").toString().replace(/</g, "&lt;").replace(/>/g, "&gt;") }, escapeQuotes: function(r, q) {
                        if (q === "single") {
                            return r.replace(/\'/g, "\\'") }
                        if (q === "double") {
                            return r.replace(/\"/g, '\\"') }
                        return r.replace(/\'/g, "\\'").replace(/\"/g, '\\"') }, formatHeaderName: (function() {
                        var q = { "content-md5": "Content-MD5", dnt: "DNT", etag: "ETag", p3p: "P3P", te: "TE", "www-authenticate": "WWW-Authenticate", "x-att-deviceid": "X-ATT-DeviceId", "x-cdn": "X-CDN", "x-ua-compatible": "X-UA-Compatible", "x-xss-protection": "X-XSS-Protection" };
                        return function(s) {
                            var r = s.toLowerCase();
                            if (q.hasOwnProperty(r)) {
                                return q[r] } else {
                                return r.replace(/(^|-)([a-z])/g, function(t, u, v) {
                                    return u + v.toUpperCase() }) } } }()), mod: function(q, r) {
                        return Math.round(q - (Math.floor(q / r) * r)) }, briefUrl: function(s, q) {
                        var r, t, u, v;
                        q = q || 100;
                        if (s === undefined) {
                            return "" }
                        r = s.indexOf("//");
                        if (-1 !== r) { t = s.indexOf("?");
                            if (-1 !== t) { s = s.substring(0, t) + "?..." }
                            if (s.length > q) { u = s.indexOf("/", r + 2);
                                v = s.lastIndexOf("/");
                                if (-1 !== u && -1 !== v && u !== v) { s = s.substring(0, u + 1) + "..." + s.substring(v) } else { s = s.substring(0, q + 1) + "..." } } }
                        return s }, prettyAnchor: function(y, r, t, s, w, q, z) {
                        var u, x = "",
                            v = "",
                            A = 0;
                        if (typeof r === "undefined") { r = y }
                        if (typeof t === "undefined") { t = "" } else { t = ' class="' + t + '"' }
                        if (typeof w === "undefined") { w = 100 }
                        if (typeof q === "undefined") { q = 1 }
                        z = (z) ? ' rel="' + z + '"' : "";
                        r = YSLOW.util.escapeHtml(r);
                        y = YSLOW.util.escapeHtml(y);
                        u = YSLOW.util.escapeQuotes(r, "double");
                        if (s) { y = YSLOW.util.briefUrl(y, w);
                            x = ' title="' + u + '"' }
                        while (0 < y.length) { v += "<a" + z + t + x + ' href="' + u + '" onclick="javascript:document.ysview.openLink(\'' + YSLOW.util.escapeQuotes(r) + "'); return false;\">" + y.substring(0, w);
                            y = y.substring(w);
                            A += 1;
                            if (A >= q) {
                                if (0 < y.length) { v += "[snip]" }
                                v += "</a>";
                                break } else { v += "</a><font style='font-size: 0px;'> </font>" } }
                        return v }, kbSize: function(q) {
                        var r = q % (q > 100 ? 100 : 10);
                        q -= r;
                        return parseFloat(q / 1000) + (0 === (q % 1000) ? ".0" : "") + "K" }, prettyTypes: { image: "Image", doc: "HTML/Text", cssimage: "CSS Image", css: "Stylesheet File", js: "JavaScript File", flash: "Flash Object", iframe: "IFrame", xhr: "XMLHttpRequest", redirect: "Redirect", favicon: "Favicon", unknown: "Unknown" }, prettyType: function(q) {
                        return YSLOW.util.prettyTypes[q] }, prettyScore: function(r) {
                        var q = "F";
                        if (!parseInt(r, 10) && r !== 0) {
                            return r }
                        if (r === -1) {
                            return "N/A" }
                        if (r >= 90) { q = "A" } else {
                            if (r >= 80) { q = "B" } else {
                                if (r >= 70) { q = "C" } else {
                                    if (r >= 60) { q = "D" } else {
                                        if (r >= 50) { q = "E" } } } } }
                        return q }, getResults: function(w, S) {
                        var O, L, J, u, t, H, T, G, F, x, v, r, W, Q, I, s, E, D, y, A, N, K, B, z = / <button [\s\S]+<\/button>/,
                            q = YSLOW.util,
                            C = q.isArray,
                            V = {},
                            P = {},
                            M = [],
                            U = {},
                            R = {};
                        S = (S || "basic").split(",");
                        for (O = 0, Q = S.length; O < Q; O += 1) {
                            if (S[O] === "all") { I = E = s = true;
                                break } else {
                                switch (S[O]) {
                                    case "grade":
                                        I = true;
                                        break;
                                    case "stats":
                                        E = true;
                                        break;
                                    case "comps":
                                        s = true;
                                        break } } }
                        U.v = YSLOW.version;
                        U.w = parseInt(w.PAGE.totalSize, 10);
                        U.o = parseInt(w.PAGE.overallScore, 10);
                        U.u = encodeURIComponent(w.result_set.url);
                        U.r = parseInt(w.PAGE.totalRequests, 10);
                        A = q.getPageSpaceid(w.component_set);
                        if (A) { U.s = encodeURI(A) }
                        U.i = w.result_set.getRulesetApplied().id;
                        if (w.PAGE.t_done) { U.lt = parseInt(w.PAGE.t_done, 10) }
                        if (I) { J = w.result_set.getResults();
                            for (O = 0, Q = J.length; O < Q; O += 1) { F = {};
                                D = J[O];
                                if (D.hasOwnProperty("score")) {
                                    if (D.score >= 0) { F.score = parseInt(D.score, 10) } else {
                                        if (D.score === -1) { F.score = "n/a" } } }
                                F.message = D.message.replace(/javascript:document\.ysview\.openLink\('(.+)'\)/, "$1");
                                H = D.components;
                                if (C(H)) { F.components = [];
                                    for (L = 0, y = H.length; L < y; L += 1) { T = H[L];
                                        if (typeof T === "string") { u = T } else {
                                            if (typeof T.url === "string") { u = T.url } }
                                        if (u) { u = encodeURIComponent(u.replace(z, ""));
                                            F.components.push(u) } } }
                                R[D.rule_id] = F }
                            U.g = R }
                        if (E) { U.w_c = parseInt(w.PAGE.totalSizePrimed, 10);
                            U.r_c = parseInt(w.PAGE.totalRequestsPrimed, 10);
                            for (t in w.PAGE.totalObjCount) {
                                if (w.PAGE.totalObjCount.hasOwnProperty(t)) { V[t] = { r: w.PAGE.totalObjCount[t], w: w.PAGE.totalObjSize[t] } } }
                            U.stats = V;
                            for (t in w.PAGE.totalObjCountPrimed) {
                                if (w.PAGE.totalObjCountPrimed.hasOwnProperty(t)) { P[t] = { r: w.PAGE.totalObjCountPrimed[t], w: w.PAGE.totalObjSizePrimed[t] } } }
                            U.stats_c = P }
                        if (s) { H = w.component_set.components;
                            for (O = 0, Q = H.length; O < Q; O += 1) { T = H[O];
                                G = encodeURIComponent(T.url);
                                F = { type: T.type, url: G, size: T.size, resp: T.respTime };
                                if (T.size_compressed) { F.gzip = T.size_compressed }
                                if (T.expires && T.expires instanceof Date) { F.expires = q.prettyExpiresDate(T.expires) }
                                x = T.getReceivedCookieSize();
                                if (x > 0) { F.cr = x }
                                v = T.getSetCookieSize();
                                if (v > 0) { F.cs = v }
                                r = T.getEtag();
                                if (typeof r === "string" && r.length > 0) { F.etag = r }
                                F.headers = {};
                                if (T.req_headers) { K = T.req_headers;
                                    F.headers.request = {};
                                    B = F.headers.request;
                                    for (N in K) {
                                        if (K.hasOwnProperty(N)) { B[q.formatHeaderName(N)] = K[N] } } }
                                if (T.headers) { K = T.headers;
                                    F.headers.response = {};
                                    B = F.headers.response;
                                    for (N in K) {
                                        if (K.hasOwnProperty(N)) { B[q.formatHeaderName(N)] = K[N] } } }
                                M.push(F) }
                            U.comps = M }
                        return U }, sendBeacon: function(v, u, r) {
                        var w, z, A, s, x, t = "",
                            y = YSLOW.util,
                            B = y.Preference,
                            q = "get";
                        u = (u || "basic").split(",");
                        for (w = 0, z = u.length; w < z; w += 1) {
                            if (u[w] === "all") { q = "post";
                                break } else {
                                switch (u[w]) {
                                    case "grade":
                                        q = "post";
                                        break;
                                    case "stats":
                                        q = "post";
                                        break;
                                    case "comps":
                                        q = "post";
                                        break } } }
                        if (q === "post") { t = JSON.stringify(v, null);
                            A = y.getXHR();
                            A.open("POST", r, true);
                            A.setRequestHeader("Content-Length", t.length);
                            A.setRequestHeader("Content-Type", "application/json");
                            A.send(t) } else {
                            for (s in v) {
                                if (v.hasOwnProperty(s)) { t += s + "=" + v[s] + "&" } }
                            x = new Image();
                            x.src = r + "?" + t }
                        return t }, getDict: function(t, B) {
                        var x, z, s, w, q, A, v, r = YSLOW,
                            y = r.controller,
                            C = r.doc.rules,
                            u = { v: "version", w: "size", o: "overall score", u: "url", r: "total number of requests", s: "space id of the page", i: "id of the ruleset used", lt: "page load time", grades: "100 >= A >= 90 > B >= 80 > C >= 70 > D >= 60 > E >= 50 > F >= 0 > N/A = -1" };
                        t = (t || "basic").split(",");
                        B = B || "ydefault";
                        A = y.rulesets[B].weights;
                        for (x = 0, z = t.length; x < z; x += 1) {
                            if (t[x] === "all") { s = w = q = true;
                                break } else {
                                switch (t[x]) {
                                    case "grade":
                                        s = true;
                                        break;
                                    case "stats":
                                        w = true;
                                        break;
                                    case "comps":
                                        q = true;
                                        break } } }
                        if (s) { u.g = "scores of all rules in the ruleset";
                            u.rules = {};
                            for (v in A) {
                                if (A.hasOwnProperty(v)) { u.rules[v] = C[v];
                                    u.rules[v].weight = A[v] } } }
                        if (w) { u.w_c = "page weight with primed cache";
                            u.r_c = "number of requests with primed cache";
                            u.stats = "number of requests and weight grouped by component type";
                            u.stats_c = "number of request and weight of components group by component type with primed cache" }
                        if (q) { u.comps = "array of all the components found on the page" }
                        return u }, isObject: function(q) {
                        return Object.prototype.toString.call(q).indexOf("Object") > -1 }, isArray: function(q) {
                        if (Array.isArray) {
                            return Array.isArray(q) } else {
                            return Object.prototype.toString.call(q).indexOf("Array") > -1 } }, decodeURIComponent: function(r) {
                        try {
                            return decodeURIComponent(r) } catch (q) {
                            return r } }, decodeEntities: function(q) {
                        return String(q).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"') }, safeXML: (function() {
                        var q = this.decodeURIComponent,
                            r = /[<&>]/;
                        return function(s, t) {
                            if (t) { s = q(s) }
                            if (r.test(s)) {
                                return "<![CDATA[" + s + "]]>" }
                            return s } }()), objToXML: function(u, s) {
                        var q, r = YSLOW.util,
                            v = r.safeXML,
                            t = '<?xml version="1.0" encoding="UTF-8"?>';
                        q = function(C) {
                            var z, A, x, w, B, y;
                            for (z in C) {
                                if (C.hasOwnProperty(z)) { A = C[z];
                                    t += "<" + z + ">";
                                    if (r.isArray(A)) {
                                        for (x = 0, w = A.length; x < w; x += 1) { B = A[x];
                                            y = typeof B;
                                            t += "<item>";
                                            if (y === "string" || y === "number") { t += v(B, z === "components") } else { q(B) }
                                            t += "</item>" } } else {
                                        if (r.isObject(A)) { q(A) } else { t += v(A, z === "u" || z === "url") } }
                                    t += "</" + z + ">" } } };
                        s = s || "results";
                        t += "<" + s + ">";
                        q(u);
                        t += "</" + s + ">";
                        return t }, prettyPrintResults: function(u) {
                        var s, r = YSLOW.util,
                            v = "",
                            t = {},
                            w = { v: "version", w: "size", o: "overall score", u: "url", r: "# of requests", s: "space id", i: "ruleset", lt: "page load time", g: "scores", w_c: "page size (primed cache)", r_c: "# of requests (primed cache)", stats: "statistics by component", stats_c: "statistics by component (primed cache)", comps: "components found on the page", components: "offenders", cr: "received cookie size", cs: "set cookie size", resp: "response time" },
                            q = function(z) {
                                var x, y = t[z];
                                if (typeof y === "undefined") { x = [];
                                    x.length = (4 * z) + 1;
                                    t[z] = y = x.join(" ") }
                                return y };
                        s = function(D, E) {
                            var A, B, y, x, C, z;
                            for (A in D) {
                                if (D.hasOwnProperty(A)) { B = D[A];
                                    v += q(E) + (w[A] || A) + ":";
                                    if (r.isArray(B)) { v += "\n";
                                        for (y = 0, x = B.length; y < x; y += 1) { C = B[y];
                                            z = typeof C;
                                            if (z === "string" || z === "number") { v += q(E + 1) + r.decodeURIComponent(C) + "\n" } else { s(C, E + 1);
                                                if (y < x - 1) { v += "\n" } } } } else {
                                        if (r.isObject(B)) { v += "\n";
                                            s(B, E + 1) } else {
                                            if (A === "score" || A === "o") { B = r.prettyScore(B) + " (" + B + ")" }
                                            if (A === "w" || A === "w_c" || A === "size" || A === "gzip" || A === "cr" || A === "cs") { B = r.kbSize(B) + " (" + B + " bytes)" }
                                            v += " " + r.decodeURIComponent(B) + "\n" } } } } };
                        s(u, 0);
                        return v }, testResults: function(y, s) {
                        var C, H, r, z, E, t, D, F, v = [],
                            B = { a: 90, b: 80, c: 70, d: 60, e: 50, f: 0, "n/a": -1 },
                            G = YSLOW,
                            q = G.util,
                            A = q.isObject(s),
                            x = G.doc.rules,
                            u = function(J) {
                                var K = parseInt(J, 10);
                                if (isNaN(K) && typeof J === "string") { K = B[J.toLowerCase()] }
                                if (K === 0) {
                                    return 0 }
                                return K || C || B.b },
                            w = function(J) {
                                if (t) {
                                    return t }
                                if (!A) { t = u(s);
                                    return t } else {
                                    if (s.hasOwnProperty(J)) {
                                        return u(s[J]) } else {
                                        return C || B.b } } },
                            I = function(N, L, J, K, O) {
                                var M = x.hasOwnProperty(J) && x[J].name;
                                v.push({ ok: N >= L, score: N, grade: q.prettyScore(N), name: J, description: M || "", message: K, offenders: O }) };
                        C = w("overall");
                        I(y.o, C, "overall score");
                        z = y.g;
                        if (z) {
                            for (r in z) {
                                if (z.hasOwnProperty(r)) { H = z[r];
                                    E = H.score;
                                    if (typeof E === "undefined") { E = -1 }
                                    I(E, w(r), r, H.message, H.components) } } }
                        return v }, formatAsTAP: function(t) {
                        var u, z, B, x, s, r, q = 0,
                            w = t.length,
                            y = [],
                            v = YSLOW.util,
                            A = v.decodeURIComponent;
                        y.push("TAP version 13");
                        y.push("1.." + w);
                        for (u = 0; u < w; u += 1) { z = t[u];
                            B = z.ok || z.score < 0 ? "ok" : "not ok";
                            q += (z.ok || z.score < 0) ? 0 : 1;
                            B += " " + (u + 1) + " " + z.grade + " (" + z.score + ") " + z.name;
                            if (z.description) { B += ": " + z.description }
                            if (z.score < 0) { B += " # SKIP score N/A" }
                            y.push(B);
                            if (z.message) { y.push("  ---");
                                y.push("  message: " + z.message) }
                            x = z.offenders;
                            if (x) { r = x.length;
                                if (r > 0) {
                                    if (!z.message) { y.push("  ---") }
                                    y.push("  offenders:");
                                    for (s = 0; s < r; s += 1) { y.push('    - "' + A(x[s]) + '"') } } }
                            if (z.message || r > 0) { y.push("  ...") } }
                        return { failures: q, content: y.join("\n") } }, formatAsJUnit: function(u) {
                        var v, B, F, x, t, r, y = u.length,
                            A = 0,
                            q = 0,
                            z = [],
                            E = [],
                            w = YSLOW.util,
                            C = w.decodeURIComponent,
                            D = w.safeXML,
                            s = function(G) {
                                return G.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") };
                        for (v = 0; v < y; v += 1) { B = u[v];
                            F = '    <testcase name="' + s(B.name + (B.description ? ": " + B.description : "")) + '"';
                            F += ' status="' + B.grade + " (" + B.score + ")";
                            if (B.ok) { E.push(F + '"/>') } else { E.push(F + '">');
                                if (B.score < 0) { A += 1;
                                    E.push("      <skipped>score N/A</skipped>") } else { q += 1 }
                                F = "      <failure";
                                if (B.message) { F += ' message="' + s(B.message) + '"' }
                                x = B.offenders;
                                if (x) { E.push(F + ">");
                                    r = x.length;
                                    for (t = 0; t < r; t += 1) { E.push("        " + D(C(x[t]))) }
                                    E.push("      </failure>") } else { E.push(F + "/>") }
                                E.push("    </testcase>") } }
                        z.push('<?xml version="1.0" encoding="UTF-8" ?>');
                        z.push("<testsuites>");
                        F = '  <testsuite name="YSlow" tests="' + y + '"';
                        if (q) { F += ' failures="' + q + '"' }
                        if (A) { F += ' skipped="' + A + '"' }
                        F += ">";
                        z.push(F);
                        z = z.concat(E);
                        z.push("  </testsuite>");
                        z.push("</testsuites>");
                        return { failures: q, content: z.join("\n") } }, getPageSpaceid: function(A) {
                        var z, v, w, u, r, t, s, y, x = /^\d+$/,
                            q = A.getComponentsByType("doc");
                        if (q[0] && typeof q[0].body === "string" && q[0].body.length > 0) { z = q[0].body;
                            v = ["%2fE%3d", "/S=", "SpaceID=", "?f=", " sid="];
                            w = ["%2fR%3d", ":", " ", "&", " "];
                            for (u = 0; u < v.length; u += 1) { r = v[u];
                                if (-1 !== z.indexOf(r)) { t = z.indexOf(r) + r.length;
                                    s = z.indexOf(w[u], t);
                                    if (-1 !== s && (s - t) < 15) { y = z.substring(t, s);
                                        if (x.test(y)) {
                                            return y } } } } }
                        return "" }, loadCSS: function(q, r) {
                        var s;
                        if (!r) { YSLOW.util.dump("YSLOW.util.loadCSS: doc is not specified");
                            return "" }
                        s = r.createElement("link");
                        s.rel = "stylesheet";
                        s.type = "text/css";
                        s.href = q;
                        r.body.appendChild(s);
                        return s }, openLink: function(q) {
                        if (YSLOW.util.Preference.getPref("browser.link.open_external") === 3) { gBrowser.selectedTab = gBrowser.addTab(q) } else { window.open(q, " blank") } }, smushIt: function(s, v) {
                        var u, q = this.getSmushUrl(),
                            r = q + "/ws.php?img=" + encodeURIComponent(s),
                            t = YSLOW.util.getXHR();
                        t.open("GET", r, true);
                        t.onreadystatechange = function(w) { u = (w ? w.target : t);
                            if (u.readyState === 4) { v(JSON.parse(u.responseText)) } };
                        t.send(null) }, getSmushUrl: function() {
                        var q = "http://www.smushit.com/ysmush.it";
                        return YSLOW.util.Preference.getPref("smushItURL", q) + "/" }, getNewDoc: function() {
                        var r = null,
                            q = new XMLHttpRequest();
                        getBrowser().selectedTab = getBrowser().addTab("about:blank");
                        r = window;
                        q.open("get", "about:blank", false);
                        q.overrideMimeType("text/html");
                        q.send(null);
                        return r.content.document }, makeAbsoluteUrl: function(q, r) {
                        var u, t, s, v;
                        if (typeof q === "string" && r) { u = r.indexOf("://");
                            v = r.slice(0, 4);
                            if (q.indexOf("://") < 0 && (v === "http" || v === "file")) {
                                if (q.slice(0, 1) === "/") { t = r.indexOf("/", u + 3);
                                    if (t > -1) { q = r.slice(0, t) + q } else { q = r + q } } else { s = r.lastIndexOf("/");
                                    if (s > u + 3) { q = r.slice(0, s + 1) + q } else { q = r + "/" + q } } } }
                        return q }, preventDefault: function(q) {
                        if (typeof q.preventDefault === "function") { q.preventDefault() } else { q.returnValue = false } }, trim: function(q) {
                        try {
                            return (q && q.trim) ? q.trim() : q.replace(/^\s+|\s+$/g, "") } catch (r) {
                            return q } }, addEventListener: function(s, t, r) {
                        var q = YSLOW.util;
                        if (s.addEventListener) { q.addEventListener = function(v, w, u) { v.addEventListener(w, u, false) } } else {
                            if (s.attachEvent) { q.addEventListener = function(v, w, u) { v.attachEvent("on" + w, u) } } else { q.addEventListener = function(v, w, u) { v["on" + w] = u } } }
                        q.addEventListener(s, t, r) }, removeEventListener: function(s, t, r) {
                        var q = YSLOW.util;
                        if (s.removeEventListener) { q.removeEventListener = function(v, w, u) { v.removeEventListener(w, u, false) } } else {
                            if (s.detachEvent) { q.removeEventListener = function(v, w, u) { v.detachEvent("on" + w, u) } } else { q.removeEventListener = function(v, w, u) { delete v["on" + w] } } }
                        q.removeEventListener(s, t, r) }, getCurrentTarget: function(q) {
                        return q.currentTarget || q.srcElement }, getTarget: function(q) {
                        return q.target || q.srcElement }, getInlineTags: function(v, t, r) {
                        var u, q, s = function(C, y, x) {
                            var A, w, z, B, D = [];
                            if (!C) {
                                return D }
                            z = C.getElementsByTagName(y);
                            for (A = 0, w = z.length; A < w; A += 1) { B = z[A];
                                if (!B.src) { D.push({ contentNode: x, body: B.innerHTML }) } }
                            return D };
                        t = t || (v && v.getElementsByTagName("head")[0]);
                        r = r || (v && v.getElementsByTagName("body")[0]);
                        u = s(t, "style", "head");
                        u = u.concat(s(r, "style", "body"));
                        q = s(t, "script", "head");
                        q = q.concat(s(r, "script", "body"));
                        return { styles: u, scripts: q } }, countDOMElements: function(q) {
                        return (q && q.getElementsByTagName("*").length) || 0 }, getDocCookies: function(q) {
                        return (q && q.cookie) || "" }, setInjected: function(A, t, y) {
                        var w, z, v, u, q, x, B, s, r = {};
                        if (!y) {
                            return t }
                        if (typeof A.createElement === "function") { s = A.createElement("div");
                            s.innerHTML = y } else { s = A }
                        v = s.getElementsByTagName("script");
                        for (w = 0, z = v.length; w < z; w += 1) { u = v[w];
                            q = u.src || u.getAttribute("src");
                            if (q) { r[q] = { defer: u.defer || u.getAttribute("defer"), async: u.async || u.getAttribute("async") } } }
                        v = s.getElementsByTagName("link");
                        for (w = 0, z = v.length; w < z; w += 1) { u = v[w];
                            q = u.href || u.getAttribute("href");
                            if (q && (u.rel === "stylesheet" || u.type === "text/css")) { r[q] = 1 } }
                        v = s.getElementsByTagName("iframe");
                        for (w = 0, z = v.length; w < z; w += 1) { u = v[w];
                            q = u.src || u.getAttribute("src");
                            if (q) { r[q] = 1 } }
                        v = s.getElementsByTagName("embed");
                        for (w = 0, z = v.length; w < z; w += 1) { u = v[w];
                            q = u.src || u.getAttribute("src");
                            if (q) { r[q] = 1 } }
                        v = s.getElementsByTagName("param");
                        for (w = 0, z = v.length; w < z; w += 1) { u = v[w];
                            q = u.value || u.getAttribute("value");
                            if (q) { r[q] = 1 } }
                        v = s.getElementsByTagName("img");
                        for (w = 0, z = v.length; w < z; w += 1) { u = v[w];
                            q = u.src || u.getAttribute("src");
                            if (q) { r[q] = 1 } }
                        for (w = 0, z = t.length; w < z; w += 1) { x = t[w];
                            if (x.type === "js" || x.type === "css" || x.type === "flash" || x.type === "flash" || x.type === "image") { B = r[x.url];
                                x.injected = !B;
                                if (x.type === "js" && B) { x.defer = B.defer;
                                    x.async = B.async } } }
                        return t }, setTimer: function(r, q) { setTimeout(r, q) } };
                YSLOW.util.event = { subscribers: {}, addListener: function(q, u, s) {
                        var r = this.subscribers,
                            t = r[q];
                        if (!t) { t = r[q] = [] }
                        t.push({ callback: u, that: s }) }, removeListener: function(r, u) {
                        var s, t = this.subscribers[r],
                            q = (t && t.length) || 0;
                        for (s = 0; s < q; s += 1) {
                            if (t[s].callback === u) { t.splice(s, 1);
                                return true } }
                        return false }, fire: function(t, u) {
                        var q, r;
                        if (typeof this.subscribers[t] === "undefined") {
                            return false }
                        for (q = 0; q < this.subscribers[t].length; q += 1) { r = this.subscribers[t][q];
                            try { r.callback.call(r.that, u) } catch (s) {} }
                        return true } };
                YSLOW.util.Preference = { nativePref: null, registerNative: function(q) { this.nativePref = q }, getPref: function(r, q) {
                        if (this.nativePref) {
                            return this.nativePref.getPref(r, q) }
                        return q }, getPrefList: function(r, q) {
                        if (this.nativePref) {
                            return this.nativePref.getPrefList(r, q) }
                        return q }, setPref: function(q, r) {
                        if (this.nativePref) { this.nativePref.setPref(q, r) } }, deletePref: function(q) {
                        if (this.nativePref) { this.nativePref.deletePref(q) } } };
                YSLOW.doc = { tools_desc: undefined, view_names: {}, splash: {}, rules: {}, tools: {}, components_legend: {}, addRuleInfo: function(s, q, r) {
                        if (typeof s === "string" && typeof q === "string" && typeof r === "string") { this.rules[s] = { name: q, info: r } } }, addToolInfo: function(s, q, r) {
                        if (typeof s === "string" && typeof q === "string" && typeof r === "string") { this.tools[s] = { name: q, info: r } } } };
                YSLOW.doc.addRuleInfo("ynumreq", "Make fewer HTTP requests", "Decreasing the number of components on a page reduces the number of HTTP requests required to render the page, resulting in faster page loads.  Some ways to reduce the number of components include:  combine files, combine multiple scripts into one script, combine multiple CSS files into one style sheet, and use CSS Sprites and image maps.");
                YSLOW.doc.addRuleInfo("ycdn", "Use a Content Delivery Network (CDN)", "User proximity to web servers impacts response times.  Deploying content across multiple geographically dispersed servers helps users perceive that pages are loading faster.");
                YSLOW.doc.addRuleInfo("yexpires", "Add Expires headers", "Web pages are becoming increasingly complex with more scripts, style sheets, images, and Flash on them.  A first-time visit to a page may require several HTTP requests to load all the components.  By using Expires headers these components become cacheable, which avoids unnecessary HTTP requests on subsequent page views.  Expires headers are most often associated with images, but they can and should be used on all page components including scripts, style sheets, and Flash.");
                YSLOW.doc.addRuleInfo("ycompress", "Compress components with gzip", "Compression reduces response times by reducing the size of the HTTP response.  Gzip is the most popular and effective compression method currently available and generally reduces the response size by about 70%.  Approximately 90% of today's Internet traffic travels through browsers that claim to support gzip.");
                YSLOW.doc.addRuleInfo("ycsstop", "Put CSS at top", "Moving style sheets to the document HEAD element helps pages appear to load quicker since this allows pages to render progressively.");
                YSLOW.doc.addRuleInfo("yjsbottom", "Put JavaScript at bottom", "JavaScript scripts block parallel downloads; that is, when a script is downloading, the browser will not start any other downloads.  To help the page load faster, move scripts to the bottom of the page if they are deferrable.");
                YSLOW.doc.addRuleInfo("yexpressions", "Avoid CSS expressions", "CSS expressions (supported in IE beginning with Version 5) are a powerful, and dangerous, way to dynamically set CSS properties.  These expressions are evaluated frequently:  when the page is rendered and resized, when the page is scrolled, and even when the user moves the mouse over the page.  These frequent evaluations degrade the user experience.");
                YSLOW.doc.addRuleInfo("yexternal", "Make JavaScript and CSS external", "Using external JavaScript and CSS files generally produces faster pages because the files are cached by the browser.  JavaScript and CSS that are inlined in HTML documents get downloaded each time the HTML document is requested.  This reduces the number of HTTP requests but increases the HTML document size.  On the other hand, if the JavaScript and CSS are in external files cached by the browser, the HTML document size is reduced without increasing the number of HTTP requests.");
                YSLOW.doc.addRuleInfo("ydns", "Reduce DNS lookups", "The Domain Name System (DNS) maps hostnames to IP addresses, just like phonebooks map people's names to their phone numbers.  When you type URL www.yahoo.com into the browser, the browser contacts a DNS resolver that returns the server's IP address.  DNS has a cost; typically it takes 20 to 120 milliseconds for it to look up the IP address for a hostname.  The browser cannot download anything from the host until the lookup completes.");
                YSLOW.doc.addRuleInfo("yminify", "Minify JavaScript and CSS", "Minification removes unnecessary characters from a file to reduce its size, thereby improving load times.  When a file is minified, comments and unneeded white space characters (space, newline, and tab) are removed.  This improves response time since the size of the download files is reduced.");
                YSLOW.doc.addRuleInfo("yredirects", "Avoid URL redirects", "URL redirects are made using HTTP status codes 301 and 302.  They tell the browser to go to another location.  Inserting a redirect between the user and the final HTML document delays everything on the page since nothing on the page can be rendered and no components can be downloaded until the HTML document arrives.");
                YSLOW.doc.addRuleInfo("ydupes", "Remove duplicate JavaScript and CSS", "Duplicate JavaScript and CSS files hurt performance by creating unnecessary HTTP requests (IE only) and wasted JavaScript execution (IE and Firefox).  In IE, if an external script is included twice and is not cacheable, it generates two HTTP requests during page loading.  Even if the script is cacheable, extra HTTP requests occur when the user reloads the page.  In both IE and Firefox, duplicate JavaScript scripts cause wasted time evaluating the same scripts more than once.  This redundant script execution happens regardless of whether the script is cacheable.");
                YSLOW.doc.addRuleInfo("yetags", "Configure entity tags (ETags)", "Entity tags (ETags) are a mechanism web servers and the browser use to determine whether a component in the browser's cache matches one on the origin server.  Since ETags are typically constructed using attributes that make them unique to a specific server hosting a site, the tags will not match when a browser gets the original component from one server and later tries to validate that component on a different server.");
                YSLOW.doc.addRuleInfo("yxhr", "Make AJAX cacheable", "One of AJAX's benefits is it provides instantaneous feedback to the user because it requests information asynchronously from the backend web server.  However, using AJAX does not guarantee the user will not wait for the asynchronous JavaScript and XML responses to return.  Optimizing AJAX responses is important to improve performance, and making the responses cacheable is the best way to optimize them.");
                YSLOW.doc.addRuleInfo("yxhrmethod", "Use GET for AJAX requests", "When using the XMLHttpRequest object, the browser implements POST in two steps:  (1) send the headers, and (2) send the data.  It is better to use GET instead of POST since GET sends the headers and the data together (unless there are many cookies).  IE's maximum URL length is 2 KB, so if you are sending more than this amount of data you may not be able to use GET.");
                YSLOW.doc.addRuleInfo("ymindom", "Reduce the number of DOM elements", "A complex page means more bytes to download, and it also means slower DOM access in JavaScript.  Reduce the number of DOM elements on the page to improve performance.");
                YSLOW.doc.addRuleInfo("yno404", "Avoid HTTP 404 (Not Found) error", 'Making an HTTP request and receiving a 404 (Not Found) error is expensive and degrades the user experience.  Some sites have helpful 404 messages (for example, "Did you mean ...?"), which may assist the user, but server resources are still wasted.');
                YSLOW.doc.addRuleInfo("ymincookie", "Reduce cookie size", "HTTP cookies are used for authentication, personalization, and other purposes.  Cookie information is exchanged in the HTTP headers between web servers and the browser, so keeping the cookie size small minimizes the impact on response time.");
                YSLOW.doc.addRuleInfo("ycookiefree", "Use cookie-free domains", "When the browser requests a static image and sends cookies with the request, the server ignores the cookies.  These cookies are unnecessary network traffic.  To workaround this problem, make sure that static components are requested with cookie-free requests by creating a subdomain and hosting them there.");
                YSLOW.doc.addRuleInfo("ynofilter", "Avoid AlphaImageLoader filter", "The IE-proprietary AlphaImageLoader filter attempts to fix a problem with semi-transparent true color PNG files in IE versions less than Version 7.  However, this filter blocks rendering and freezes the browser while the image is being downloaded.  Additionally, it increases memory consumption.  The problem is further multiplied because it is applied per element, not per image.");
                YSLOW.doc.addRuleInfo("yimgnoscale", "Do not scale images in HTML", "Web page designers sometimes set image dimensions by using the width and height attributes of the HTML image element.  Avoid doing this since it can result in images being larger than needed.  For example, if your page requires image myimg.jpg which has dimensions 240x720 but displays it with dimensions 120x360 using the width and height attributes, then the browser will download an image that is larger than necessary.");
                YSLOW.doc.addRuleInfo("yfavicon", "Make favicon small and cacheable", "A favicon is an icon associated with a web page; this icon resides in the favicon.ico file in the server's root.  Since the browser requests this file, it needs to be present; if it is missing, the browser returns a 404 error (see \"Avoid HTTP 404 (Not Found) error\" above).  Since favicon.ico resides in the server's root, each time the browser requests this file, the cookies for the server's root are sent.  Making the favicon small and reducing the cookie size for the server's root cookies improves performance for retrieving the favicon.  Making favicon.ico cacheable avoids frequent requests for it.");
                YSLOW.doc.addRuleInfo("yemptysrc", "Avoid empty src or href", "You may expect a browser to do nothing when it encounters an empty image src.  However, it is not the case in most browsers. IE makes a request to the directory in which the page is located; Safari, Chrome, Firefox 3 and earlier make a request to the actual page itself. This behavior could possibly corrupt user data, waste server computing cycles generating a page that will never be viewed, and in the worst case, cripple your servers by sending a large amount of unexpected traffic.");
                YSLOW.doc.tools_desc = "Click on the tool name to launch the tool.";
                YSLOW.doc.addToolInfo("jslint", "JSLint", "Run JSLint on all JavaScript code in this document");
                YSLOW.doc.addToolInfo("alljs", "All JS", "Show all JavaScript code in this document");
                YSLOW.doc.addToolInfo("jsbeautified", "All JS Beautified", "Show all JavaScript code in this document in an easy to read format");
                YSLOW.doc.addToolInfo("jsminified", "All JS Minified", "Show all JavaScript code in this document in a minified (no comments or white space) format");
                YSLOW.doc.addToolInfo("allcss", "All CSS", "Show all CSS code in this document");
                YSLOW.doc.addToolInfo("cssmin", "YUI CSS Compressor", "Show all CSS code in the document in a minified format");
                YSLOW.doc.addToolInfo("smushItAll", "All Smush.it&trade;", "Run Smush.it&trade; on all image components in this document");
                YSLOW.doc.addToolInfo("printableview", "Printable View", "Show a printable view of grades, component lists, and statistics");
                YSLOW.doc.splash.title = "Grade your web pages with YSlow";
                YSLOW.doc.splash.content = { header: "YSlow gives you:", text: "<ul><li>Grade based on the performance of the page (you can define your own ruleset)</li><li>Summary of the page components</li><li>Chart with statistics</li><li>Tools for analyzing performance, including Smush.it&trade; and JSLint</li></ul>" };
                YSLOW.doc.splash.more_info = "Learn more about YSlow and the Yahoo! Developer Network";
                YSLOW.doc.rulesettings_desc = "Choose which ruleset (YSlow V2, Classic V1, or Small Site/Blog) best fits your specific needs.  Or create a new set and click Save as... to save it.";
                YSLOW.doc.components_legend.beacon = "type column indicates the component is loaded after window onload event";
                YSLOW.doc.components_legend.after_onload = "denotes 1x1 pixels image that may be image beacon";
                YSLOW.doc.view_names = { grade: "Grade", components: "Components", stats: "Statistics", tools: "Tools", rulesetedit: "Rule Settings" };
                YSLOW.doc.copyright = "Copyright &copy; " + (new Date()).getFullYear() + " Yahoo! Inc. All rights reserved.";
                YSLOW.registerRule({ id: "ynumreq", url: "http://developer.yahoo.com/performance/rules.html#num_http", category: ["content"], config: { max_js: 3, points_js: 4, max_css: 2, points_css: 4, max_cssimages: 6, points_cssimages: 3 }, lint: function(v, x, q) {
                        var u = x.getComponentsByType("js").length - q.max_js,
                            r = x.getComponentsByType("css").length - q.max_css,
                            t = x.getComponentsByType("cssimage").length - q.max_cssimages,
                            w = 100,
                            s = [];
                        if (u > 0) { w -= u * q.points_js;
                            s[s.length] = "This page has " + YSLOW.util.plural("%num% external Javascript script%s%", (u + q.max_js)) + ".  Try combining them into one." }
                        if (r > 0) { w -= r * q.points_css;
                            s[s.length] = "This page has " + YSLOW.util.plural("%num% external stylesheet%s%", (r + q.max_css)) + ".  Try combining them into one." }
                        if (t > 0) { w -= t * q.points_cssimages;
                            s[s.length] = "This page has " + YSLOW.util.plural("%num% external background image%s%", (t + q.max_cssimages)) + ".  Try combining them with CSS sprites." }
                        return { score: w, message: s.join("\n"), components: [] } } });
                YSLOW.registerRule({ id: "ycdn", url: "http://developer.yahoo.com/performance/rules.html#cdn", category: ["server"], config: { points: 10, patterns: ["^([^\\.]*)\\.([^\\.]*)\\.yimg\\.com/[^/]*\\.yimg\\.com/.*$", "^([^\\.]*)\\.([^\\.]*)\\.yimg\\.com/[^/]*\\.yahoo\\.com/.*$", "^sec.yimg.com/", "^a248.e.akamai.net", "^[dehlps].yimg.com", "^(ads|cn|mail|maps|s1).yimg.com", "^[\\d\\w\\.]+.yimg.com", "^a.l.yimg.com", "^us.(js|a)2.yimg.com", "^yui.yahooapis.com", "^adz.kr.yahoo.com", "^img.yahoo.co.kr", "^img.(shopping|news|srch).yahoo.co.kr", "^pimg.kr.yahoo.com", "^kr.img.n2o.yahoo.com", "^s3.amazonaws.com", "^(www.)?google-analytics.com", ".cloudfront.net", ".ak.fbcdn.net", "platform.twitter.com", "cdn.api.twitter.com", "apis.google.com", ".akamaihd.net", ".rackcdn.com"], exceptions: ["^chart.yahoo.com", "^(a1|f3|f5|f3c|f5c).yahoofs.com", "^us.(a1c|f3).yahoofs.com"], servers: ["cloudflare-nginx"], types: ["js", "css", "image", "cssimage", "flash", "favicon"] }, lint: function(Q, v, P) {
                        var I, G, u, F, w, A, M, K, N, O, t, s, J = 100,
                            r = [],
                            L = [],
                            z = "",
                            q = YSLOW.util,
                            E = q.plural,
                            x = q.kbSize,
                            y = q.getHostname,
                            D = y(v.doc_comp.url),
                            C = v.getComponentsByType(P.types),
                            B = q.Preference.getPref("cdnHostnames", ""),
                            H = q.Preference.nativePref;
                        if (B) { B = B.split(",") }
                        for (I = 0, K = C.length; I < K; I += 1) { O = C[I];
                            u = O.url;
                            A = y(u);
                            s = O.headers;
                            if (O.type === "favicon" && A === D) {
                                continue }
                            w = s["x-cdn"] || s["x-amz-cf-id"] || s["x-edge-location"] || s["powered-by-chinacache"];
                            if (w) {
                                continue }
                            t = P.patterns;
                            for (G = 0, N = t.length; G < N; G += 1) { F = new RegExp(t[G]);
                                if (F.test(A)) { w = 1;
                                    break } }
                            if (B) {
                                for (G = 0, N = B.length; G < N; G += 1) { F = new RegExp(q.trim(B[G]));
                                    if (F.test(A)) { w = 1;
                                        break } } }
                            if (!w) { t = P.servers;
                                for (G = 0, N = t.length; G < N; G += 1) { F = new RegExp(t[G]);
                                    if (F.test(s.server)) { w = 1;
                                        break } }
                                if (!w) { t = P.exceptions;
                                    for (G = 0, N = t.length; G < N; G += 1) { F = new RegExp(t[G]);
                                        if (F.test(A)) { L.push(O);
                                            w = 1;
                                            break } }
                                    if (!w) { r.push(O) } } } }
                        J -= r.length * P.points;
                        r.concat(L);
                        if (r.length > 0) { z = E("There %are% %num% static component%s% that %are% not on CDN. ", r.length) }
                        if (L.length > 0) { z += E("There %are% %num% component%s% that %are% not on CDN, but %are% exceptions:", L.length) + "<ul>";
                            for (I = 0, K = r.length; I < K; I += 1) { z += "<li>" + q.prettyAnchor(L[I].url, L[I].url, null, true, 120, null, L[I].type) + "</li>" }
                            z += "</ul>" }
                        if (B) { z += "<p>Using these CDN hostnames from your preferences: " + B + "</p>" } else { z += "<p>You can specify CDN hostnames in your preferences. See <a href=\"javascript:document.ysview.openLink('https://github.com/marcelduran/yslow/wiki/FAQ#wiki-faq_cdn')\">YSlow FAQ</a> for details.</p>" }
                        if (r.length) { r = q.summaryByDomain(r, ["size", "size_compressed"], true);
                            for (I = 0, K = r.length; I < K; I += 1) { M = r[I];
                                r[I] = M.domain + ": " + E("%num% component%s%, ", M.count) + x(M.sum_size) + (M.sum_size_compressed > 0 ? " (" + x(M.sum_size_compressed) + " GZip)" : "") + (H ? (" <button onclick=\"javascript:document.ysview.addCDN('" + M.domain + "')\">Add as CDN</button>") : "") } }
                        return { score: J, message: z, components: r } } });
                YSLOW.registerRule({ id: "yexpires", url: "http://developer.yahoo.com/performance/rules.html#expires", category: ["server"], config: { points: 11, howfar: 172800, types: ["css", "js", "image", "cssimage", "flash", "favicon"] }, lint: function(y, A, r) {
                        var x, t, z, s, w, u = parseInt(r.howfar, 10) * 1000,
                            v = [],
                            q = A.getComponentsByType(r.types);
                        for (t = 0, w = q.length; t < w; t += 1) { z = q[t].expires;
                            if (typeof z === "object" && typeof z.getTime === "function") { x = new Date().getTime();
                                if (z.getTime() > x + u) {
                                    continue } }
                            v.push(q[t]) }
                        s = 100 - v.length * parseInt(r.points, 10);
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% static component%s%", v.length) + " without a far-future expiration date." : "", components: v } } });
                YSLOW.registerRule({ id: "ycompress", url: "http://developer.yahoo.com/performance/rules.html#gzip", category: ["server"], config: { min_filesize: 500, types: ["doc", "iframe", "xhr", "js", "css"], points: 11 }, lint: function(x, y, r) {
                        var t, w, s, u, v = [],
                            q = y.getComponentsByType(r.types);
                        for (t = 0, w = q.length; t < w; t += 1) { u = q[t];
                            if (u.compressed || u.size < 500) {
                                continue }
                            v.push(u) }
                        s = 100 - v.length * parseInt(r.points, 10);
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% plain text component%s%", v.length) + " that should be sent compressed" : "", components: v } } });
                YSLOW.registerRule({ id: "ycsstop", url: "http://developer.yahoo.com/performance/rules.html#css_top", category: ["css"], config: { points: 10 }, lint: function(x, y, r) {
                        var t, w, s, u, q = y.getComponentsByType("css"),
                            v = [];
                        for (t = 0, w = q.length; t < w; t += 1) { u = q[t];
                            if (u.containerNode === "body") { v.push(u) } }
                        s = 100;
                        if (v.length > 0) { s -= 1 + v.length * parseInt(r.points, 10) }
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% stylesheet%s%", v.length) + " found in the body of the document" : "", components: v } } });
                YSLOW.registerRule({ id: "yjsbottom", url: "http://developer.yahoo.com/performance/rules.html#js_bottom", category: ["javascript"], config: { points: 5 }, lint: function(x, y, r) {
                        var t, w, u, s, v = [],
                            q = y.getComponentsByType("js");
                        for (t = 0, w = q.length; t < w; t += 1) { u = q[t];
                            if (u.containerNode === "head" && !u.injected && (!u.defer || !u.async)) { v.push(u) } }
                        s = 100 - v.length * parseInt(r.points, 10);
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% JavaScript script%s%", v.length) + " found in the head of the document" : "", components: v } } });
                YSLOW.registerRule({ id: "yexpressions", url: "http://developer.yahoo.com/performance/rules.html#css_expressions", category: ["css"], config: { points: 2 }, lint: function(y, B, r) {
                        var t, w, A, u, z = (B.inline && B.inline.styles) || [],
                            q = B.getComponentsByType("css"),
                            v = [],
                            s = 100,
                            x = 0;
                        for (t = 0, w = q.length; t < w; t += 1) { u = q[t];
                            if (typeof u.expr_count === "undefined") { A = YSLOW.util.countExpressions(u.body);
                                u.expr_count = A } else { A = u.expr_count }
                            if (A > 0) { u.yexpressions = YSLOW.util.plural("%num% expression%s%", A);
                                x += A;
                                v.push(u) } }
                        for (t = 0, w = z.length; t < w; t += 1) { A = YSLOW.util.countExpressions(z[t].body);
                            if (A > 0) { v.push("inline &lt;style&gt; tag #" + (t + 1) + " (" + YSLOW.util.plural("%num% expression%s%", A) + ")");
                                x += A } }
                        if (x > 0) { s = 90 - x * r.points }
                        return { score: s, message: x > 0 ? "There is a total of " + YSLOW.util.plural("%num% expression%s%", x) : "", components: v } } });
                YSLOW.registerRule({ id: "yexternal", url: "http://developer.yahoo.com/performance/rules.html#external", category: ["javascript", "css"], config: {}, lint: function(v, x, r) {
                        var t, u = x.inline,
                            s = (u && u.styles) || [],
                            q = (u && u.scripts) || [],
                            w = [];
                        if (s.length) { t = YSLOW.util.plural("There is a total of %num% inline css", s.length);
                            w.push(t) }
                        if (q.length) { t = YSLOW.util.plural("There is a total of %num% inline script%s%", q.length);
                            w.push(t) }
                        return { score: "n/a", message: "Only consider this if your property is a common user home page.", components: w } } });
                YSLOW.registerRule({ id: "ydns", url: "http://developer.yahoo.com/performance/rules.html#dns_lookups", category: ["content"], config: { max_domains: 4, points: 5 }, lint: function(y, A, q) {
                        var t, v, s, u = YSLOW.util,
                            w = u.kbSize,
                            x = u.plural,
                            r = 100,
                            z = u.summaryByDomain(A.components, ["size", "size_compressed"], true);
                        if (z.length > q.max_domains) { r -= (z.length - q.max_domains) * q.points }
                        if (z.length) {
                            for (t = 0, v = z.length; t < v; t += 1) { s = z[t];
                                z[t] = s.domain + ": " + x("%num% component%s%, ", s.count) + w(s.sum_size) + (s.sum_size_compressed > 0 ? " (" + w(s.sum_size_compressed) + " GZip)" : "") } }
                        return { score: r, message: (z.length > q.max_domains) ? x("The components are split over more than %num% domain%s%", q.max_domains) : "", components: z } } });
                YSLOW.registerRule({ id: "yminify", url: "http://developer.yahoo.com/performance/rules.html#minify", category: ["javascript", "css"], config: { points: 10, types: ["js", "css"] }, lint: function(A, C, r) {
                        var u, x, s, z, v, y = C.inline,
                            B = (y && y.styles) || [],
                            t = (y && y.scripts) || [],
                            q = C.getComponentsByType(r.types),
                            w = [];
                        for (u = 0, x = q.length; u < x; u += 1) { v = q[u];
                            if (typeof v.minified === "undefined") { z = YSLOW.util.isMinified(v.body);
                                v.minified = z } else { z = v.minified }
                            if (!z) { w.push(v) } }
                        for (u = 0, x = B.length; u < x; u += 1) {
                            if (!YSLOW.util.isMinified(B[u].body)) { w.push("inline &lt;style&gt; tag #" + (u + 1)) } }
                        for (u = 0, x = t.length; u < x; u += 1) {
                            if (!YSLOW.util.isMinified(t[u].body)) { w.push("inline &lt;script&gt; tag #" + (u + 1)) } }
                        s = 100 - w.length * r.points;
                        return { score: s, message: (w.length > 0) ? YSLOW.util.plural("There %are% %num% component%s% that can be minified", w.length) : "", components: w } } });
                YSLOW.registerRule({ id: "yredirects", url: "http://developer.yahoo.com/performance/rules.html#redirects", category: ["content"], config: { points: 10 }, lint: function(y, z, r) {
                        var u, x, v, s, w = [],
                            t = YSLOW.util.briefUrl,
                            q = z.getComponentsByType("redirect");
                        for (u = 0, x = q.length; u < x; u += 1) { v = q[u];
                            w.push(t(v.url, 80) + " redirects to " + t(v.headers.location, 60)) }
                        s = 100 - q.length * parseInt(r.points, 10);
                        return { score: s, message: (q.length > 0) ? YSLOW.util.plural("There %are% %num% redirect%s%", q.length) : "", components: w } } });
                YSLOW.registerRule({ id: "ydupes", url: "http://developer.yahoo.com/performance/rules.html#js_dupes", category: ["javascript", "css"], config: { points: 5, types: ["js", "css"] }, lint: function(y, z, s) {
                        var v, q, t, x, u = {},
                            w = [],
                            r = z.getComponentsByType(s.types);
                        for (v = 0, x = r.length; v < x; v += 1) { q = r[v].url;
                            if (typeof u[q] === "undefined") { u[q] = { count: 1, compindex: v } } else { u[q].count += 1 } }
                        for (v in u) {
                            if (u.hasOwnProperty(v) && u[v].count > 1) { w.push(r[u[v].compindex]) } }
                        t = 100 - w.length * parseInt(s.points, 10);
                        return { score: t, message: (w.length > 0) ? YSLOW.util.plural("There %are% %num% duplicate component%s%", w.length) : "", components: w } } });
                YSLOW.registerRule({ id: "yetags", url: "http://developer.yahoo.com/performance/rules.html#etags", category: ["server"], config: { points: 11, types: ["flash", "js", "css", "cssimage", "image", "favicon"] }, lint: function(y, z, r) {
                        var t, w, s, u, x, v = [],
                            q = z.getComponentsByType(r.types);
                        for (t = 0, w = q.length; t < w; t += 1) { u = q[t];
                            x = u.headers && u.headers.etag;
                            if (x && !YSLOW.util.isETagGood(x)) { v.push(u) } }
                        s = 100 - v.length * parseInt(r.points, 10);
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% component%s% with misconfigured ETags", v.length) : "", components: v } } });
                YSLOW.registerRule({ id: "yxhr", url: "http://developer.yahoo.com/performance/rules.html#cacheajax", category: ["content"], config: { points: 5, min_cache_time: 3600 }, lint: function(y, A, r) {
                        var u, z, x, s, w, t = parseInt(r.min_cache_time, 10) * 1000,
                            v = [],
                            q = A.getComponentsByType("xhr");
                        for (u = 0; u < q.length; u += 1) { w = q[u].headers["cache-control"];
                            if (w) {
                                if (w.indexOf("no-cache") !== -1 || w.indexOf("no-store") !== -1) {
                                    continue } }
                            z = q[u].expires;
                            if (typeof z === "object" && typeof z.getTime === "function") { x = new Date().getTime();
                                if (z.getTime() > x + t) {
                                    continue } }
                            v.push(q[u]) }
                        s = 100 - v.length * parseInt(r.points, 10);
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% XHR component%s% that %are% not cacheable", v.length) : "", components: v } } });
                YSLOW.registerRule({ id: "yxhrmethod", url: "http://developer.yahoo.com/performance/rules.html#ajax_get", category: ["server"], config: { points: 5 }, lint: function(s, w, q) {
                        var r, t, v = [],
                            u = w.getComponentsByType("xhr");
                        for (r = 0; r < u.length; r += 1) {
                            if (typeof u[r].method === "string") {
                                if (u[r].method !== "GET" && u[r].method !== "unknown") { v.push(u[r]) } } }
                        t = 100 - v.length * parseInt(q.points, 10);
                        return { score: t, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% XHR component%s% that %do% not use GET HTTP method", v.length) : "", components: v } } });
                YSLOW.registerRule({ id: "ymindom", url: "http://developer.yahoo.com/performance/rules.html#min_dom", category: ["content"], config: { range: 250, points: 10, maxdom: 900 }, lint: function(s, u, r) {
                        var q = u.domElementsCount,
                            t = 100;
                        if (q > r.maxdom) { t = 99 - Math.ceil((q - parseInt(r.maxdom, 10)) / parseInt(r.range, 10)) * parseInt(r.points, 10) }
                        return { score: t, message: (q > r.maxdom) ? YSLOW.util.plural("There %are% %num% DOM element%s% on the page", q) : "", components: [] } } });
                YSLOW.registerRule({ id: "yno404", url: "http://developer.yahoo.com/performance/rules.html#no404", category: ["content"], config: { points: 5, types: ["css", "js", "image", "cssimage", "flash", "xhr", "favicon"] }, lint: function(x, y, r) {
                        var t, w, u, s, v = [],
                            q = y.getComponentsByType(r.types);
                        for (t = 0, w = q.length; t < w; t += 1) { u = q[t];
                            if (parseInt(u.status, 10) === 404) { v.push(u) } }
                        s = 100 - v.length * parseInt(r.points, 10);
                        return { score: s, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% request%s% that %are% 404 Not Found", v.length) : "", components: v } } });
                YSLOW.registerRule({ id: "ymincookie", url: "http://developer.yahoo.com/performance/rules.html#cookie_size", category: ["cookie"], config: { points: 10, max_cookie_size: 1000 }, lint: function(u, x, r) {
                        var w, t = x.cookies,
                            q = (t && t.length) || 0,
                            s = "",
                            v = 100;
                        if (q > r.max_cookie_size) { w = Math.floor(q / r.max_cookie_size);
                            v -= 1 + w * parseInt(r.points, 10);
                            s = YSLOW.util.plural("There %are% %num% byte%s% of cookies on this page", q) }
                        return { score: v, message: s, components: [] } } });
                YSLOW.registerRule({ id: "ycookiefree", url: "http://developer.yahoo.com/performance/rules.html#cookie_free", category: ["cookie"], config: { points: 5, types: ["js", "css", "image", "cssimage", "flash", "favicon"] }, lint: function(A, B, t) {
                        var v, z, u, x, q, y = [],
                            s = YSLOW.util.getHostname,
                            w = s(B.doc_comp.url),
                            r = B.getComponentsByType(t.types);
                        for (v = 0, z = r.length; v < z; v += 1) { x = r[v];
                            if (x.type === "favicon" && s(x.url) === w) {
                                continue }
                            q = x.cookie;
                            if (typeof q === "string" && q.length) { y.push(r[v]) } }
                        u = 100 - y.length * parseInt(t.points, 10);
                        return { score: u, message: (y.length > 0) ? YSLOW.util.plural("There %are% %num% component%s% that %are% not cookie-free", y.length) : "", components: y } } });
                YSLOW.registerRule({ id: "ynofilter", url: "http://developer.yahoo.com/performance/rules.html#no_filters", category: ["css"], config: { points: 5, halfpoints: 2 }, lint: function(B, E, s) {
                        var u, y, t, v, A, x, D, C = (E.inline && E.inline.styles) || [],
                            r = E.getComponentsByType("css"),
                            w = [],
                            q = 0,
                            z = 0;
                        for (u = 0, y = r.length; u < y; u += 1) { v = r[u];
                            if (typeof v.filter_count === "undefined") { D = YSLOW.util.countAlphaImageLoaderFilter(v.body);
                                v.filter_count = D } else { D = v.filter_count }
                            x = 0;
                            for (A in D) {
                                if (D.hasOwnProperty(A)) {
                                    if (A === "hackFilter") { z += D[A];
                                        x += D[A] } else { q += D[A];
                                        x += D[A] } } }
                            if (x > 0) { r[u].yfilters = YSLOW.util.plural("%num% filter%s%", x);
                                w.push(r[u]) } }
                        for (u = 0, y = C.length; u < y; u += 1) { D = YSLOW.util.countAlphaImageLoaderFilter(C[u].body);
                            x = 0;
                            for (A in D) {
                                if (D.hasOwnProperty(A)) {
                                    if (A === "hackFilter") { z += D[A];
                                        x += D[A] } else { q += D[A];
                                        x += D[A] } } }
                            if (x > 0) { w.push("inline &lt;style&gt; tag #" + (u + 1) + " (" + YSLOW.util.plural("%num% filter%s%", x) + ")") } }
                        t = 100 - (q * s.points + z * s.halfpoints);
                        return { score: t, message: (q + z) > 0 ? "There is a total of " + YSLOW.util.plural("%num% filter%s%", q + z) : "", components: w } } });
                YSLOW.registerRule({ id: "yimgnoscale", url: "http://developer.yahoo.com/performance/rules.html#no_scale", category: ["images"], config: { points: 5 }, lint: function(s, x, q) {
                        var r, w, t, v = [],
                            u = x.getComponentsByType("image");
                        for (r = 0; r < u.length; r += 1) { w = u[r].object_prop;
                            if (w && typeof w.width !== "undefined" && typeof w.height !== "undefined" && typeof w.actual_width !== "undefined" && typeof w.actual_height !== "undefined") {
                                if (w.width < w.actual_width || w.height < w.actual_height) { v.push(u[r]) } } }
                        t = 100 - v.length * parseInt(q.points, 10);
                        return { score: t, message: (v.length > 0) ? YSLOW.util.plural("There %are% %num% image%s% that %are% scaled down", v.length) : "", components: v } } });
                YSLOW.registerRule({ id: "yfavicon", url: "http://developer.yahoo.com/performance/rules.html#favicon", category: ["images"], config: { points: 5, size: 2000, min_cache_time: 3600 }, lint: function(y, A, r) {
                        var x, z, w, t, s, v = [],
                            u = parseInt(r.min_cache_time, 10) * 1000,
                            q = A.getComponentsByType("favicon");
                        if (q.length) { w = q[0];
                            if (parseInt(w.status, 10) === 404) { v.push("Favicon was not found") }
                            if (w.size > r.size) { v.push(YSLOW.util.plural("Favicon is more than %num% bytes", r.size)) }
                            z = w.expires;
                            if (typeof z === "object" && typeof z.getTime === "function") { x = new Date().getTime();
                                s = z.getTime() >= x + u }
                            if (!s) { v.push("Favicon is not cacheable") } }
                        t = 100 - v.length * parseInt(r.points, 10);
                        return { score: t, message: (v.length > 0) ? v.join("\n") : "", components: [] } } });
                YSLOW.registerRule({ id: "yemptysrc", url: "http://developer.yahoo.com/performance/rules.html#emptysrc", category: ["server"], config: { points: 100 }, lint: function(x, A, r) {
                        var w, s, v, y = A.empty_url,
                            u = [],
                            t = [],
                            q = "",
                            z = parseInt(r.points, 10);
                        s = 100;
                        if (y) {
                            for (w in y) {
                                if (y.hasOwnProperty(w)) { v = y[w];
                                    s -= v * z;
                                    t.push(v + " " + w) } }
                            q = t.join(", ") + YSLOW.util.plural(" component%s% with empty link were found.", t.length) }
                        return { score: s, message: q, components: u } } });
                YSLOW.registerRuleset({ id: "ydefault", name: "YSlow(V2)", rules: { ynumreq: {}, ycdn: {}, yemptysrc: {}, yexpires: {}, ycompress: {}, ycsstop: {}, yjsbottom: {}, yexpressions: {}, yexternal: {}, ydns: {}, yminify: {}, yredirects: {}, ydupes: {}, yetags: {}, yxhr: {}, yxhrmethod: {}, ymindom: {}, yno404: {}, ymincookie: {}, ycookiefree: {}, ynofilter: {}, yimgnoscale: {}, yfavicon: {} }, weights: { ynumreq: 8, ycdn: 6, yemptysrc: 30, yexpires: 10, ycompress: 8, ycsstop: 4, yjsbottom: 4, yexpressions: 3, yexternal: 4, ydns: 3, yminify: 4, yredirects: 4, ydupes: 4, yetags: 2, yxhr: 4, yxhrmethod: 3, ymindom: 3, yno404: 4, ymincookie: 3, ycookiefree: 3, ynofilter: 4, yimgnoscale: 3, yfavicon: 2 } });
                YSLOW.registerRuleset({ id: "yslow1", name: "Classic(V1)", rules: { ynumreq: {}, ycdn: {}, yexpires: {}, ycompress: {}, ycsstop: {}, yjsbottom: {}, yexpressions: {}, yexternal: {}, ydns: {}, yminify: { types: ["js"], check_inline: false }, yredirects: {}, ydupes: { types: ["js"] }, yetags: {} }, weights: { ynumreq: 8, ycdn: 6, yexpires: 10, ycompress: 8, ycsstop: 4, yjsbottom: 4, yexpressions: 3, yexternal: 4, ydns: 3, yminify: 4, yredirects: 4, ydupes: 4, yetags: 2 } });
                YSLOW.registerRuleset({ id: "yblog", name: "Small Site or Blog", rules: { ynumreq: {}, yemptysrc: {}, ycompress: {}, ycsstop: {}, yjsbottom: {}, yexpressions: {}, ydns: {}, yminify: {}, yredirects: {}, ydupes: {}, ymindom: {}, yno404: {}, ynofilter: {}, yimgnoscale: {}, yfavicon: {} }, weights: { ynumreq: 8, yemptysrc: 30, ycompress: 8, ycsstop: 4, yjsbottom: 4, yexpressions: 3, ydns: 3, yminify: 4, yredirects: 4, ydupes: 4, ymindom: 3, yno404: 4, ynofilter: 4, yimgnoscale: 3, yfavicon: 2 } });
                YSLOW.ResultSet = function(s, r, q) { this.ruleset_applied = q;
                    this.overall_score = r;
                    this.results = s };
                YSLOW.ResultSet.prototype = { getResults: function() {
                        return this.results }, getRulesetApplied: function() {
                        return this.ruleset_applied }, getOverallScore: function() {
                        return this.overall_score } };
                YSLOW.view = function(r, w) {
                    var u, t, v, q, s;
                    this.panel_doc = r.document;
                    this.buttonViews = {};
                    this.curButtonId = "";
                    this.panelNode = r.panelNode;
                    this.loadCSS(this.panel_doc);
                    u = this.panel_doc.createElement("div");
                    u.id = "toolbarDiv";
                    u.innerHTML = this.getToolbarSource();
                    u.style.display = "block";
                    t = this.panel_doc.createElement("div");
                    t.style.display = "block";
                    v = '<div class="dialog-box"><h1><div class="dialog-text">text</div></h1><div class="dialog-more-text"></div><div class="buttons"><input class="dialog-left-button" type="button" value="Ok" onclick="javascript:document.ysview.closeDialog(document)"><input class="dialog-right-button" type="button" value="Cancel" onclick="javascript:document.ysview.closeDialog(document)"></div></div><div class="dialog-mask"></div>';
                    q = this.panel_doc.createElement("div");
                    q.id = "dialogDiv";
                    q.innerHTML = v;
                    q.style.display = "none";
                    this.modaldlg = q;
                    this.tooltip = new YSLOW.view.Tooltip(this.panel_doc, r.panelNode);
                    s = this.panel_doc.createElement("div");
                    s.id = "copyrightDiv";
                    s.innerHTML = YSLOW.doc.copyright;
                    this.copyright = s;
                    if (r.panelNode) { r.panelNode.id = "yslowDiv";
                        r.panelNode.appendChild(q);
                        r.panelNode.appendChild(u);
                        r.panelNode.appendChild(t);
                        r.panelNode.appendChild(s) }
                    this.viewNode = t;
                    this.viewNode.id = "viewDiv";
                    this.viewNode.className = "yui-skin-sam";
                    this.yscontext = w;
                    YSLOW.util.addEventListener(this.panelNode, "click", function(F) {
                        var A, B, z, G, C;
                        var E = FBL.getContentView(r.document);
                        var D = E.ysview.getElementByTagNameAndId(r.panelNode, "div", "toolbarDiv");
                        if (D) { B = E.ysview.getElementByTagNameAndId(D, "li", "helpLink");
                            if (B) { z = B.offsetLeft;
                                G = B.offsetTop;
                                C = B.offsetParent;
                                while (C) { z += C.offsetLeft;
                                    G += C.offsetTop;
                                    C = C.offsetParent }
                                if (F.clientX >= z && F.clientY >= G && F.clientX < z + B.offsetWidth && F.clientY < G + B.offsetHeight) {
                                    return } }
                            A = E.ysview.getElementByTagNameAndId(D, "div", "helpDiv") }
                        if (A && A.style.visibility === "visible") { A.style.visibility = "hidden" } });
                    YSLOW.util.addEventListener(this.panelNode, "scroll", function(z) {
                        var y = FBL.getContentView(r.document);
                        var x = y.ysview.modaldlg;
                        if (x && x.style.display === "block") { x.style.top = r.panelNode.scrollTop + "px";
                            x.style.left = r.panelNode.scrollLeft + "px" } });
                    YSLOW.util.addEventListener(this.panelNode, "mouseover", function(z) {
                        var y;
                        if (z.target && typeof z.target === "object") {
                            if (z.target.nodeName === "LABEL" && z.target.className === "rules") {
                                if (z.target.firstChild && z.target.firstChild.nodeName === "INPUT" && z.target.firstChild.type === "checkbox") { y = YSLOW.controller.getRule(z.target.firstChild.value);
                                    var x = FBL.getContentView(r.document);
                                    x.ysview.tooltip.show("<b>" + y.name + "</b><br><br>" + y.info, z.target) } } } });
                    YSLOW.util.addEventListener(this.panelNode, "mouseout", function(y) {
                        var x = FBL.getContentView(r.document);
                        x.ysview.tooltip.hide() });
                    YSLOW.util.addEventListener(this.panel_doc.defaultView || this.panel_doc.parentWindow, "resize", function(z) {
                        var y = FBL.getContentView(r.document);
                        var x = y.ysview.modaldlg;
                        if (x && x.style.display === "block") { x.style.display = "none" } }) };
                YSLOW.view.prototype = { setDocument: function(q) { this.panel_doc = q }, loadCSS: function() {}, addButtonView: function(q, s) {
                        var r = this.getButtonView(q);
                        if (!r) { r = this.panel_doc.createElement("div");
                            r.style.display = "none";
                            this.viewNode.appendChild(r);
                            this.buttonViews[q] = r }
                        r.innerHTML = s;
                        this.showButtonView(q) }, clearAllButtonView: function() {
                        var r = this.buttonViews,
                            s = this.viewNode,
                            q = function(t) {
                                if (r.hasOwnProperty(t)) { s.removeChild(r[t]);
                                    delete r[t] } };
                        q("ysPerfButton");
                        q("ysCompsButton");
                        q("ysStatsButton") }, showButtonView: function(r) {
                        var q, s = this.getButtonView(r);
                        if (!s) { YSLOW.util.dump("ERROR: YSLOW.view.showButtonView: Couldn't find ButtonView '" + r + "'.");
                            return }
                        for (q in this.buttonViews) {
                            if (this.buttonViews.hasOwnProperty(q) && q !== r) { this.buttonViews[q].style.display = "none" } }
                        if (r === "ysPerfButton") {
                            if (this.copyright) { this.copyright.style.display = "none" } } else {
                            if (this.curButtonId === "ysPerfButton") {
                                if (this.copyright) { this.copyright.style.display = "block" } } }
                        s.style.display = "block";
                        this.curButtonId = r }, getButtonView: function(q) {
                        return (this.buttonViews.hasOwnProperty(q) ? this.buttonViews[q] : undefined) }, setButtonView: function(q, s) {
                        var r = this.getButtonView(q);
                        if (!r) { YSLOW.util.dump("ERROR: YSLOW.view.setButtonView: Couldn't find ButtonView '" + q + "'.");
                            return }
                        r.innerHTML = s;
                        this.showButtonView(q) }, setSplashView: function(r, s, t) {
                        var w, v = "Grade your web pages with YSlow",
                            x = "YSlow gives you:",
                            u = "<li>Grade based on the performance (you can define your own rules)</li><li>Summary of the Components in the page</li><li>Chart with statistics</li><li>Tools including Smush.It and JSLint</li>",
                            q = "Learn more about YSlow and YDN";
                        if (YSLOW.doc.splash) {
                            if (YSLOW.doc.splash.title) { v = YSLOW.doc.splash.title }
                            if (YSLOW.doc.splash.content) {
                                if (YSLOW.doc.splash.content.header) { x = YSLOW.doc.splash.content.header }
                                if (YSLOW.doc.splash.content.text) { u = YSLOW.doc.splash.content.text } }
                            if (YSLOW.doc.splash.more_info) { q = YSLOW.doc.splash.more_info } }
                        if (typeof t !== "undefined") { YSLOW.hideToolsInfo = t } else { t = YSLOW.hideToolsInfo }
                        if (t) { u = u.replace(/<li>Tools[^<]+<\/li>/, "") }
                        w = '<div id="splashDiv"><div id="splashDivCenter"><b id="splashImg" width="250" height="150" alt="splash image" src="chrome://yslow/content/yslow/img/speedometer.png"></b><div id="left"><h2>' + v + '</h2><div id="content" class="padding50"><h3>' + x + '</h3><ul id="splashBullets">' + u + "</ul>";
                        if (typeof r !== "undefined") { YSLOW.hideAutoRun = r } else { r = YSLOW.hideAutoRun }
                        if (!r) { w += '<label><input type="checkbox" name="autorun" onclick="javascript:document.ysview.setAutorun(this.checked)" ';
                            if (YSLOW.util.Preference.getPref("extensions.yslow.autorun", false)) { w += "checked" }
                            w += "> Autorun YSlow each time a web page is loaded</label>" }
                        if (typeof s !== "undefined") { YSLOW.showAntiIframe = s } else { s = YSLOW.showAntiIframe }
                        if (s) { w += '<label><input type="checkbox" onclick="javascript:document.ysview.setAntiIframe(this.checked)"> Check here if the current page prevents itself from being embedded/iframed. A simpler post onload detection will be used instead.</label>' }
                        w += '<div id="runtestDiv"><button id="runtest-btn" onclick="javascript:document.ysview.runTest()">Run Test</button></div></div><div class="footer"><div class="moreinfo"><a href="javascript:document.ysview.openLink(\'https://yslow.org/\');"><b>&#187;</b>' + q + "</a></div></div></div></div></div>";
                        this.addButtonView("panel_about", w) }, genProgressView: function() {
                        var q = '<div id="progressDiv"><div id="peel"><p>Finding components in the page:</p><div id="peelprogress"><div id="progbar"></div></div><div id="progtext"></div></div><div id="fetch"><p>Getting component information:</p><div id="fetchprogress"><div id="progbar2"></div></div><div id="progtext2">start...</div></div></div>';
                        this.setButtonView("panel_about", q) }, updateProgressView: function(q, v) {
                        var u, x, y, w, z, r, s, t, A = "";
                        if (this.curButtonId === "panel_about") { z = this.getButtonView(this.curButtonId);
                            if (q === "peel") { u = this.getElementByTagNameAndId(z, "div", "peelprogress");
                                x = this.getElementByTagNameAndId(z, "div", "progbar");
                                y = this.getElementByTagNameAndId(z, "div", "progtext");
                                A = v.message;
                                w = (v.current_step * 100) / v.total_step } else {
                                if (q === "fetch") { u = this.getElementByTagNameAndId(z, "div", "fetchprogress");
                                    x = this.getElementByTagNameAndId(z, "div", "progbar2");
                                    y = this.getElementByTagNameAndId(z, "div", "progtext2");
                                    A = v.last_component_url;
                                    w = (v.current * 100) / v.total } else {
                                    if (q === "message") { y = this.getElementByTagNameAndId(z, "div", "progtext2");
                                        if (y) { y.innerHTML = v }
                                        return } else {
                                        return } } } }
                        if (u && x && y) { r = u.clientWidth;
                            if (w < 0) { w = 0 }
                            if (w > 100) { w = 100 }
                            w = 100 - w;
                            s = (r * w) / 100;
                            if (s > r) { s = r }
                            t = r - parseInt(s, 10);
                            x.style.width = parseInt(s, 10) + "px";
                            x.style.left = parseInt(t, 10) + "px";
                            y.innerHTML = A } }, updateStatusBar: function(x) {
                        var z, s, A, t, q, r = YSLOW,
                            u = r.util,
                            w = r.view,
                            y = u.Preference,
                            v = this.yscontext;
                        if (!v.PAGE.statusbar) { v.PAGE.statusbar = true;
                            if (!v.PAGE.overallScore) { r.controller.lint(x, v) }
                            if (!v.PAGE.totalSize) { v.collectStats() }
                            z = u.kbSize(v.PAGE.totalSize);
                            s = u.prettyScore(v.PAGE.overallScore);
                            w.setStatusBar(s, "yslow_status_grade");
                            w.setStatusBar(z, "yslow_status_size");
                            if (y.getPref("optinBeacon", false)) { t = y.getPref("beaconInfo", "basic"), q = y.getPref("beaconUrl", "http://rtblab.pclick.yahoo.com/images/ysb.gif");
                                A = u.getResults(v, t);
                                u.sendBeacon(A, t, q) } } }, getRulesetListSource: function(q) {
                        var u, s, t = "",
                            r = YSLOW.controller.getDefaultRulesetId();
                        for (u in q) {
                            if (q[u]) { t += '<option value="' + q[u].id + '" ';
                                if (!s && q[u].hasOwnProperty("custom") && q[u].custom) { s = true;
                                    t += 'class="firstInGroup" ' }
                                if (r !== undefined && u === r) { t += "selected" }
                                t += ">" + q[u].name + "</option>" } }
                        return t }, updateRulesetList: function() {
                        var u, w, s, t = this.panel_doc.getElementsByTagName("select"),
                            q = YSLOW.controller.getRegisteredRuleset(),
                            r = this.getRulesetListSource(q),
                            v = function(x) {
                                var y = FBL.getContentView(this.ownerDocument);
                                y.ysview.onChangeRuleset(x) };
                        for (u = 0; u < t.length; u += 1) {
                            if (t[u].id === "toolbar-rulesetList") { w = t[u].parentNode;
                                if (w && w.id === "toolbar-ruleset") { s = this.panel_doc.createElement("select");
                                    if (s) { s.id = "toolbar-rulesetList";
                                        s.name = "rulesets";
                                        s.onchange = v;
                                        s.innerHTML = r }
                                    w.replaceChild(s, t[u]) } } } }, getToolbarSource: function() {
                        var r, q, t = '<div id="menu">',
                            s = { home: "Home", grade: "Grade", components: "Components", stats: "Statistics", tools: "Tools" };
                        if (YSLOW.doc && YSLOW.doc.view_names) {
                            for (r in s) {
                                if (s.hasOwnProperty(r) && YSLOW.doc.view_names[r]) { s[r] = YSLOW.doc.view_names[r] } } }
                        q = YSLOW.controller.getRegisteredRuleset();
                        t = '<div id="toolbar-ruleset" class="floatRight">Rulesets <select id="toolbar-rulesetList" name="rulesets" onchange="javascript:document.ysview.onChangeRuleset(event)">' + this.getRulesetListSource(q) + "</select>";
                        t += '<button onclick="javascript:document.ysview.showRuleSettings()">Edit</button><ul id="tbActions"><li id="printLink" class="first"><a href="javascript:document.ysview.openPrintableDialog(document)"><b class="icon">&asymp;</b><em>Printable View</em></a></li><li id="helpLink"><a href="javascript:document.ysview.showHideHelp()"><b class="icon">?</b><em>Help &darr;</em></a></li></ul></div>';
                        t += '<div id="helpDiv" class="help" style="visibility: hidden"><div><a href="javascript:document.ysview.openLink(\'https://github.com/marcelduran/yslow/wiki/User-Guide\')">YSlow Help</a></div><div><a href="javascript:document.ysview.openLink(\'https://github.com/marcelduran/yslow/wiki/FAQ\')">YSlow FAQ</a></div><div class="new-section"><a href="javascript:document.ysview.openLink(\'http://yslow.org/blog/\')">YSlow Blog</a></div><div><a href="javascript:document.ysview.openLink(\'http://tech.groups.yahoo.com/group/exceptional-performance/\')">YSlow Community</a></div><div class="new-section"><a href="javascript:document.ysview.openLink(\'https://github.com/marcelduran/yslow/issues\')">YSlow Issues</a></div><div class="new-section"><div><a class="social yslow" href="javascript:document.ysview.openLink(\'http://yslow.org/\')">YSlow Home</a></div><div><a class="social facebook" href="javascript:document.ysview.openLink(\'http://www.facebook.com/getyslow\')">Like YSlow</a></div><div><a class="social twitter" href="javascript:document.ysview.openLink(\'http://twitter.com/yslow\')">Follow YSlow</a></div></div><div class="new-section" id="help-version">Version ' + YSLOW.version + "</div></div>";
                        t += '<div id="nav-menu"><ul class="yui-nav" id="toolbarLinks"><li class="first selected off" id="ysHomeButton"><a href="javascript:document.ysview.setSplashView()" onclick="javascript:document.ysview.onclickToolbarMenu(event)"><em>' + s.home + '</em><span class="pipe"/></a></li><li id="ysPerfButton"><a href="javascript:document.ysview.showPerformance()" onclick="javascript:document.ysview.onclickToolbarMenu(event)"><em>' + s.grade + '</em><span class="pipe"/></a></li><li id="ysCompsButton"><a href="javascript:document.ysview.showComponents()" onclick="javascript:document.ysview.onclickToolbarMenu(event)"><em>' + s.components + '</em><span class="pipe"/></a></li><li id="ysStatsButton"><a href="javascript:document.ysview.showStats()" onclick="javascript:document.ysview.onclickToolbarMenu(event)"><em>' + s.stats + '</em><span class="pipe"/></a></li><li id="ysToolButton"><a href="javascript:document.ysview.showTools()" onclick="javascript:document.ysview.onclickToolbarMenu(event)"><em>' + s.tools + "</em></a></li></ul></div>";
                        t += "</div>";
                        return t }, show: function(r) {
                        var s = "html",
                            q = "";
                        r = r || this.yscontext.defaultview;
                        if (this.yscontext.component_set === null) { YSLOW.controller.run(window.top.content, this.yscontext, false);
                            this.yscontext.defaultview = r } else {
                            if (this.getButtonView(r)) { this.showButtonView(r) } else {
                                if ("ysCompsButton" === r) { q += this.yscontext.genComponents(s);
                                    this.addButtonView("ysCompsButton", q) } else {
                                    if ("ysStatsButton" === r) { q += this.yscontext.genStats(s);
                                        this.addButtonView("ysStatsButton", q);
                                        YSLOW.renderer.plotComponents(this.getButtonView("ysStatsButton"), this.yscontext) } else {
                                        if ("ysToolButton" === r) { q += this.yscontext.genToolsView(s);
                                            this.addButtonView("ysToolButton", q) } else { q += this.yscontext.genPerformance(s);
                                            this.addButtonView("ysPerfButton", q) } } } }
                            this.panelNode.scrollTop = 0;
                            this.panelNode.scrollLeft = 0;
                            this.updateStatusBar(this.yscontext.document);
                            this.updateToolbarSelection() } }, updateToolbarSelection: function() {
                        var q, r, s;
                        switch (this.curButtonId) {
                            case "ysCompsButton":
                            case "ysPerfButton":
                            case "ysStatsButton":
                            case "ysToolButton":
                                q = this.getElementByTagNameAndId(this.panelNode, "li", this.curButtonId);
                                if (q) {
                                    if (q.className.indexOf("selected") !== -1) {
                                        return } else { q.className += " selected";
                                        if (q.previousSibling) { q.previousSibling.className += " off" } } }
                                break;
                            default:
                                break }
                        r = this.getElementByTagNameAndId(this.panelNode, "ul", "toolbarLinks");
                        s = r.firstChild;
                        while (s) {
                            if (s.id !== this.curButtonId && s.className.indexOf("selected") !== -1) { this.unselect(s);
                                if (s.previousSibling) { YSLOW.view.removeClassName(s.previousSibling, "off") } }
                            s = s.nextSibling } }, showPerformance: function() { this.show("ysPerfButton") }, showStats: function() { this.show("ysStatsButton") }, showComponents: function() { this.show("ysCompsButton") }, showTools: function() { this.show("ysToolButton") }, showRuleSettings: function() {
                        var q = this.yscontext.genRulesetEditView("html");
                        this.addButtonView("ysRuleEditButton", q);
                        this.panelNode.scrollTop = 0;
                        this.panelNode.scrollLeft = 0;
                        this.updateToolbarSelection() }, runTest: function() { YSLOW.controller.run(window.top.content, this.yscontext, false) }, setAutorun: function(q) { YSLOW.util.Preference.setPref("extensions.yslow.autorun", q) }, setAntiIframe: function(q) { YSLOW.antiIframe = q }, addCDN: function(z) {
                        var t, r, v = this,
                            x = document,
                            A = v.yscontext,
                            B = YSLOW.util.Preference,
                            w = B.getPref("cdnHostnames", ""),
                            q = v.panel_doc,
                            s = q.getElementById("tab-label-list"),
                            y = s.getElementsByTagName("li"),
                            u = y.length;
                        if (w) { w = w.replace(/\s+/g, "").split(",");
                            w.push(z);
                            w = w.join() } else { w = z }
                        B.setPref("extensions.yslow.cdnHostnames", w);
                        for (t = 0; t < u; t += 1) { s = y[t];
                            if (s.className.indexOf("selected") > -1) { r = s.id;
                                break } }
                        YSLOW.controller.lint(A.document, A);
                        v.addButtonView("ysPerfButton", A.genPerformance("html"));
                        YSLOW.view.restoreStatusBar(A);
                        v.updateToolbarSelection();
                        s = q.getElementById(r);
                        v.onclickTabLabel({ currentTarget: s }, true) }, onChangeRuleset: function(t) {
                        var u, r, v, w, q = YSLOW.util.getCurrentTarget(t),
                            s = q.options[q.selectedIndex];
                        YSLOW.controller.setDefaultRuleset(s.value);
                        u = q.ownerDocument;
                        r = "Do you want to run the selected ruleset now?";
                        v = "Run Test";
                        w = function(y) {
                            var x;
                            u.ysview.closeDialog(u);
                            if (u.yslowContext.component_set === null) { YSLOW.controller.run(u.yslowContext.document.defaultView || u.yslowContext.document.parentWindow, u.yslowContext, false) } else { YSLOW.controller.lint(u.yslowContext.document, u.yslowContext) }
                            x = u.yslowContext.genPerformance("html");
                            u.ysview.addButtonView("ysPerfButton", x);
                            u.ysview.panelNode.scrollTop = 0;
                            u.ysview.panelNode.scrollLeft = 0;
                            YSLOW.view.restoreStatusBar(u.yslowContext);
                            u.ysview.updateToolbarSelection() };
                        this.openDialog(u, 389, 150, r, undefined, v, w) }, onclickTabLabel: function(q, w) {
                        var s, r, t, y, A, z, v, B = YSLOW.util.getCurrentTarget(q),
                            x = B.parentNode,
                            u = x.nextSibling;
                        if (B.className.indexOf("selected") !== -1 || B.id.indexOf("label") === -1) {
                            return false }
                        if (x) { s = x.firstChild;
                            while (s) {
                                if (this.unselect(s)) { r = s.id.substring(5);
                                    break }
                                s = s.nextSibling }
                            B.className += " selected";
                            t = B.id.substring(5);
                            s = u.firstChild;
                            while (s) { v = s.id.substring(3);
                                if (!y && r && v === r) {
                                    if (s.className.indexOf("yui-hidden") === -1) { s.className += " yui-hidden" }
                                    y = true }
                                if (!A && t && v === t) { YSLOW.view.removeClassName(s, "yui-hidden");
                                    A = true;
                                    z = s }
                                if ((y || !r) && (A || !t)) {
                                    break }
                                s = s.nextSibling }
                            if (w === true && A === true && z) { this.positionResultTab(z, u, B) } }
                        return false }, positionResultTab: function(r, q, w) {
                        var u, z, A, v = 5,
                            x = this.panel_doc,
                            t = x.defaultView || x.parentWindow,
                            s = t.offsetHeight ? t.offsetHeight : t.innerHeight,
                            B = w.offsetTop + r.offsetHeight;
                        q.style.height = B + "px";
                        r.style.position = "absolute";
                        r.style.left = w.offsetLeft + w.offsetWidth + "px";
                        r.style.top = w.offsetTop + "px";
                        u = r.offsetTop;
                        z = r.offsetParent;
                        while (z !== null) { u += z.offsetTop;
                            z = z.offsetParent }
                        if (u < this.panelNode.scrollTop || u + r.offsetHeight > this.panelNode.scrollTop + s) {
                            if (u < this.panelNode.scrollTop) { this.panelNode.scrollTop = u - v } else { A = u + r.offsetHeight - this.panelNode.scrollTop - s + v;
                                if (A > u - this.panelNode.scrollTop) { A = u - this.panelNode.scrollTop }
                                this.panelNode.scrollTop += A } } }, onclickResult: function(q) { YSLOW.util.preventDefault(q);
                        return this.onclickTabLabel(q, true) }, unselect: function(q) {
                        return YSLOW.view.removeClassName(q, "selected") }, filterResult: function(z, q) {
                        var v, u, r, w, s, x, t, y = this.getButtonView("ysPerfButton");
                        if (q === "all") { u = true }
                        if (y) { v = this.getElementByTagNameAndId(y, "ul", "tab-label-list") }
                        if (v) { r = v.firstChild;
                            t = v.nextSibling;
                            s = t.firstChild;
                            while (r) { YSLOW.view.removeClassName(r, "first");
                                if (u || r.className.indexOf(q) !== -1) { r.style.display = "block";
                                    if (w === undefined) { w = s;
                                        x = r;
                                        YSLOW.view.removeClassName(s, "yui-hidden");
                                        r.className += " first";
                                        if (r.className.indexOf("selected") === -1) { r.className += " selected" }
                                        r = r.nextSibling;
                                        s = s.nextSibling;
                                        continue } } else { r.style.display = "none" }
                                if (s.className.indexOf("yui-hidden") === -1) { s.className += " yui-hidden" }
                                this.unselect(r);
                                r = r.nextSibling;
                                s = s.nextSibling }
                            if (w) { this.positionResultTab(w, t, x) } } }, updateFilterSelection: function(s) {
                        var q, r = YSLOW.util.getCurrentTarget(s);
                        YSLOW.util.preventDefault(s);
                        if (r.className.indexOf("selected") !== -1) {
                            return }
                        r.className += " selected";
                        q = r.parentNode.firstChild;
                        while (q) {
                            if (q !== r && this.unselect(q)) {
                                break }
                            q = q.nextSibling }
                        this.filterResult(r.ownerDocument, r.id) }, onclickToolbarMenu: function(q) {
                        var u, s = YSLOW.util.getCurrentTarget(q),
                            t = s.parentNode,
                            r = t.parentNode;
                        if (t.className.indexOf("selected") !== -1) {
                            return }
                        t.className += " selected";
                        if (t.previousSibling) { t.previousSibling.className += " off" }
                        if (r) { u = r.firstChild;
                            while (u) {
                                if (u !== t && this.unselect(u)) {
                                    if (u.previousSibling) { YSLOW.view.removeClassName(u.previousSibling, "off") }
                                    break }
                                u = u.nextSibling } } }, expandCollapseComponentType: function(u, r) {
                        var s, t = YSLOW.controller.getRenderer("html"),
                            q = this.getButtonView("ysCompsButton");
                        if (q) { s = this.getElementByTagNameAndId(q, "table", "components-table");
                            t.expandCollapseComponentType(u, s, r) } }, expandAll: function(t) {
                        var r, s = YSLOW.controller.getRenderer("html"),
                            q = this.getButtonView("ysCompsButton");
                        if (q) { r = this.getElementByTagNameAndId(q, "table", "components-table");
                            s.expandAllComponentType(t, r) } }, regenComponentsTable: function(v, u, r) {
                        var s, t = YSLOW.controller.getRenderer("html"),
                            q = this.getButtonView("ysCompsButton");
                        if (q) { s = this.getElementByTagNameAndId(q, "table", "components-table");
                            t.regenComponentsTable(v, s, u, r, this.yscontext.component_set) } }, showComponentHeaders: function(s) {
                        var r, t, q = this.getButtonView("ysCompsButton");
                        if (q) { r = this.getElementByTagNameAndId(q, "tr", s);
                            if (r) { t = r.firstChild;
                                if (r.style.display === "none") { r.style.display = "table-row" } else { r.style.display = "none" } } } }, openLink: function(q) { YSLOW.util.openLink(q) }, openPopup: function(s, r, u, q, t) { window.open(s, r || "_blank", "width=" + (u || 626) + ",height=" + (q || 436) + "," + (t || "toolbar=0,status=1,location=1,resizable=1")) }, runTool: function(q, r) { YSLOW.controller.runTool(q, this.yscontext, r) }, onclickRuleset: function(v) {
                        var s, r, q, u, w = YSLOW.util.getCurrentTarget(v),
                            t = w.className.indexOf("ruleset-");
                        YSLOW.util.preventDefault(v);
                        if (t !== -1) { r = w.className.indexOf(" ", t + 8);
                            if (r !== -1) { s = w.className.substring(t + 8, r) } else { s = w.className.substring(t + 8) }
                            q = this.getButtonView("ysRuleEditButton");
                            if (q) { u = this.getElementByTagNameAndId(q, "form", "edit-form");
                                YSLOW.renderer.initRulesetEditForm(w.ownerDocument, u, YSLOW.controller.getRuleset(s)) } }
                        return this.onclickTabLabel(v, false) }, openSaveAsDialog: function(s, r) {
                        var q = '<label>Save ruleset as: <input type="text" id="saveas-name" class="text-input" name="saveas-name" length="100" maxlength="100"></label>',
                            t = "Save",
                            u = function(B) {
                                var y, w, v, z, x, A = YSLOW.util.getCurrentTarget(B).ownerDocument;
                                if (A.ysview.modaldlg) { y = A.ysview.getElementByTagNameAndId(A.ysview.modaldlg, "input", "saveas-name") }
                                if (y) {
                                    if (YSLOW.controller.checkRulesetName(y.value) === true) { w = q + '<div class="error">' + y.value + " ruleset already exists.</div>";
                                        A.ysview.closeDialog(A);
                                        A.ysview.openDialog(A, 389, 150, w, "", t, u) } else { v = A.ysview.getButtonView("ysRuleEditButton");
                                        if (v) { z = A.ysview.getElementByTagNameAndId(v, "form", r);
                                            x = A.createElement("input");
                                            x.type = "hidden";
                                            x.name = "saveas-name";
                                            x.value = y.value;
                                            z.appendChild(x);
                                            z.submit() }
                                        A.ysview.closeDialog(A) } } };
                        this.openDialog(s, 389, 150, q, undefined, t, u) }, openPrintableDialog: function(t) {
                        var s = "Please run YSlow first before using Printable View.",
                            r = "Check which information you want to view or print<br>",
                            q = '<div id="printOptions"><label><input type="checkbox" name="print-type" value="grade" checked>Grade</label><label><input type="checkbox" name="print-type" value="components" checked>Components</label><label><input type="checkbox" name="print-type" value="stats" checked>Statistics</label></div>',
                            u = "Ok",
                            v = function(y) {
                                var w, x = YSLOW.util.getCurrentTarget(y).ownerDocument,
                                    x = FBL.getContentView(x);
                                aInputs = x.getElementsByName("print-type"), print_type = {};
                                for (w = 0; w < aInputs.length; w += 1) {
                                    if (aInputs[w].checked) { print_type[aInputs[w].value] = 1 } }
                                x.ysview.closeDialog(x);
                                x.ysview.runTool("printableview", { options: print_type, yscontext: x.yslowContext }) };
                        if (t.yslowContext.component_set === null) { this.openDialog(t, 389, 150, s, "", "Ok");
                            return }
                        this.openDialog(t, 389, 150, r, q, u, v) }, getElementByTagNameAndId: function(s, t, u) {
                        var q, r;
                        if (s) { r = s.getElementsByTagName(t);
                            if (r.length > 0) {
                                for (q = 0; q < r.length; q += 1) {
                                    if (r[q].id === u) {
                                        return r[q] } } } }
                        return null }, openDialog: function(K, C, B, x, w, u, F) {
                        var E, D, G, z, y, q, r, t, I, v, s, A, H = this.modaldlg,
                            J = H.getElementsByTagName("div");
                        for (E = 0; E < J.length; E += 1) {
                            if (J[E].className && J[E].className.length > 0) {
                                if (J[E].className === "dialog-box") { G = J[E] } else {
                                    if (J[E].className === "dialog-text") { z = J[E] } else {
                                        if (J[E].className === "dialog-more-text") { y = J[E] } } } } }
                        if (H && G && z && y) { z.innerHTML = (x ? x : "");
                            y.innerHTML = (w ? w : "");
                            r = H.getElementsByTagName("input");
                            for (D = 0; D < r.length; D += 1) {
                                if (r[D].className === "dialog-left-button") { q = r[D] } }
                            if (q) { q.value = u;
                                q.onclick = F || function(L) { K = FBL.getContentView(K);
                                    K.ysview.closeDialog(K) } }
                            t = K.defaultView || K.parentWindow;
                            I = t.innerWidth;
                            v = t.innerHeight;
                            s = Math.floor((I - C) / 2);
                            A = Math.floor((v - B) / 2);
                            G.style.left = ((s && s > 0) ? s : 225) + "px";
                            G.style.top = ((A && A > 0) ? A : 80) + "px";
                            H.style.left = this.panelNode.scrollLeft + "px";
                            H.style.top = this.panelNode.scrollTop + "px";
                            H.style.display = "block";
                            if (r.length > 0) { r[0].focus() } } }, closeDialog: function(r) {
                        var q = this.modaldlg;
                        q.style.display = "none" }, saveRuleset: function(u, r) {
                        var s, t = YSLOW.controller.getRenderer("html"),
                            q = this.getButtonView("ysRuleEditButton");
                        if (q) { s = this.getElementByTagNameAndId(q, "form", r);
                            t.saveRuleset(u, s) } }, deleteRuleset: function(u, r) {
                        var s, t = YSLOW.controller.getRenderer("html"),
                            q = this.getButtonView("ysRuleEditButton");
                        if (q) { s = this.getElementByTagNameAndId(q, "form", r);
                            t.deleteRuleset(u, s) } }, shareRuleset: function(v, t) {
                        var q, x, u, y, w, r = YSLOW.controller.getRenderer("html"),
                            s = this.getButtonView("ysRuleEditButton");
                        if (s) { q = this.getElementByTagNameAndId(s, "form", t);
                            x = r.getEditFormRulesetId(q);
                            u = YSLOW.controller.getRuleset(x);
                            if (u) { y = YSLOW.Exporter.exportRuleset(u);
                                if (y) { w = "<label>" + y.message + "</label>";
                                    this.openDialog(v, 389, 150, w, "", "Ok") } } } }, createRuleset: function(s, r) {
                        var q, t, v = s.parentNode,
                            u = v.parentNode,
                            w = u.firstChild;
                        while (w) { this.unselect(w);
                            w = w.nextSibling }
                        q = this.getButtonView("ysRuleEditButton");
                        if (q) { t = this.getElementByTagNameAndId(q, "form", r);
                            YSLOW.renderer.initRulesetEditForm(this.panel_doc, t) } }, showHideHelp: function() {
                        var q, r = this.getElementByTagNameAndId(this.panelNode, "div", "toolbarDiv");
                        if (r) { q = this.getElementByTagNameAndId(r, "div", "helpDiv") }
                        if (q) {
                            if (q.style.visibility === "visible") { q.style.visibility = "hidden" } else { q.style.visibility = "visible" } } }, smushIt: function(r, q) { YSLOW.util.smushIt(q, function(w) {
                            var u, t, v, x, s = "";
                            if (w.error) { s += "<br><div>" + w.error + "</div>" } else { v = YSLOW.util.getSmushUrl();
                                x = YSLOW.util.makeAbsoluteUrl(w.dest, v);
                                s += "<div>Original size: " + w.src_size + " bytes</div><div>Result size: " + w.dest_size + " bytes</div><div>% Savings: " + w.percent + "%</div><div><a href=\"javascript:document.ysview.openLink('" + x + "')\">Click here to view or save the result image.</a></div>" }
                            u = '<div class="smushItResult"><div>Image: ' + YSLOW.util.briefUrl(q, 250) + "</div></div>";
                            t = s;
                            r.ysview.openDialog(r, 389, 150, u, t, "Ok") }) }, checkAllRules: function(v, s, r) {
                        var t, q, u, w;
                        if (typeof r !== "boolean") {
                            return }
                        q = this.getButtonView("ysRuleEditButton");
                        if (q) { u = this.getElementByTagNameAndId(q, "form", s);
                            w = u.elements;
                            for (t = 0; t < w.length; t += 1) {
                                if (w[t].type === "checkbox") { w[t].checked = r } } } }, __exposedProps__: { openLink: "rw", showComponentHeaders: "rw", smushIt: "rw", saveRuleset: "rw", regenComponentsTable: "rw", expandCollapseComponentType: "rw", expandAll: "rw", updateFilterSelection: "rw", openPopup: "rw", runTool: "rw", onclickRuleset: "rw", createRuleset: "rw", addCDN: "rw", closeDialog: "rw", setAutorun: "rw", setAntiIframe: "rw", runTest: "rw", onChangeRuleset: "rw", showRuleSettings: "rw", openPrintableDialog: "rw", showHideHelp: "rw", setSplashView: "rw", onclickToolbarMenu: "rw", showPerformance: "rw", showComponents: "rw", showStats: "rw", showTools: "rw", onclickResult: "rw" } };
                YSLOW.view.Tooltip = function(r, q) { this.tooltip = r.createElement("div");
                    if (this.tooltip) { this.tooltip.id = "tooltipDiv";
                        this.tooltip.innerHTML = "";
                        this.tooltip.style.display = "none";
                        if (q) { q.appendChild(this.tooltip) } }
                    this.timer = null };
                YSLOW.view.Tooltip.prototype = { show: function(s, r) {
                        var q = this;
                        this.text = s;
                        this.target = r;
                        this.tooltipData = { text: s, target: r };
                        this.timer = YSLOW.util.setTimer(function() { q.showX() }, 500) }, showX: function() {
                        if (this.tooltipData) { this.showTooltip(this.tooltipData.text, this.tooltipData.target) }
                        this.timer = null }, showTooltip: function(G, w) {
                        var u, H, F, t, s, r, z, C = 10,
                            B = 0,
                            A = 0,
                            E = w.ownerDocument,
                            v = E.defaultView || E.parentWindow,
                            D = v.offsetWidth ? v.offsetWidth : v.innerWidth,
                            q = v.offsetHeight ? v.offsetHeight : v.innerHeight;
                        this.tooltip.innerHTML = G;
                        this.tooltip.style.display = "block";
                        u = this.tooltip.offsetWidth;
                        H = this.tooltip.offsetHeight;
                        if (u > D || H > q) { this.tooltip.style.display = "none";
                            return }
                        F = w.offsetParent;
                        while (F !== null) { B += F.offsetLeft;
                            A += F.offsetTop;
                            F = F.offsetParent }
                        B += w.offsetLeft;
                        A += w.offsetTop;
                        if (B < E.ysview.panelNode.scrollLeft || A < E.ysview.panelNode.scrollTop || (A + w.offsetHeight > E.ysview.panelNode.scrollTop + q)) { this.tooltip.style.display = "none";
                            return }
                        t = B + w.offsetWidth / 2;
                        s = A + w.offsetHeight / 2;
                        if (B + w.offsetWidth + C + u < D) { B += w.offsetWidth + C;
                            if ((A >= E.ysview.panelNode.scrollTop) && (A - C + H + C <= E.ysview.panelNode.scrollTop + q)) { A = A - C;
                                r = "right top" } else { A += w.offsetHeight - H;
                                r = "right bottom" } } else {
                            if (A - H - C >= E.ysview.panelNode.scrollTop) { A -= H + C;
                                r = "top" } else { A += w.offsetHeight + C;
                                r = "bottom" }
                            z = Math.floor(t - u / 2);
                            if ((z >= E.ysview.panelNode.scrollLeft) && (z + u <= E.ysview.panelNode.scrollLeft + D)) { B = z } else {
                                if (z < E.ysview.panelNode.scrollLeft) { B = E.ysview.panelNode.scrollLeft } else { B = E.ysview.panelNode.scrollLeft + D - C - u } } }
                        if (r) { this.tooltip.className = r }
                        this.tooltip.style.left = B + "px";
                        this.tooltip.style.top = A + "px" }, hide: function() {
                        if (this.timer) { clearTimeout(this.timer) }
                        this.tooltip.style.display = "none" } };
                YSLOW.view.setStatusBar = function(s, q) {
                    var r = document.getElementById(q || "yslow_status_grade");
                    if (r) { r.value = s } };
                YSLOW.view.clearStatusBar = function() { this.setStatusBar("", "yslow_status_time");
                    this.setStatusBar("YSlow", "yslow_status_grade");
                    this.setStatusBar("", "yslow_status_size") };
                YSLOW.view.restoreStatusBar = function(t) {
                    var s, q, r;
                    if (t) {
                        if (t.PAGE.overallScore) { s = YSLOW.util.prettyScore(t.PAGE.overallScore);
                            this.setStatusBar(s, "yslow_status_grade") }
                        if (t.PAGE.totalSize) { q = YSLOW.util.kbSize(t.PAGE.totalSize);
                            this.setStatusBar(q, "yslow_status_size") }
                        if (t.PAGE.t_done) { r = t.PAGE.t_done / 1000 + "s";
                            this.setStatusBar(r, "yslow_status_time") } } };
                YSLOW.view.toggleStatusBar = function(q) { document.getElementById("yslow-status-bar").hidden = q };
                YSLOW.view.removeClassName = function(s, q) {
                    var r, t;
                    if (s && s.className && s.className.length > 0 && q && q.length > 0) { t = s.className.split(" ");
                        for (r = 0; r < t.length; r += 1) {
                            if (t[r] === q) { t.splice(r, 1);
                                s.className = t.join(" ");
                                return true } } }
                    return false };
                YSLOW.context = function(q) { this.document = q;
                    this.component_set = null;
                    this.result_set = null;
                    this.onloadTimestamp = null;
                    if (YSLOW.renderer) { YSLOW.renderer.reset() }
                    this.PAGE = { totalSize: 0, totalRequests: 0, totalObjCount: {}, totalObjSize: {}, totalSizePrimed: 0, totalRequestsPrimed: 0, totalObjCountPrimed: {}, totalObjSizePrimed: {}, canvas_data: {}, statusbar: false, overallScore: 0, t_done: undefined, loaded: false } };
                YSLOW.context.prototype = { defaultview: "ysPerfButton", computeStats: function(A) {
                        var u, z, t, x, B, D, C, s, y, q, v = {},
                            w = {},
                            r = 0;
                        if (!this.component_set) {
                            return }
                        u = this.component_set.components;
                        if (!u) {
                            return }
                        for (x = 0, B = u.length; x < B; x += 1) { z = u[x];
                            if (!A || !z.hasFarFutureExpiresOrMaxAge()) { r += 1;
                                t = z.type;
                                v[t] = (typeof v[t] === "undefined" ? 1 : v[t] + 1);
                                D = 0;
                                if (!A || !z.hasOldModifiedDate()) {
                                    if (z.compressed === "gzip" || z.compressed === "deflate") {
                                        if (z.size_compressed) { D = parseInt(z.size_compressed, 10) } } else { D = z.size } }
                                w[t] = (typeof w[t] === "undefined" ? D : w[t] + D) } }
                        C = 0;
                        s = YSLOW.peeler.types;
                        y = {};
                        for (x = 0; x < s.length; x += 1) { q = s[x];
                            if (typeof v[q] !== "undefined") {
                                if (w[q] > 0) { y[q] = w[q] }
                                C += w[q] } }
                        return { total_size: C, num_requests: r, count_obj: v, size_obj: w, canvas_data: y } }, collectStats: function() {
                        var q = this.computeStats();
                        if (q !== undefined) { this.PAGE.totalSize = q.total_size;
                            this.PAGE.totalRequests = q.num_requests;
                            this.PAGE.totalObjCount = q.count_obj;
                            this.PAGE.totalObjSize = q.size_obj;
                            this.PAGE.canvas_data.empty = q.canvas_data }
                        q = this.computeStats(true);
                        if (q) { this.PAGE.totalSizePrimed = q.total_size;
                            this.PAGE.totalRequestsPrimed = q.num_requests;
                            this.PAGE.totalObjCountPrimed = q.count_obj;
                            this.PAGE.totalObjSizePrimed = q.size_obj;
                            this.PAGE.canvas_data.primed = q.canvas_data } }, genPerformance: function(r, q) {
                        if (this.result_set === null) {
                            if (!q) { q = this.document }
                            YSLOW.controller.lint(q, this) }
                        return YSLOW.controller.render(r, "reportcard", { result_set: this.result_set }) }, genStats: function(r) {
                        var q = {};
                        if (!this.PAGE.totalSize) { this.collectStats() }
                        q.PAGE = this.PAGE;
                        return YSLOW.controller.render(r, "stats", { stats: q }) }, genComponents: function(q) {
                        if (!this.PAGE.totalSize) { this.collectStats() }
                        return YSLOW.controller.render(q, "components", { comps: this.component_set.components, total_size: this.PAGE.totalSize }) }, genToolsView: function(r) {
                        var q = YSLOW.Tools.getAllTools();
                        return YSLOW.controller.render(r, "tools", { tools: q }) }, genRulesetEditView: function(q) {
                        return YSLOW.controller.render(q, "rulesetEdit", { rulesets: YSLOW.controller.getRegisteredRuleset() }) } };
                YSLOW.renderer = { sortBy: "type", sortDesc: false, bPrintable: false, colors: { doc: "#8963df", redirect: "#FC8C8C", iframe: "#FFDFDF", xhr: "#89631f", flash: "#8D4F5B", js: "#9fd0e8", css: "#aba5eb", cssimage: "#677ab8", image: "#d375cd", favicon: "#a26c00", unknown: "#888888" }, reset: function() { this.sortBy = "type";
                        this.sortDesc = false }, genStats: function(y, z) {
                        var v, w, s, r, B, x, q, u, t = "",
                            A = 0;
                        if (!y.PAGE) {
                            return "" }
                        if (z) { v = y.PAGE.totalObjCountPrimed;
                            w = y.PAGE.totalObjSizePrimed;
                            s = y.PAGE.totalRequestsPrimed;
                            A = y.PAGE.totalSizePrimed } else { v = y.PAGE.totalObjCount;
                            w = y.PAGE.totalObjSize;
                            s = y.PAGE.totalRequests;
                            A = y.PAGE.totalSize }
                        r = YSLOW.peeler.types;
                        B = (z) ? "primed" : "empty";
                        for (x = 0; x < r.length; x += 1) { q = r[x];
                            if (typeof v[q] !== "undefined") { t += '<tr><td class="legend"><div class="stats-legend" style="background: ' + this.colors[q] + '">&nbsp;</div></td><td class="count">' + v[q] + '</td><td class="type">' + YSLOW.util.prettyType(q) + '</td><td class="size">' + YSLOW.util.kbSize(w[q]) + "</td></tr>" } }
                        u = '<div id="stats-detail"><div class="summary-row">HTTP Requests - ' + s + '</div><div class="summary-row-2">Total Weight - ' + YSLOW.util.kbSize(A) + '</div><table id="stats-table">' + t + "</table></div>";
                        return u }, plotComponents: function(q, r) {
                        if (typeof q !== "object") {
                            return }
                        this.plotOne(q, r.PAGE.canvas_data.empty, r.PAGE.totalSize, "comp-canvas-empty");
                        this.plotOne(q, r.PAGE.canvas_data.primed, r.PAGE.totalSizePrimed, "comp-canvas-primed") }, plotOne: function(A, t, z, y) {
                        var s, u, C, r, x, q, w, D, v, B = A.getElementsByTagName("canvas");
                        for (u = 0; u < B.length; u += 1) {
                            if (B[u].id === y) { s = B[u] } }
                        if (!s) {
                            return }
                        C = s.getContext("2d");
                        r = [s.width, s.height];
                        x = Math.min(r[0], r[1]) / 2;
                        q = [r[0] / 2, r[1] / 2];
                        w = 0;
                        for (D in t) {
                            if (t.hasOwnProperty(D) && t[D]) { v = t[D] / z;
                                C.beginPath();
                                C.moveTo(q[0], q[1]);
                                C.arc(q[0], q[1], x, Math.PI * (-0.5 + 2 * w), Math.PI * (-0.5 + 2 * (w + v)), false);
                                C.lineTo(q[0], q[1]);
                                C.closePath();
                                C.fillStyle = this.colors[D];
                                C.fill();
                                w += v } } }, getComponentHeadersTable: function(q) {
                        var s, r = '<table><tr class="respHeaders"><td colspan=2>Response Headers</td></tr>';
                        for (s in q.headers) {
                            if (q.headers.hasOwnProperty(s) && q.headers[s]) { r += '<tr><td class="param-name">' + YSLOW.util.escapeHtml(YSLOW.util.formatHeaderName(s)) + '</td><td class="param-value">' + YSLOW.util.escapeHtml(q.headers[s]) + "</td></tr>" } }
                        if (q.req_headers) { r += '<tr class="reqHeaders"><td colspan=2>Request Headers</td></tr>';
                            for (s in q.req_headers) {
                                if (q.req_headers.hasOwnProperty(s) && q.req_headers[s]) { r += '<tr><td class="param-name">' + YSLOW.util.escapeHtml(YSLOW.util.formatHeaderName(s)) + '</td><td class="param-value"><p>' + YSLOW.util.escapeHtml(q.req_headers[s]) + "</p></td></tr>" } } }
                        r += "</table>";
                        return r }, genComponentRow: function(w, v, r, u) {
                        var s, A, t, q, z, y, x;
                        if (typeof r !== "string") { r = "" }
                        if (v.status >= 400 && v.status < 500) { r += " compError" }
                        if (v.after_onload === true) { r += " afteronload" }
                        s = "compHeaders" + v.id;
                        A = '<tr class="' + r + " type-" + v.type + '"' + (u ? ' style="display:none"' : "") + ">";
                        for (t in w) {
                            if (w.hasOwnProperty(t)) { q = t;
                                z = "";
                                if (t === "type") { z += v[t];
                                    if (v.is_beacon) { z += " &#8224;" }
                                    if (v.after_onload) { z += " *" } } else {
                                    if (t === "size") { z += YSLOW.util.kbSize(v.size) } else {
                                        if (t === "url") {
                                            if (v.status >= 400 && v.status < 500) { A += '<td class="' + q + '">' + v[t] + " (status: " + v.status + ")</td>";
                                                continue } else { z += YSLOW.util.prettyAnchor(v[t], v[t], undefined, !YSLOW.renderer.bPrintable, 100, 1, v.type) } } else {
                                            if (t === "gzip" && (v.compressed === "gzip" || v.compressed === "deflate")) { z += (v.size_compressed !== undefined ? YSLOW.util.kbSize(v.size_compressed) : "uncertain") } else {
                                                if (t === "set-cookie") { y = v.getSetCookieSize();
                                                    z += y > 0 ? y : "" } else {
                                                    if (t === "cookie") { x = v.getReceivedCookieSize();
                                                        z += x > 0 ? x : "" } else {
                                                        if (t === "etag") { z += v.getEtag() } else {
                                                            if (t === "expires") { z += YSLOW.util.prettyExpiresDate(v.expires) } else {
                                                                if (t === "headers") {
                                                                    if (YSLOW.renderer.bPrintable) {
                                                                        continue }
                                                                    if (v.raw_headers && v.raw_headers.length > 0) { z += "<a href=\"javascript:document.ysview.showComponentHeaders('" + s + '\')"><b class="mag"></b></a>' } } else {
                                                                    if (t === "action") {
                                                                        if (YSLOW.renderer.bPrintable) {
                                                                            continue }
                                                                        if (v.type === "cssimage" || v.type === "image") {
                                                                            if (v.response_type === undefined || v.response_type === "image") { z += "<a href=\"javascript:document.ysview.smushIt(document, '" + v.url + "')\">smush.it</a>" } } } else {
                                                                        if (v[t] !== undefined) { z += v[t] } } } } } } } } } } }
                                A += '<td class="' + q + '">' + z + "</td>" } }
                        A += "</tr>";
                        if (v.raw_headers && v.raw_headers.length > 0) { A += '<tr id="' + s + '" class="headers" style="display:none;"><td colspan="12">' + this.getComponentHeadersTable(v) + "</td></tr>" }
                        return A }, componentSortCallback: function(q, y) {
                        var r, t, u, w = "",
                            v = "",
                            x = YSLOW.renderer.sortBy,
                            s = YSLOW.renderer.sortDesc;
                        switch (x) {
                            case "type":
                                w = q.type;
                                v = y.type;
                                break;
                            case "size":
                                w = q.size ? Number(q.size) : 0;
                                v = y.size ? Number(y.size) : 0;
                                break;
                            case "gzip":
                                w = q.size_compressed ? Number(q.size_compressed) : 0;
                                v = y.size_compressed ? Number(y.size_compressed) : 0;
                                break;
                            case "set-cookie":
                                w = q.getSetCookieSize();
                                v = y.getSetCookieSize();
                                break;
                            case "cookie":
                                w = q.getReceivedCookieSize();
                                v = y.getReceivedCookieSize();
                                break;
                            case "headers":
                                break;
                            case "url":
                                w = q.url;
                                v = y.url;
                                break;
                            case "respTime":
                                w = q.respTime ? Number(q.respTime) : 0;
                                v = y.respTime ? Number(y.respTime) : 0;
                                break;
                            case "etag":
                                w = q.getEtag();
                                v = y.getEtag();
                                break;
                            case "action":
                                if (q.type === "cssimage" || q.type === "image") { w = "smush.it" }
                                if (y.type === "cssimage" || y.type === "image") { v = "smush.it" }
                                break;
                            case "expires":
                                w = q.expires || 0;
                                v = y.expires || 0;
                                break }
                        if (w === v) {
                            if (q.id > y.id) {
                                return (s) ? -1 : 1 }
                            if (q.id < y.id) {
                                return (s) ? 1 : -1 } }
                        if (x === "type") { t = YSLOW.peeler.types;
                            for (r = 0, u = t.length; r < u; r += 1) {
                                if (q.type === t[r]) {
                                    return (s) ? 1 : -1 }
                                if (y.type === t[r]) {
                                    return (s) ? -1 : 1 } } }
                        if (w > v) {
                            return (s) ? -1 : 1 }
                        if (w < v) {
                            return (s) ? 1 : -1 }
                        return 0 }, sortComponents: function(t, s, r) {
                        var q = t;
                        this.sortBy = s;
                        this.sortDesc = r;
                        q.sort(this.componentSortCallback);
                        return q }, genRulesCheckbox: function(z) {
                        var s, q, y, r, w = "",
                            B = 0,
                            A = YSLOW.controller.getRegisteredRules(),
                            u = 0,
                            x = '<div class="column1">',
                            v = '<div class="column2">',
                            t = '<div class="column3">';
                        for (q in A) {
                            if (A.hasOwnProperty(q) && A[q]) { y = A[q];
                                s = '<label class="rules"><input id="rulesetEditRule' + q + '" name="rules" value="' + q + '" type="checkbox"' + (z.rules[q] ? " checked" : "") + ">" + y.name + "</label><br>";
                                if (z.rules[q] !== undefined) { B += 1 }
                                if (z.weights !== undefined && z.weights[q] !== undefined) { w += '<input type="hidden" name="weight-' + q + '" value="' + z.weights[y.id] + '">' }
                                r = (u % 3);
                                switch (r) {
                                    case 0:
                                        x += s;
                                        break;
                                    case 1:
                                        v += s;
                                        break;
                                    case 2:
                                        t += s;
                                        break }
                                u += 1 } }
                        x += "</div>";
                        v += "</div>";
                        t += "</div>";
                        return '<h4><span id="rulesetEditFormTitle">' + z.name + '</span> Ruleset <span id="rulesetEditFormNumRules" class="font10">(includes ' + parseInt(B, 10) + " of " + parseInt(u, 10) + ' rules)</span></h4><div class="rulesColumns"><table><tr><td>' + x + "</td><td>" + v + "</td><td>" + t + '</td></tr></table><div id="rulesetEditWeightsDiv" class="weightsDiv">' + w + "</div></div>" }, genRulesetEditForm: function(q) {
                        var r = "";
                        r += '<div id="rulesetEditFormDiv"><form id="edit-form" action="javascript:document.ysview.saveRuleset(document, \'edit-form\')"><div class="floatRight"><a href="javascript:document.ysview.checkAllRules(document, \'edit-form\', true)">Check All</a>|<a href="javascript:document.ysview.checkAllRules(document, \'edit-form\', false)">Uncheck All</a></div>' + YSLOW.renderer.genRulesCheckbox(q) + '<div class="buttons"><input type="button" value="Save ruleset as ..." onclick="javascript:document.ysview.openSaveAsDialog(document, \'edit-form\')"><span id="rulesetEditCustomButtons" style="visibility: ' + (q.custom === true ? "visible" : "hidden") + '"><input type="button" value="Save" onclick="this.form.submit()"><!--<input type="button" value="Share" onclick="javascript:document.ysview.shareRuleset(document, \'edit-form\')">--><input class="btn_delete" type="button" value="Delete" onclick="javascript:document.ysview.deleteRuleset(document, \'edit-form\')"></span></div><div id="rulesetEditRulesetId"><input type="hidden" name="ruleset-id" value="' + q.id + '"></div><div id="rulesetEditRulesetName"><input type="hidden" name="ruleset-name" value="' + q.name + '"></div></form></div>';
                        return r }, initRulesetEditForm: function(I, r, D) {
                        var C, F, E, B, G, K, w, J, v, y, q, u, A, s = r.elements,
                            t = "",
                            z = [],
                            x = 0,
                            H = 0;
                        for (F = 0; F < s.length; F += 1) {
                            if (s[F].name === "rules") { s[F].checked = false;
                                z[s[F].id] = s[F];
                                H += 1 } else {
                                if (s[F].name === "saveas-name") { r.removeChild(s[F]) } } }
                        C = r.getElementsByTagName("div");
                        for (F = 0; F < C.length; F += 1) {
                            if (C[F].id === "rulesetEditWeightsDiv") { v = C[F] } else {
                                if (C[F].id === "rulesetEditRulesetId") { K = C[F] } else {
                                    if (C[F].id === "rulesetEditRulesetName") { w = C[F] } } } }
                        u = r.parentNode.getElementsByTagName("span");
                        for (E = 0; E < u.length; E += 1) {
                            if (u[E].id === "rulesetEditFormTitle") { J = u[E] } else {
                                if (u[E].id === "rulesetEditCustomButtons") { G = u[E];
                                    if (D !== undefined && D.custom === true) { G.style.visibility = "visible" } else { G.style.visibility = "hidden" } } else {
                                    if (u[E].id === "rulesetEditFormNumRules") { q = u[E] } } } }
                        if (D) { y = D.rules;
                            for (B in y) {
                                if (y.hasOwnProperty(B) && y[B]) { A = z["rulesetEditRule" + B];
                                    if (A) { A.checked = true }
                                    if (D.weights !== undefined && D.weights[B] !== undefined) { t += '<input type="hidden" name="weight-' + B + '" value="' + D.weights[B] + '">' }
                                    x += 1 } }
                            q.innerHTML = "(includes " + parseInt(x, 10) + " of " + parseInt(H, 10) + " rules)";
                            K.innerHTML = '<input type="hidden" name="ruleset-id" value="' + D.id + '">';
                            w.innerHTML = '<input type="hidden" name="ruleset-name" value="' + D.name + '">';
                            J.innerHTML = D.name } else { K.innerHTML = "";
                            w.innerHTML = "";
                            J.innerHTML = "New";
                            q.innerHTML = "" }
                        v.innerHTML = t } };
                YSLOW.registerRenderer({ id: "html", supports: { components: 1, reportcard: 1, stats: 1, tools: 1, rulesetEdit: 1 }, genComponentsTable: function(r, C, v) {
                        var A, y, B, z, u = { type: "TYPE", size: "SIZE<br> (KB)", gzip: "GZIP<br> (KB)", "set-cookie": "COOKIE&nbsp;RECEIVED<br>(bytes)", cookie: "COOKIE&nbsp;SENT<br>(bytes)", headers: "HEADERS", url: "URL", expires: "EXPIRES<br>(Y/M/D)", respTime: "RESPONSE<br> TIME&nbsp;(ms)", etag: "ETAG", action: "ACTION" },
                            x = false,
                            t = "",
                            w = "",
                            q = 0,
                            s = 0;
                        if (C !== undefined && u[C] === undefined) {
                            return "" }
                        if (YSLOW.renderer.bPrintable) { C = YSLOW.renderer.sortBy;
                            v = YSLOW.renderer.sortDesc } else {
                            if (C === undefined || C === "type") { C = "type";
                                x = true } }
                        r = YSLOW.renderer.sortComponents(r, C, v);
                        t += '<table id="components-table"><tr>';
                        for (A in u) {
                            if (u.hasOwnProperty(A) && u[A]) {
                                if (YSLOW.renderer.bPrintable && (A === "action" || A === "components" || A === "headers")) {
                                    continue }
                                t += "<th";
                                if (C === A) { t += ' class=" sortBy"' }
                                t += ">";
                                if (YSLOW.renderer.bPrintable) { t += u[A] } else { t += '<div class="';
                                    if (C === A) { t += (v ? " sortDesc" : " sortAsc") }
                                    t += '"><a href="javascript:document.ysview.regenComponentsTable(document, \'' + A + "'" + (C === A ? (v ? ", false" : ", true") : "") + ')">' + (C === A ? (v ? "&darr;" : "&uarr;") : "") + " " + u[A] + "</a></div>" } } }
                        t += "</tr>";
                        for (y = 0; y < r.length; y += 1) { z = r[y];
                            if ((C === undefined || C === "type") && !YSLOW.renderer.bPrintable) {
                                if (B === undefined) { B = z.type } else {
                                    if (B !== z.type) { t += '<tr class="type-summary ' + (x ? "expand" : "collapse") + '"><td><a href="javascript:document.ysview.expandCollapseComponentType(document, \'' + B + '\')"><b class="expcol"><b class="exp exph"></b><b class="exp expv"></b><b class="col"></b></b><span class="rowTitle type-' + B + '">' + B + "&nbsp;(" + q + ')</span></a></td><td class="size">' + YSLOW.util.kbSize(s) + "</td><td><!-- GZIP --></td><td></td><td></td><td><!-- HEADERS --></td><td><!-- URL --></td><td><!-- EXPIRES --></td><td><!-- RESPTIME --></td><td><!-- ETAG --></td><td><!-- ACTION--></td></tr>";
                                        t += w;
                                        w = "";
                                        q = 0;
                                        s = 0;
                                        B = z.type } }
                                w += YSLOW.renderer.genComponentRow(u, z, (q % 2 === 0 ? "even" : "odd"), x);
                                q += 1;
                                s += z.size } else { t += YSLOW.renderer.genComponentRow(u, z, (y % 2 === 0 ? "even" : "odd"), false) } }
                        if (w.length > 0) { t += '<tr class="type-summary ' + (x ? "expand" : "collapse") + '"><td><a href="javascript:document.ysview.expandCollapseComponentType(document, \'' + B + '\')"><b class="expcol"><b class="exp exph"></b><b class="exp expv"></b><b class="col"></b></b><span class="rowTitle type-' + B + '">' + B + "&nbsp;(" + q + ')</span></a></td><td class="size">' + YSLOW.util.kbSize(s) + "</td><td><!-- GZIP --></td><td></td><td></td><td><!-- HEADERS --></td><td><!-- URL --></td><td><!-- EXPIRES --></td><td><!-- RESPTIME --></td><td><!-- ETAG --></td><td><!-- ACTION--></td></tr>";
                            t += w }
                        t += "</table>";
                        return t }, componentsView: function(w, r) {
                        var t, s = this.genComponentsTable(w, YSLOW.renderer.sortBy, false),
                            u = "in type column indicates the component is loaded after window onload event.",
                            q = "denotes 1x1 pixels image that may be image beacon",
                            v = "Components";
                        if (YSLOW.doc) {
                            if (YSLOW.doc.components_legend) {
                                if (YSLOW.doc.components_legend.beacon) { u = YSLOW.doc.components_legend.beacon }
                                if (YSLOW.doc.components_legend.after_onload) { q = YSLOW.doc.components_legend.after_onload } }
                            if (YSLOW.doc.view_names && YSLOW.doc.view_names.components) { v = YSLOW.doc.view_names.components } }
                        t = '<div id="componentsDiv"><div id="summary"><span class="view-title">' + v + '</span>The page has a total of <span class="number">' + w.length + '</span> components and a total weight of <span class="number">' + YSLOW.util.kbSize(r) + '</span> bytes</div><div id="expand-all"><a href="javascript:document.ysview.expandAll(document)"><b>&#187;</b><span id="expand-all-text">Expand All</span></a></div><div id="components">' + s + '</div><div class="legend">* ' + u + "<br>&#8224; " + q + "</div></div>";
                        return t }, reportcardPrintableView: function(t, r, w) {
                        var u, s, y, q, x, v = '<div id="reportDiv"><table><tr class="header"><td colspan="2">Overall Grade: ' + r + "  (Ruleset applied: " + w.name + ")</td></tr>";
                        for (u = 0; u < t.length; u += 1) { y = t[u];
                            if (typeof y === "object") { q = YSLOW.util.prettyScore(y.score);
                                x = "grade-" + (q === "N/A" ? "NA" : q);
                                v += '<tr><td class="grade ' + x + '"><b>' + q + '</b></td><td class="desc"><p>' + y.name + '<br><div class="message">' + y.message + "</div>";
                                if (y.components && y.components.length > 0) { v += '<ul class="comps-list">';
                                    for (s = 0; s < y.components.length; s += 1) {
                                        if (typeof y.components[s] === "string") { v += "<li>" + y.components[s] + "</li>" } else {
                                            if (y.components[s].url !== undefined) { v += "<li>" + YSLOW.util.briefUrl(y.components[s].url, 60) + "</li>" } } }
                                    v += "</ul><br>" }
                                v += "</p></td></tr>" } }
                        v += "</table></div>";
                        return v }, getFilterCode: function(x, u, s, q) {
                        var w, r, v, y, B, C, t, A = u.length,
                            z = [];
                        for (r in x) {
                            if (x.hasOwnProperty(r) && x[r]) { z.push(r) } }
                        z.sort();
                        w = '<div id="filter"><ul><li class="first selected" id="all" onclick="javascript:document.ysview.updateFilterSelection(event)"><a href="#">ALL (' + A + ')</a></li><li class="first">FILTER BY: </li>';
                        for (v = 0, y = z.length; v < y; v += 1) { w += "<li";
                            if (v === 0) { w += ' class="first"' }
                            w += ' id="' + z[v] + '" onclick="javascript:document.ysview.updateFilterSelection(event)"><a href="#">' + z[v].toUpperCase() + " (" + x[z[v]] + ")</a></li>" }
                        B = "http://yslow.org/scoremeter/?url=" + encodeURIComponent(q) + "&grade=" + s;
                        for (v = 0; v < A; v += 1) { C = u[v];
                            t = parseInt(C.score, 10);
                            if (t >= 0 && t < 100) { B += "&" + C.rule_id.toLowerCase() + "=" + t } }
                        B = encodeURIComponent(encodeURIComponent(B));
                        q = encodeURIComponent(encodeURIComponent(q.slice(0, 60) + (q.length > 60 ? "..." : "")));
                        w += '<li class="social"><a class="facebook" href="javascript:document.ysview.openPopup(\'http://www.facebook.com/sharer.php?t=YSlow%20Scoremeter&u=' + B + "', 'facebook')\" title=\"Share these results\"><span>Share</span></a></li>";
                        w += '<li class="social"><a class="twitter" href="javascript:document.ysview.openPopup(\'http://twitter.com/share?original_referer=&source=tweetbutton&text=YSlow%20grade%20' + s + "%20for%20" + q + "&url=" + B + "&via=yslow', 'twitter')\" title=\"Tweet these results\"><span>Tweet</spam></a></li>";
                        w += "</ul></div>";
                        return w }, reportcardView: function(s) {
                        var w, H, F, E, x, r, v, L, B, I, K, J, q, u, y = '<div id="reportDiv">',
                            G = s.getRulesetApplied(),
                            A = s.getResults(),
                            t = s.url,
                            M = "Grade",
                            D = "",
                            C = "",
                            z = {};
                        if (YSLOW.doc) {
                            if (YSLOW.doc.view_names && YSLOW.doc.view_names.grade) { M = YSLOW.doc.view_names.grade } }
                        w = YSLOW.util.prettyScore(s.getOverallScore());
                        if (YSLOW.renderer.bPrintable) {
                            return this.reportcardPrintableView(A, w, G) }
                        y += '<div id="summary"><table><tr><td><div class="bigFont">' + M + '</div></td><td class="padding5"><div id="overall-grade" class="grade-' + w + '">' + w + '</div></td><td class="padding15">Overall performance score ' + Math.round(s.getOverallScore()) + '</td><td class="padding15">Ruleset applied: ' + G.name + '</td><td class="padding15">URL: ' + YSLOW.util.briefUrl(t, 100) + "</td></tr></table></div>";
                        for (H = 0; H < A.length; H += 1) { x = A[H];
                            if (typeof x === "object") { r = YSLOW.util.prettyScore(x.score);
                                v = H + 1;
                                L = "";
                                B = "grade-" + (r === "N/A" ? "NA" : r);
                                I = parseInt(x.score, 10);
                                if (isNaN(I) || x.score === -1) { I = "n/a" } else { I += "%" }
                                D += '<li id="label' + v + '"';
                                if (H === 0) { L += "first selected" }
                                if (x.category) {
                                    for (E = 0; E < x.category.length; E += 1) {
                                        if (L.length > 0) { L += " " }
                                        L += x.category[E];
                                        if (z[x.category[E]] === undefined) { z[x.category[E]] = 0 }
                                        z[x.category[E]] += 1 } }
                                if (L.length > 0) { D += ' class="' + L + '"' }
                                D += ' onclick="javascript:document.ysview.onclickResult(event)"><a href="#" class="' + B + '"><div class="tab-label"><span class="grade" title="' + I + '">' + r + '</span><span class="desc">' + x.name + "</span></div></a></li>";
                                C += '<div id="tab' + v + '" class="result-tab';
                                if (H !== 0) { C += " yui-hidden" }
                                K = x.message.split("\n");
                                if (K) { x.message = K.join("<br>") }
                                C += '"><h4>Grade ' + r + " on " + x.name + "</h4><p>" + x.message + "<br>";
                                if (x.components && x.components.length > 0) { C += '<ul class="comps-list">';
                                    for (F = 0; F < x.components.length; F += 1) { J = x.components[F];
                                        if (typeof J === "string") { C += "<li>" + J + "</li>" } else {
                                            if (J.url !== undefined) { C += "<li>";
                                                q = x.rule_id.toLowerCase();
                                                if (x.rule_id.match("expires")) { C += "(" + YSLOW.util.prettyExpiresDate(J.expires) + ") " }
                                                C += YSLOW.util.prettyAnchor(J.url, J.url, undefined, true, 120, undefined, J.type) + "</li>" } } }
                                    C += "</ul><br>" }
                                C += "</p>";
                                u = YSLOW.controller.getRule(x.rule_id);
                                if (u) { C += '<hr><p class="rule-info">' + (u.info || "** To be added **") + "</p>";
                                    if (u.url !== undefined) { C += '<p class="more-info"><a href="javascript:document.ysview.openLink(\'' + u.url + "')\"><b>&#187;</b>Read More</a></p>" } }
                                C += "</div>" } }
                        y += '<div id="reportInnerDiv">' + this.getFilterCode(z, A, w, t) + '<div id="result" class="yui-navset yui-navset-left"><ul class="yui-nav" id="tab-label-list">' + D + '</ul><div class="yui-content">' + C + '</div><div id="copyright2">' + YSLOW.doc.copyright + "</div></div></div></div>";
                        return y }, statsView: function(r) {
                        var q = "",
                            s = "Stats";
                        if (YSLOW.doc) {
                            if (YSLOW.doc.view_names && YSLOW.doc.view_names.stats) { s = YSLOW.doc.view_names.stats } }
                        q += '<div id="statsDiv"><div id="summary"><span class="view-title">' + s + '</span>The page has a total of <span class="number">' + r.PAGE.totalRequests + '</span> HTTP requests and a total weight of <span class="number">' + YSLOW.util.kbSize(r.PAGE.totalSize) + "</span> bytes with empty cache</div>";
                        q += '<div class="section-header">WEIGHT GRAPHS</div>';
                        q += '<div id="empty-cache"><div class="stats-graph floatLeft"><div class="canvas-title">Empty Cache</div><canvas id="comp-canvas-empty" width="150" height="150"></canvas></div><div class="yslow-stats-empty">' + YSLOW.renderer.genStats(r, false) + "</div></div>";
                        q += '<div id="primed-cache"><div class="stats-graph floatLeft"><div class="canvas-title">Primed Cache</div><canvas id="comp-canvas-primed" width="150" height="150"></canvas></div><div class="yslow-stats-primed">' + YSLOW.renderer.genStats(r, true) + "</div></div>";
                        q += "</div>";
                        return q }, toolsView: function(u) {
                        var t, s, r, q = "<table>",
                            w = "Tools",
                            v = "Click the Launch Tool link next to the tool you want to run to start the tool.";
                        if (YSLOW.doc) {
                            if (YSLOW.doc.tools_desc) { v = YSLOW.doc.tools_desc }
                            if (YSLOW.doc.view_names && YSLOW.doc.view_names.tools) { w = YSLOW.doc.view_names.tools } }
                        for (t = 0; t < u.length; t += 1) { r = u[t];
                            q += '<tr><td class="name"><b><a href="#" onclick="javascript:document.ysview.runTool(\'' + r.id + "', {'yscontext': document.yslowContext })\">" + r.name + "</a></b></td><td>-</td><td>" + (r.short_desc || "Short text here explaining what are the main benefits of running this App") + "</td></tr>" }
                        q += "</table>";
                        s = '<div id="toolsDiv"><div id="summary"><span class="view-title">' + w + "</span>" + v + '</div><div id="tools">' + q + "</div></div>";
                        return s }, rulesetEditView: function(D) {
                        var s, B, u, t, w = '<div id="settingsDiv" class="yui-navset yui-navset-left">',
                            C, z, y = 0,
                            r = false,
                            q, v, A = "Rule Settings",
                            x = "Choose which ruleset better fit your specific needs. You can Save As an existing rule, based on an existing ruleset.";
                        if (YSLOW.doc) {
                            if (YSLOW.doc.rulesettings_desc) { x = YSLOW.doc.rulesettings_desc }
                            if (YSLOW.doc.view_names && YSLOW.doc.view_names.rulesetedit) { A = YSLOW.doc.view_names.rulesetedit } }
                        v = YSLOW.controller.getDefaultRulesetId();
                        C = '<ul class="yui-nav"><li class="header">STANDARD SETS</li>';
                        for (s in D) {
                            if (D.hasOwnProperty(s) && D[s]) { B = D[s];
                                u = "tab" + y;
                                if (!r && B.custom === true) { C += '<li class="new-section header" id="custom-set-title">CUSTOM SETS</li>';
                                    r = true }
                                C += '<li id="label' + y + '" class="ruleset-' + B.id;
                                if (s === v) { q = D[s];
                                    C += ' selected"' }
                                C += '" onclick="javascript:document.ysview.onclickRuleset(event)"><a href="#' + u + '">' + B.name + "</a></li>";
                                y += 1 } }
                        C += '<li class="new-section create-ruleset" id="create-ruleset"><input type="button" value="New Set" onclick="javascript:document.ysview.createRuleset(this, \'edit-form\')"></li></ul>';
                        z = '<div class="yui-content">' + YSLOW.renderer.genRulesetEditForm(q) + "</div>";
                        w += C + z;
                        t = '<div id="rulesetEditDiv"><div id="summary"><span class="view-title">' + A + "</span>" + x + "</div>" + w + "</div>";
                        return t }, rulesetEditUpdateTab: function(I, q, C, r, A) {
                        var s, B, F, u, z, G, D, x, t, y, H, E, v, w = q.parentNode.parentNode.parentNode;
                        if (w && w.id === "settingsDiv" && C.custom === true) { s = w.firstChild;
                            B = s.nextSibling;
                            if (r < 1) { F = s.firstChild;
                                while (F) { u = F.className.indexOf("ruleset-");
                                    if (u !== -1) { z = F.className.substring(u + 8);
                                        u = z.indexOf(" ");
                                        if (u !== -1) { z = z.substring(0, u) }
                                        if (C.id === z) { u = F.id.indexOf("label");
                                            if (u !== -1) { G = F.id.substring(u + 5);
                                                if (F.className.indexOf("selected") !== -1) { D = {};
                                                    D.currentTarget = H;
                                                    I.ysview.onclickRuleset(D) }
                                                if (F.previousSibling && F.previousSibling.id === "custom-set-title" && F.nextSibling && F.nextSibling.id === "create-ruleset") { x = F.previousSibling }
                                                s.removeChild(F);
                                                if (x) { s.removeChild(x) } }
                                            break } else { H = F } }
                                    F = F.nextSibling } } else { F = s.lastChild;
                                while (F) { y = F.id.indexOf("label");
                                    if (y !== -1) { t = F.id.substring(y + 5);
                                        break }
                                    F = F.previousSibling }
                                t = Number(t) + 1;
                                F = I.createElement("li");
                                F.className = "ruleset-" + C.id;
                                F.id = "label" + t;
                                F.onclick = function(J) { I.ysview.onclickRuleset(J) };
                                F.innerHTML = '<a href="#tab' + t + '">' + C.name + "</a>";
                                s.insertBefore(F, s.lastChild);
                                E = s.firstChild;
                                while (E) {
                                    if (E.id && E.id === "custom-set-title") { x = E;
                                        break }
                                    E = E.nextSibling }
                                if (!x) { x = I.createElement("li");
                                    x.className = "new-section header";
                                    x.id = "custom-set-title";
                                    x.innerHTML = "CUSTOM SETS";
                                    s.insertBefore(x, F) }
                                if (A) { v = {};
                                    v.currentTarget = F;
                                    I.ysview.onclickRuleset(v) } } } }, hasClassName: function(t, q) {
                        var r, s = t.split(" ");
                        if (s) {
                            for (r = 0; r < s.length; r += 1) {
                                if (s[r] === q) {
                                    return true } } }
                        return false }, expandCollapseComponentType: function(K, H, u, q, s) {
                        var B, F, C, J, w, D, y, E, t, G, z, I, x, A, r = this.hasClassName,
                            v = { expand: 0, collapse: 0 };
                        if (typeof s === "boolean" && s === true) { J = true }
                        if (H) {
                            for (F = 0, G = H.rows.length; F < G; F += 1) { w = H.rows[F];
                                t = w.className;
                                if (r(t, "type-summary")) {
                                    if (r(t, "expand")) { v.expand += 1;
                                        B = false } else {
                                        if (r(t, "collapse")) { v.collapse += 1;
                                            B = true } }
                                    D = w.getElementsByTagName("span")[0];
                                    if (J || r(D.className, "type-" + u)) {
                                        if (J) { y = D.className.split(" ");
                                            for (C = 0; C < y.length; C += 1) {
                                                if (y[C].substring(0, 5) === "type-") { u = y[C].substring(5) } } }
                                        if (typeof B !== "boolean" || (typeof q === "boolean" && q === B)) {
                                            if (J) { B = !q;
                                                continue } else {
                                                return } }
                                        YSLOW.view.removeClassName(w, (B ? "collapse" : "expand"));
                                        w.className += (B ? " expand" : " collapse");
                                        if (B) { v.collapse -= 1;
                                            v.expand += 1 } else { v.collapse += 1;
                                            v.expand -= 1 } } } else {
                                    if (r(t, "type-" + u)) {
                                        if (B) { w.style.display = "none";
                                            E = w.nextSibling;
                                            if (E.id.indexOf("compHeaders") !== -1) { E.style.display = "none" } } else { w.style.display = "table-row" } } } } }
                        if (v.expand === 0 || v.collapse === 0) { z = H.parentNode.previousSibling;
                            if (z) { I = z.getElementsByTagName("span");
                                for (F = 0; F < I.length; F += 1) {
                                    if (I[F].id === "expand-all-text") { x = I[F] } }
                                A = false;
                                if (x.innerHTML.indexOf("Expand") !== -1) { A = true }
                                if (A) {
                                    if (v.expand === 0) { x.innerHTML = "Collapse All" } } else {
                                    if (v.collapse === 0) { x.innerHTML = "Expand All" } } } } }, expandAllComponentType: function(w, v) {
                        var u, r, s = false,
                            t = v.parentNode.previousSibling,
                            q = t.getElementsByTagName("span");
                        for (r = 0; r < q.length; r += 1) {
                            if (q[r].id === "expand-all-text") { u = q[r] } }
                        if (u) {
                            if (u.innerHTML.indexOf("Expand") !== -1) { s = true } }
                        this.expandCollapseComponentType(w, v, undefined, s, true);
                        if (u) { u.innerHTML = (s ? "Collapse All" : "Expand All") } }, regenComponentsTable: function(w, u, v, r, x) {
                        var q, t, s;
                        if (u) {
                            if (r === undefined) { r = false }
                            if (v === "type") { q = true }
                            t = u.parentNode.previousSibling;
                            if (t.id === "expand-all") { t.style.visibility = (q ? "visible" : "hidden") }
                            s = this.genComponentsTable(x.components, v, r);
                            u.parentNode.innerHTML = s } }, saveRuleset: function(y, r) {
                        var t, s, v, q, u, z, B, A, x = {},
                            w = {};
                        if (r) { x.custom = true;
                            x.rules = {};
                            x.weights = {};
                            for (t = 0; t < r.elements.length; t += 1) { s = r.elements[t];
                                if (s.name === "rules" && s.type === "checkbox") {
                                    if (s.checked) { x.rules[s.value] = {} } } else {
                                    if (s.name === "saveas-name") { u = s.value } else {
                                        if (s.name === "ruleset-name") { z = s.value } else {
                                            if (s.name === "ruleset-id") { B = s.value } else {
                                                if ((v = s.name.indexOf("weight-")) !== -1) { w[s.name.substring(v)] = s.value } } } } } }
                            A = x.rules;
                            for (q in A) {
                                if (A.hasOwnProperty(q) && w["weight-" + q]) { x.weights[q] = parseInt(w["weight-" + q], 10) } }
                            if (u) { x.id = u.replace(/\s/g, "-");
                                x.name = u } else { x.id = B;
                                x.name = z }
                            if (x.id && x.name) { YSLOW.controller.addRuleset(x, true);
                                YSLOW.controller.saveRulesetToPref(x);
                                if (u !== undefined) { this.updateRulesetUI(y, r, x, 1) } } } }, updateRulesetUI: function(v, u, q, t) {
                        var s, r = v.getElementsByTagName("form");
                        for (s = 0; s < r.length; s += 1) {
                            if (r[s].id === u.id) { this.rulesetEditUpdateTab(v, r[s], q, t, (r[s] === u)) } }
                        v.ysview.updateRulesetList() }, deleteRuleset: function(t, s) {
                        var r = this.getEditFormRulesetId(s),
                            q = YSLOW.controller.removeRuleset(r);
                        if (q && q.custom) { YSLOW.controller.deleteRulesetFromPref(q);
                            this.updateRulesetUI(t, s, q, -1) } }, getEditFormRulesetId: function(r) {
                        var q, s = r.getElementsByTagName("input");
                        for (q = 0; q < s.length; q += 1) {
                            if (s[q].name === "ruleset-id") {
                                return s[q].value } }
                        return undefined } });
                YSLOW.registerRenderer({ id: "xml", supports: { components: 1, reportcard: 1, stats: 1 }, componentsView: function(u, r) {
                        var t, q, s = "<components>";
                        for (t = 0; t < u.length; t += 1) { s += "<component>";
                            s += "<type>" + u[t].type + "</type>";
                            s += "<size>" + u[t].size + "</size>";
                            if (u[t].compressed === false) { s += "<gzip/>" } else { s += "<gzip>" + (u[t].size_compressed !== undefined ? parseInt(u[t].size_compressed, 10) : "uncertain") + "</gzip>" }
                            q = u[t].getSetCookieSize();
                            if (q > 0) { s += "<set-cookie>" + parseInt(q, 10) + "</set-cookie>" }
                            q = u[t].getReceivedCookieSize();
                            if (q > 0) { s += "<cookie>" + parseInt(q, 10) + "</cookie>" }
                            s += "<url>" + encodeURI(u[t].url) + "</url>";
                            s += "<expires>" + u[t].expires + "</expires>";
                            s += "<resptime>" + u[t].respTime + "</resptime>";
                            s += "<etag>" + u[t].getEtag() + "</etag>";
                            s += "</component>" }
                        s += "</components>";
                        return s }, reportcardView: function(w) {
                        var t, r, y, u = w.getOverallScore(),
                            s = YSLOW.util.prettyScore(u),
                            x = w.getRulesetApplied(),
                            v = w.getResults(),
                            q = '<performance ruleset="' + x.name + '" url="' + w.url + '">';
                        q += '<overall grade="' + s + '" score="' + u + '" />';
                        for (t = 0; t < v.length; t += 1) { y = v[t];
                            q += '<lints id="' + y.rule_id + '" ruletext="' + y.name + '" hreftext="' + YSLOW.controller.getRule(y.rule_id).url + '" grade="' + YSLOW.util.prettyScore(y.score) + '" score="' + y.score + '" category="' + y.category.join(",") + '">';
                            q += "<message>" + y.message + "</message>";
                            if (v.components && v.components.length > 0) { q += "<offenders>";
                                for (r = 0; r < y.components.length; r += 1) {
                                    if (typeof y.components[r] === "string") { q += "<offender>" + y.components[r] + "</offender>" } else {
                                        if (y.components[r].url !== undefined) { q += "<offender>" + y.components[r].url + "</offender>" } } }
                                q += "</offenders>" }
                            q += "</lints>" }
                        q += "</performance>";
                        return q }, statsView: function(t) {
                        var s, w, r, v = '<items type="primedCache">',
                            u = '<items type="emptyCache">',
                            q = YSLOW.peeler.types;
                        for (s = 0; s < q.length; s += 1) { w = q[s];
                            if ((t.PAGE.totalObjCountPrimed[w]) !== undefined) { v += '<item type="' + w + '" count="' + t.PAGE.totalObjCountPrimed[w] + '" size="' + t.PAGE.totalObjSizePrimed[w] + '" />' }
                            if ((t.PAGE.totalObjCount[w]) !== undefined) { u += '<item type="' + w + '" count="' + t.PAGE.totalObjCount[w] + '" size="' + t.PAGE.totalObjSize[w] + '" />' } }
                        v += "</items>";
                        u += "</items>";
                        r = '<stats numRequests="' + t.PAGE.totalRequests + '" totalSize="' + t.PAGE.totalSize + '" numRequests_p="' + t.PAGE.totalRequestsPrimed + '" totalSize_p="' + t.PAGE.totalSizePrimed + '">' + v + u + "</stats>";
                        return r } });
                YSLOW.peeler = { types: ["doc", "js", "css", "iframe", "flash", "cssimage", "image", "favicon", "xhr", "redirect", "font"], NODETYPE: { ELEMENT: 1, DOCUMENT: 9 }, CSSRULE: { IMPORT_RULE: 3, FONT_FACE_RULE: 5 }, peel: function(q, r) {}, findDocuments: function(r) {
                        var y, B, u, z, v, w, q, C, A, s = {};
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 1, message: "Finding documents" });
                        if (!r) {
                            return }
                        if (!YSLOW.util.Preference.getPref("extensions.yslow.getFramesComponents", true)) { s[r.URL] = { document: r, type: "doc" };
                            return s }
                        z = "doc";
                        if (r.nodeType === this.NODETYPE.DOCUMENT) { B = r;
                            u = r.URL } else {
                            if (r.nodeType === this.NODETYPE.ELEMENT && r.nodeName.toLowerCase() === "frame") { B = r.contentDocument;
                                u = r.src } else {
                                if (r.nodeType === this.NODETYPE.ELEMENT && r.nodeName.toLowerCase() === "iframe") { B = r.contentDocument;
                                    u = r.src;
                                    z = "iframe";
                                    try { A = r.contentWindow;
                                        A = A && A.parent;
                                        A = A && A.document;
                                        A = A || r.ownerDocument;
                                        if (A && A.URL === u) { u = !r.getAttribute("src") ? "" : "about:blank" } } catch (t) { YSLOW.util.dump(t) } } else {
                                    return s } } }
                        s[u] = { document: B, type: z };
                        try { y = B.getElementsByTagName("iframe");
                            for (v = 0, w = y.length; v < w; v += 1) { q = y[v];
                                if (q.src) { C = this.findDocuments(q);
                                    if (C) { s = YSLOW.util.merge(s, C) } } }
                            y = B.getElementsByTagName("frame");
                            for (v = 0, w = y.length; v < w; v += 1) { q = y[v];
                                C = this.findDocuments(q);
                                if (C) { s = YSLOW.util.merge(s, C) } } } catch (x) { YSLOW.util.dump(x) }
                        return s }, findComponentsInNode: function(s, q, y) {
                        var r = [];
                        try { r = this.findStyleSheets(s, q) } catch (z) { YSLOW.util.dump(z) }
                        try { r = r.concat(this.findScripts(s)) } catch (x) { YSLOW.util.dump(x) }
                        try { r = r.concat(this.findFlash(s)) } catch (w) { YSLOW.util.dump(w) }
                        try { r = r.concat(this.findCssImages(s)) } catch (v) { YSLOW.util.dump(v) }
                        try { r = r.concat(this.findImages(s)) } catch (u) { YSLOW.util.dump(u) }
                        try {
                            if (y === "doc") { r = r.concat(this.findFavicon(s, q)) } } catch (t) { YSLOW.util.dump(t) }
                        return r }, addComponentsNotInNode: function(r, q) {
                        var t, s, u, y, v, w = ["flash", "js", "css", "doc", "redirect"],
                            x = YSLOW.net.getResponseURLsByType("xhr");
                        if (x.length > 0) {
                            for (s = 0; s < x.length; s += 1) { r.addComponent(x[s], "xhr", q) } }
                        u = YSLOW.net.getResponseURLsByType("image");
                        if (u.length > 0) {
                            for (s = 0; s < u.length; s += 1) { y = "image";
                                if (u[s].indexOf("favicon.ico") !== -1) { y = "favicon" }
                                r.addComponentNoDuplicate(u[s], y, q) } }
                        for (t = 0; t < w.length; t += 1) { v = YSLOW.net.getResponseURLsByType(w[t]);
                            for (s = 0; s < v.length; s += 1) { r.addComponentNoDuplicate(v[s], w[t], q) } } }, findStyleSheets: function(t, q) {
                        var A, r, u, y, z = t.getElementsByTagName("head")[0],
                            w = t.getElementsByTagName("body")[0],
                            s = [],
                            x = this,
                            v = function(F, C) {
                                var E, B, H, D, G;
                                for (E = 0, B = F.length; E < B; E += 1) { H = F[E];
                                    D = H.href || H.getAttribute("href");
                                    if (D && (H.rel === "stylesheet" || H.type === "text/css")) { s.push({ type: "css", href: D === t.URL ? "" : D, containerNode: C });
                                        G = YSLOW.util.makeAbsoluteUrl(D, q);
                                        s = s.concat(x.findImportedStyleSheets(H.sheet, G)) } } };
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 2, message: "Finding StyleSheets" });
                        if (z || w) {
                            if (z) { v(z.getElementsByTagName("link"), "head") }
                            if (w) { v(w.getElementsByTagName("link"), "body") } } else { v(t.getElementsByTagName("link")) }
                        A = t.getElementsByTagName("style");
                        for (u = 0, y = A.length; u < y; u += 1) { r = A[u];
                            s = s.concat(x.findImportedStyleSheets(r.sheet, q)) }
                        return s }, findImportedStyleSheets: function(z, q) {
                        var t, A, x, u, r, v, y = /url\s*\(["']*([^"'\)]+)["']*\)/i,
                            s = [];
                        try {
                            if (!(A = z.cssRules)) {
                                return s }
                            for (t = 0, v = A.length; t < v; t += 1) { x = A[t];
                                if (x.type === YSLOW.peeler.CSSRULE.IMPORT_RULE && x.styleSheet && x.href) { s.push({ type: "css", href: x.href, base: q });
                                    u = YSLOW.util.makeAbsoluteUrl(x.href, q);
                                    s = s.concat(this.findImportedStyleSheets(x.styleSheet, u)) } else {
                                    if (x.type === YSLOW.peeler.CSSRULE.FONT_FACE_RULE) {
                                        if (x.style && typeof x.style.getPropertyValue === "function") { r = x.style.getPropertyValue("src");
                                            r = y.exec(r);
                                            if (r) { r = r[1];
                                                s.push({ type: "font", href: r, base: q }) } } } else {
                                        break } } } } catch (w) { YSLOW.util.dump(w) }
                        return s }, findScripts: function(t) {
                        var u = [],
                            s = t.getElementsByTagName("head")[0],
                            q = t.getElementsByTagName("body")[0],
                            r = function(w, x) {
                                var z, v, y, A, B;
                                for (z = 0, v = w.length; z < v; z += 1) { y = w[z];
                                    A = y.type;
                                    if (A && A.toLowerCase().indexOf("javascript") < 0) {
                                        continue }
                                    B = y.src || y.getAttribute("src");
                                    if (B) { u.push({ type: "js", href: B === t.URL ? "" : B, containerNode: x }) } } };
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 3, message: "Finding JavaScripts" });
                        if (s || q) {
                            if (s) { r(s.getElementsByTagName("script"), "head") }
                            if (q) { r(q.getElementsByTagName("script"), "body") } } else { r(t.getElementsByTagName("script")) }
                        return u }, findFlash: function(u) {
                        var s, t, r, q, v = [];
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 4, message: "Finding Flash" });
                        r = u.getElementsByTagName("embed");
                        for (s = 0, q = r.length; s < q; s += 1) { t = r[s];
                            if (t.src) { v.push({ type: "flash", href: t.src }) } }
                        r = u.getElementsByTagName("object");
                        for (s = 0, q = r.length; s < q; s += 1) { t = r[s];
                            if (t.data && t.type === "application/x-shockwave-flash") { v.push({ type: "flash", href: t.data }) } }
                        return v }, findCssImages: function(u) {
                        var z, x, t, w, q, r, A, s = [],
                            y = {},
                            B = ["backgroundImage", "listStyleImage", "content", "cursor"],
                            v = B.length;
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 5, message: "Finding CSS Images" });
                        w = u.getElementsByTagName("*");
                        for (z = 0, A = w.length; z < A; z += 1) { t = w[z];
                            for (x = 0; x < v; x += 1) { q = B[x];
                                r = YSLOW.util.getComputedStyle(t, q, true);
                                if (r && !y[r]) { s.push({ type: "cssimage", href: r });
                                    y[r] = 1 } } }
                        return s }, findImages: function(t) {
                        var s, r, x, v, q, w = [],
                            u = {};
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 6, message: "Finding Images" });
                        x = t.getElementsByTagName("img");
                        for (s = 0, q = x.length; s < q; s += 1) { r = x[s];
                            v = r.src;
                            if (v && !u[v]) { w.push({ type: "image", href: v, obj: { width: r.width, height: r.height } });
                                u[v] = 1 } }
                        return w }, findFavicon: function(w, u) {
                        var t, r, v, s, q, x = [];
                        YSLOW.util.event.fire("peelProgress", { total_step: 7, current_step: 7, message: "Finding favicon" });
                        s = w.getElementsByTagName("link");
                        for (t = 0, r = s.length; t < r; t += 1) { v = s[t];
                            q = (v.rel || "").toLowerCase();
                            if (v.href && (q === "icon" || q === "shortcut icon")) { x.push({ type: "favicon", href: v.href }) } }
                        if (!x.length) { x.push({ type: "favicon", href: YSLOW.util.makeAbsoluteUrl("/favicon.ico", u) }) }
                        return x }, getBaseHref: function(s) {
                        var q;
                        try { q = s.getElementsByTagName("base")[0];
                            q = (q && q.href) || s.URL } catch (r) { YSLOW.util.dump(r) }
                        return q } };
                YSLOW.peeler.peel = function(t) {
                    var q, w, v, u, r, x = [];
                    try { w = this.findDocuments(t);
                        for (q in w) {
                            if (w.hasOwnProperty(q)) { v = w[q];
                                if (v) { x.push({ type: v.type, href: q });
                                    u = v.document;
                                    if (u && q) { r = this.getBaseHref(u);
                                        x = x.concat(this.findComponentsInNode(u, r, v.type)) } } } } } catch (s) { YSLOW.util.dump(s);
                        YSLOW.util.event.fire("peelError", { message: s }) }
                    return x } };
            l = "YSLOW.phantomjs = {resources: " + JSON.stringify(h) + ",args: " + JSON.stringify(yslowArgs) + ",loadTime: " + JSON.stringify(n) + "};";
            o = function() { YSLOW.phantomjs.run = function() {
                    try {
                        var D, z, A, u, K = document,
                            F = YSLOW,
                            x = new F.context(K),
                            y = F.peeler,
                            C = y.peel(K),
                            r = y.getBaseHref(K),
                            w = new F.ComponentSet(K),
                            G = F.phantomjs,
                            I = G.resources,
                            s = G.args,
                            J = F.util,
                            B, E = function(M) {
                                var N, O = (s.format || "").toLowerCase(),
                                    P = { tap: { func: J.formatAsTAP, contentType: "text/plain" }, junit: { func: J.formatAsJUnit, contentType: "text/xml" } };
                                switch (O) {
                                    case "xml":
                                        return { content: J.objToXML(M), contentType: "text/xml" };
                                    case "plain":
                                        return { content: J.prettyPrintResults(M), contentType: "text/plain" };
                                    case "tap":
                                    case "junit":
                                        try { u = JSON.parse(s.threshold) } catch (L) { u = s.threshold }
                                        N = P[O].func(J.testResults(M, u));
                                        return { content: N.content, contentType: P[O].contentType, failures: N.failures };
                                    default:
                                        return { content: JSON.stringify(M), contentType: "application/json" } } },
                            H = function(M) {
                                var L = /^([^:]+):\s*([\s\S]+)$/,
                                    O = /[\n\r]/g,
                                    N = {};
                                M.split("\n").forEach(function(Q) {
                                    var P = L.exec(Q.replace(O, ""));
                                    if (P) { N[P[1]] = P[2] } });
                                return N };
                        C.forEach(function(U) {
                            var X = I[U.href] || I[F.util.makeAbsoluteUrl(U.href, U.base)] || {};
                            if (X.response === undefined) {
                                try {
                                    var W, S, R, V, N, L, T, M, Y = /^([^:]+):\s*([\s\S]+)$/,
                                        P = {},
                                        Q = {};
                                    z = new XMLHttpRequest();
                                    L = new Date().getTime();
                                    z.open("GET", F.util.makeAbsoluteUrl(U.href, U.base), false);
                                    z.send();
                                    T = new Date().getTime();
                                    M = z.getAllResponseHeaders();
                                    S = M.split("\n");
                                    Q.headers = [];
                                    Q.url = F.util.makeAbsoluteUrl(U.href, U.base);
                                    Q.method = "GET";
                                    Q.time = "2013-05-22T20:40:33.381Z";
                                    P.bodySize = "-1";
                                    P.contentType = "";
                                    P.headers = [];
                                    P.id = "-1";
                                    P.redirectURL = null;
                                    P.stage = "end";
                                    P.status = z.status;
                                    P.time = T - L;
                                    P.url = F.util.makeAbsoluteUrl(U.href, U.base);
                                    S = M.split("\n");
                                    for (R = 0, V = S.length; R < V; R += 1) { N = Y.exec(S[R]);
                                        if (N) { P.headers.push({ name: N[1], value: N[2] }) } }
                                    X.response = P;
                                    X.request = Q } catch (O) { console.log(O) } }
                            w.addComponent(U.href, U.type, U.base || r, { obj: U.obj, request: X.request, response: X.response }) });
                        B = new q();
                        B.setPref("cdnHostnames", s.cdns);
                        J.Preference.registerNative(B);
                        w.inline = J.getInlineTags(K);
                        w.domElementsCount = J.countDOMElements(K);
                        w.cookies = w.doc_comp.cookie;
                        w.components = J.setInjected(K, w.components, w.doc_comp.body);
                        x.component_set = w;
                        F.controller.lint(K, x, s.ruleset);
                        x.result_set.url = r;
                        x.PAGE.t_done = G.loadTime;
                        x.collectStats();
                        D = J.getResults(x, s.info);
                        if (s.dict && s.format !== "plain") { D.dictionary = J.getDict(s.info, s.ruleset) }
                        A = E(D);
                        if (s.beacon) {
                            try { z = new XMLHttpRequest();
                                z.onreadystatechange = function() {
                                    if (z.readyState === 4 && s.verbose) { D.beacon = { status: z.status, headers: H(z.getAllResponseHeaders()), body: z.responseText };
                                        A = E(D) } };
                                z.open("POST", s.beacon, false);
                                z.setRequestHeader("Content-Type", A.contentType);
                                z.send(A.content) } catch (t) {
                                if (s.verbose) { D.beacon = { error: t };
                                    A = E(D) } } }
                        return A } catch (v) {
                        return v } };

                function q() { this.prefs = {} }
                q.prototype.getPref = function(s, r) {
                    return this.prefs.hasOwnProperty(s) ? this.prefs[s] : r };
                q.prototype.setPref = function(r, s) { this.prefs[r] = s };
                q.prototype.deletePref = function(r) { delete this.prefs[r] };
                q.prototype.getPrefList = function(u, r) {
                    var s = [],
                        t;
                    for (t in this.prefs) {
                        if (this.prefs.hasOwnProperty(t) && t.indexOf(u) === 0) { s.push({ name: t, value: this.prefs[t] }) } }
                    return s.length === 0 ? r : s };
                return YSLOW.phantomjs.run() };
            g = g.toString();
            g = g.slice(13, g.length - 1);
            if (g.slice(g.length - 1) !== ";") { g += ";" }
            o = o.toString();
            o = o.slice(13, o.length - 1);
            p = new Function(g + l + o);
            j = c.evaluate(p);
            f += j.failures || 0;
            console.log(j.content) }
        urlCount -= 1;
        if (urlCount === 0) { phantom.exit(f) } }) });
