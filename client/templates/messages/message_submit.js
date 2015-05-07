Template.messageSubmit.created = function() {
  Session.set('messageSubmitErrors', {});
}

Template.messageSubmit.rendered = function() {
  var compose = $("#compose");
    compose.on("scroll", function(e) {
      if (this.scrollTop > 0) {
      compose.addClass("stick-message");
    } else {
      compose.removeClass("stick-message");
    }
  });
}

Template.messageSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('messageSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('messageSubmitErrors')[field] ? 'has-error': '';
  }
});

Template.messageSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    // look up user that it's being sent to
    var $body = $(e.target).find('[name=body]');
    var message = {
      // wrap 'to' in an array so can use same sendMessage method as for mass messages
      to: [this.user],
      from: '+15128656383',
      body: $body.val()
    };

    var errors = {};
    if (!message.body) {
      errors.body = "Please write a message";
      return Session.set('messageSubmitErrors', errors);
    }

    Meteor.call('sendMessage', message, function(err, res) {
      if(!err) {
        $body.val('');
        throwFlash.success('Message sent');
      }
    });
  }
});