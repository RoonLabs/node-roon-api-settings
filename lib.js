"use strict";

function RoonApiSettings(roon, opts) {
    this._svc = roon.register_service("com.roonlabs.settings:1", {
        subscriptions: [
            {
                subscribe_name:   "subscribe_settings",
                unsubscribe_name: "unsubscribe_settings",
                start: (req) => {
                    req.send_continue("Subscribed", { settings: this._settings, layout: this._layout });
                }
            },
        ],
        methods: {
            get_settings: function(req) {
                req.send_complete("Success", { settings: this._settings, layout: this._layout });
            },
            save_settings: function(req) {
                opts.save_settings(req, req.body.is_dry_run, req.body.settings);
            },
            button_pressed: function(req) {
                opts.button_pressed(req, req.body.buttonid, req.body.settings);
            },
        }
    });

    this.services  = [ this._svc ];
    this._settings = {};
    this._layout   = [];
};


RoonApiSettings.prototype.set_settings = function (settings, layout) {
    this._settings = settings;
    this._layout   = layout;
    this._svc.send_continue_all('subscribe_settings', "Changed", { settings: this._settings, layout: this._layout });
};

exports = module.exports = RoonApiSettings;
