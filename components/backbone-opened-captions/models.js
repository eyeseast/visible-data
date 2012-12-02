
// Models

/***
A transcript stores text we pull in from OpenedCaptions.

**Defaults**
Each of these options can be overridden in `options`.

 - socket: a `socket.io` connection using autodiscovery
***/

var OPENED_CAPTIONS_URL = "http://openedcaptions.com:3000";

var Transcript = Backbone.Model.extend({

    defaults: {
        body: "",
        start: new Date()
    },

    initialize: function(attributes, options) {
        _.bindAll(this);
        attributes = attributes || {};
        options = options || {};
        
        this.socket = options.socket || io.connect(OPENED_CAPTIONS_URL);
        this.socket.on('message', this.handleMessage);
    },

    handleMessage: function(message) {
        if (message.target === "transcript") {
            var body = message.payload.data.body;
            switch (message.payload.type) {
                case "content":
                    this.handleContent(body);
                    break;

                case "line":
                    this.handleLine(body);
                    break;

                case "word":
                    this.handleWord(body);
                    break;

                case "error":
                    this.handleError(body);
                    break;
            }
        }
    },

    handleContent: function(content) {
        var body = this.get('body');
        body += content;
        this.set({body: body});
    },

    handleWord: function(word) {},

    handleLine: function(line) {},

    handleError: function(error) {}
});