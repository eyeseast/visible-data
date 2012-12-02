// Views

/***
A basic view for handling changes to a transcript.
By default, the model's `change:body` event will
fire `TranscriptView#updateText`, which sets the value of
a textarea under `#transcript`. 

If `options.model` is left undefined, this view will automatically
create a Transcript instance with default options.

Extend this view and replace the `updateText` method to add new functionality.
***/
var TranscriptView = Backbone.View.extend({

    initialize: function(options) {
        _.bindAll(this);
        options = options || {};
        if (!options.element) {
            this.setElement('#transcript');
        }
        this.textarea = this.$('textarea');
        if (_.isUndefined(this.model)) {
            this.model = new Transcript();
        }
        this.model.on('change:body', this.updateText, this);
    },

    formatText: function(text) {
        return text.replace(/\n/g, '')
            .replace(/>>/g, '\n\n>>');
    },

    scroll: function() {
        if (this.textarea[0] && this.scrollEnabled) {
            this.textarea[0].scrollTop = this.textarea[0].scrollHeight;
        }
    },

    scrollEnabled: false,

    updateText: function(model, body, e) {
        var body = this.model.get('body');
        this.textarea.val(this.formatText(body));
        this.scroll();
    }

});
