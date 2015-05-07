Meteor.startup(function() {
  Stripe.setPublishableKey('pk_test_BfBZFC5MwEgzwr6xo40rr6xo');
});

Template.userPage.helpers({
  /* messages: function() {
    return Messages.find({userId: this._id});
  }, */
  isAllowedUser: function() {
    return (Meteor.user().role == 'admin' || Meteor.user().subscription.status === 'active');
  }
});

Template.userPage.events({
  'click #subscribe': function(e){
    var handler = StripeCheckout.configure({
      key: 'pk_test_BfBZFC5MwEgzwr6xo40rr6xo',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
        Meteor.call('subscribe', token, function(err, result) {
          if (err) {
            console.log(err.reason);
          } else {
            analytics.track('Subscribed');
            Router.go('userPage');
          }
        });
      },
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      name: "Eve",
      description: "Subscription ($6.99 per month)",
      panelLabel: "Pay $6.99",
      allowRememberMe: false
    });
    handler.open({
      email: Meteor.user().emails[0].address
    });
    analytics.track('Clicked Subscribe');
    e.preventDefault();
  }
});

