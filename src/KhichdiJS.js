/*
 * KhichdiJS By Vivek Muthal
 * Dependencies JQuery, Underscore
 * Version : 1.0 Beta
 * Email : vmuthal.18@gmail.com
 * */

var KhichdiJS = function() {
    var khichdiJS = this;

    /* Initialize the Routers and bind the events */
    khichdiJS.start = function() {
        /* Call Router as required */
        $(window).on('hashchange', function() {
            khichdiJS.abortAll();
            khichdiJS.HandleRouteHash(window.location.hash.substr(1));
        });
        $(window).on('load', function() {
            khichdiJS.HandleRouteHash(window.location.hash.substr(1));
        });
        //khichdiJS.HandleRouteHash(window.location.hash.substr(1));
    };
    /* Handle Route according to hash */
    khichdiJS.HandleRouteHash = function(hash) {
        if (hash !== "")
            khichdiJS.Router(hash);
        else
            khichdiJS.DefaultRouter(khichdiJS.DefaultRoute);
    };
    /* Default Router */
    khichdiJS.DefaultRouter = function(defaultRoute) {
        if (typeof defaultRoute !== 'undefined')
            window.location.hash = defaultRoute[0];
        else
            console.log("Default Route not configured.");
    };
    /* NotFound Router */
    khichdiJS.NotFoundRouter = function(notFoundRoute) {
        if (typeof notFoundRoute !== 'undefined')
            window.location.hash = notFoundRoute[0];
        else
            console.log("Route Not Found.");
    };
    /* Route Handler */
    khichdiJS.Router = function(hash) {
        var routeFound = false;
        for (var i = 0; i < khichdiJS.Routes.length; i++) {
            var route = khichdiJS.Routes[i];
            if (route[0] === hash) {
                routeFound = true;
                khichdiJS.Controller(route[1], null);
                break;
            }
        }
        if (!routeFound)
        {
            /* Check if hash has "/" split it then match the paths*/
            var hashParts = hash.split("/");
            hashParts.shift();
            if (hashParts.length > 1) {
                for (var i = 0; i < khichdiJS.Routes.length; i++) {
                    var route = khichdiJS.Routes[i];
                    var routeParts = route[0].split("/");
                    routeParts.shift();
                    //console.log(routeParts);
                    if (routeParts.length === hashParts.length)
                    {
                        var routeVariables = [];
                        var routePartsMatched = false;
                        for (var j = 0; j < routeParts.length; j++) {

                            if (!routeParts[j].startsWith(":")) {
                                if (routeParts[j] === hashParts[j]) {
                                    routePartsMatched = true;
                                    // console.log("Part Matched");
                                }
                                else {
                                    routePartsMatched = false;
                                }
                            }
                            else {
                                routeVariables.push(hashParts[j]);
                            }
                            if (routePartsMatched === false) {
                                break;
                            }
                        }
                        if (routePartsMatched === true) {
                            routeFound = true;
                            khichdiJS.Controller(route[1], routeVariables);
                            //  console.log("Pattern matched");
                        }
                        // console.log("Pattern length match");
                    }
                }
            }
            if (!routeFound)
                khichdiJS.NotFoundRouter(khichdiJS.NotFoundRoute);
        }
    };
    /* Controller */
    khichdiJS.Controller = function(controller, routeVariables) {
        if (khichdiJS.Controllers[controller] !== undefined)
            khichdiJS.Controllers[controller](routeVariables);
        else
            console.log("Controller : " + controller + " is not defined");

        // khichdiJS.Views.layout(controller);
        // khichdiJS.Actions[controller]();
    };

    /* Setting blank objects */
    khichdiJS.Controllers = {};
    khichdiJS.Views = {};
    khichdiJS.Models = {};

    /* View */
    khichdiJS.View = function(view, data, eventData, modelUrlData) {
        if (khichdiJS.Views[view] !== undefined) {
            var selectedView = khichdiJS.Views[view];
            khichdiJS.templateCache.get(selectedView.template, function(template) {
                var target = "#" + selectedView.target;
                if (selectedView.model !== undefined) {
                    khichdiJS.Model.getData(selectedView.model, modelUrlData, function(data) {
                        $(target).html(_.template(template, data));
                        if (khichdiJS.Views[view].events !== undefined) {
                            khichdiJS.Views[view].events(eventData);
                        }
                    });
                } else if (data !== null) {
                    $(target).html(_.template(template, data));
                    if (khichdiJS.Views[view].events !== undefined) {
                        khichdiJS.Views[view].events(eventData);
                    }
                }
                else {
                    $(target).html(template);
                    if (khichdiJS.Views[view].events !== undefined) {
                        khichdiJS.Views[view].events(eventData);
                    }
                }
            });
            if (selectedView.otherViews !== undefined) {
                selectedView.otherViews.forEach(function(v) {
                    khichdiJS.View(v.view, v.data, v.eventData);
                });
            }
        }
        else {
            console.log("View :" + view + " is not defined.");
        }
    };

    /* Model */
    khichdiJS.Model = {
        getData: function(modelName, modelUrlData, callback) {
            var model = khichdiJS.Models[modelName];
            var url = model.url;
            if (modelUrlData !== null) {
                for (var part in modelUrlData) {
                    url = url.replace("{" + part + "}", modelUrlData[part]);
                }
            }
            $.ajax({
                url: url,
                type: "GET",
                success: function(response) {
                    var model = {model: response};
                    callback(model);
                }
            });
        }
    };
    /* For canceling all pending request on tab change */
    khichdiJS.xhrPool = [];
    $(document).ajaxSend(function(e, jqXHR, options) {
        khichdiJS.xhrPool.push(jqXHR);
    });
    $(document).ajaxComplete(function(e, jqXHR, options) {
        khichdiJS.xhrPool = $.grep(khichdiJS.xhrPool, function(x) {
            return x !== jqXHR;
        });
    });
    khichdiJS.abortAll = function() {
        $.each(khichdiJS.xhrPool, function(idx, jqXHR) {
            jqXHR.abort();
        });
    };
    /* Cache the template*/
    khichdiJS.templateCache = {
        get: function(selector, callback) {
            selector = '#' + selector;
            if (!this.cachedTemplates) {
                this.cachedTemplates = {};
            }
            var template = this.cachedTemplates[selector];
            var cache = this;
            if (!template) {
                $.ajax({
                    async: true,
                    type: 'GET',
                    url: khichdiJS.configuration.templatePath + selector.substring(1) + khichdiJS.configuration.templateExtension,
                    success: function(template) {
                        cache.cachedTemplates[selector] = template;
                        callback(template);
                    }
                });
            }
            else {
                callback(template);
            }
        }
    };
    khichdiJS.configuration = {
        templatePath: "js/templates/",
        templateExtension: ".tmpl",
        modulePath: "js/modules/"
    };
    /* String function to check string starts with
     * Very important dont remove added to compare routes */
    if (typeof String.prototype.startsWith !== 'function') {
        /* see below for better implementation! */
        String.prototype.startsWith = function(str) {
            return this.indexOf(str) === 0;
        };
    }

};