"use strict";

function RoonApiSettings(roon, opts) {
    this._svc = roon.register_service("com.roonlabs.settings:1", {
        subscriptions: [
            {
                subscribe_name:   "subscribe_settings",
                unsubscribe_name: "unsubscribe_settings",
                start: (req) => {
		    opts.get_settings((s,l) => {
			req.send_continue("Subscribed", { settings: s, layout: l })
		    });
                }
            },
        ],
        methods: {
            get_settings: function(req) {
		opts.get_settings((s,l) => {
		    req.send_complete("Success", { settings: s, layout: l });
		});
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
};


RoonApiSettings.prototype.update_settings = function (settings, layout) {
    this._svc.send_continue_all('subscribe_settings', "Changed", { settings: settings, layout: layout });
};

exports = module.exports = RoonApiSettings;
