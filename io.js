//- JavaScript source code

//- io.js ~~
//  This defines basic wrappers that enable JavaScript to utilize CouchDB as a
//  web filesystem. There is zero dependency on rewrite rules, because I will
//  be making this portable to different frameworks in the future. 
//                                                          ~~ SRW, 11 Nov 2010

if (this.io === undefined) {
    var io = {};
}

(function () {

//- "Private" definitions -- these are scoped to the anonymous closure.

    var jax = {                         //- synchronous XMLHttpRequest wrapper
            get: function (url) {
                var req = new XMLHttpRequest();
                req.open('GET', url, false);
                req.send(null);
                return req.responseText;
            },
            put: function (url, data) {
                data = data || "";
                var req = new XMLHttpRequest();
                req.open('PUT', url, false);
                req.setRequestHeader("Content-type", "application/json");
                req.send(data);
                return req.responseText;
            }
        },

        environment = (function () {
            if (typeof window === 'object') {
                if (typeof window.console === 'object') {
                    return "has-console";
                } else {
                    return "has-window";
                }
            } else {
                if (typeof importScripts === 'function') {
                    return "web-worker";
                } else {
                    return "unknown";
                }
            }
        })(),

        root = location.href.replace(location.pathname, '/'),
        subs = location.pathname.match(/([^\/]+)\//g),
        db = root + subs[0],
        app = db + subs[1] + subs[2],

        stdout = [],
        stderr = [];

//- "Public" definitions -- these will persist outside the anonymous closure.
//  These functions DO currently depend on CouchDB, but I am not going to worry
//  about portability to other platforms until I have this working perfectly.

    io.print = (function () {
        switch (environment) {
        case "has-console":
            return function () {
                var args = Array.prototype.slice.call(arguments);
                console.log.apply(console, args);
            };
        case "has-window":
            return function () {
                var args = Array.prototype.slice.call(arguments),
                    sink = document.body,
                    tag = "<div class=stdout>";
                sink.innerHTML += (tag + args.join("</div>" + tag) + "</div>");
            };
        case "is-worker":
            return function () {
                var args = Array.prototype.slice.call(arguments);
                stdout = stdout.concat(args);
                return stdout;
            };
        default:
            return function () {};
        }
    })();

    io.error = (function () {
        switch (environment) {
        case "has-console":
            return function () {
                var args = Array.prototype.slice.call(arguments);
                console.error.apply(console, args);
            };
        case "has-window":
            return function () {
                var args = Array.prototype.slice.call(arguments),
                    sink = document.body,
                    tag = "<div class=stderr>";
                sink.innerHTML += (tag + args.join("</div>" + tag) + "</div>");
            };
        case "is-worker":
            return function () {
                var args = Array.prototype.slice.call(arguments);
                stderr = stderr.concat(args);
                return stderr;
            };
        default:
            return function () {};
        }
    })();

    io.read = function (x) {
        switch (x.constructor) {
        case String:                    //  treat x as a URL
            return jax.get(x);
        case Object:                    //- treat x as a CouchDB document
            return jax.get(db + x._id);
        default:
            throw "'io.read' does not support this type.";
        }
    };

    io.load = function (x) {
        eval(io.read(x));
    };

    io.write = function (obj, url) {
        var response;
        if (obj._id === undefined) {
            response = JSON.parse(jax.get(root + "_uuids"));
            obj._id = response.uuids[0];
        }
        url = url || db + obj._id;
        response = JSON.parse(jax.put(url, JSON.stringify(obj)));
        if (response.ok === true) {
            obj._rev = response.rev;
        }
        return obj;
    };

})();

//- vim:set syntax=javascript:
