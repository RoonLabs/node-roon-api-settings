"use strict";

function RoonApiSettings(roon, opts) {
    this._svc = roon.register_service("com.roonlabs.settings:1", {
        subscriptions: [
            {
                subscribe_name:   "subscribe_settings",
                unsubscribe_name: "unsubscribe_settings",
                start: (req) => {
		    opts.get_settings(s => {
			req.send_continue("Subscribed", { settings: s })
		    });
                }
            },
        ],
        methods: {
            get_settings: function(req) {
		opts.get_settings(s => {
		    req.send_complete("Success", { settings: s });
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


RoonApiSettings.prototype.update_settings = function (settings) {
    this._svc.send_continue_all('subscribe_settings', "Changed", { settings: settings });
};

exports = module.exports = RoonApiSettings;
