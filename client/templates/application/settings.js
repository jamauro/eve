Template.settings.helpers({
  paymentDue: function() {
    return Meteor.user().subscription.ends;
  },
  hasCanceled: function() {
    return Meteor.user().subscription.cancel_at_period_end === true;
  }
});

Template.settings.events({
  'click .cancel-subscription': function(e) {
    var confirmCancel = confirm("Are you sure you want to cancel your subscription? This means your subscription will no longer be active and your account will be disabled on the cancellation date. If you'd like, you can resubscribe later.")
    if (confirmCancel) {
      var user = Meteor.user();
      Meteor.call('cancelUserSubscription', user, function(err, response) {
        if (err) {
          throwFlash.error(err.message);
        }
      });
    }
  }
});