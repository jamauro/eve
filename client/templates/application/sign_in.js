Template.signIn.created = function() {
  Session.set('forgotVisible', false);
}

Template.signIn.helpers({
  userForgot: function() {
    return Session.get('forgotVisible');
  }
});


Template.signIn.events({
  "click #signIn": function(e, t) {
    e.preventDefault();
    Meteor.loginWithPassword(
      t.find("#login-email").value,
      t.find("#login-password").value,
      function(error) {
        if (error) {
          // Display the login error to the user however you want
          return throwFlash.error(error.reason);
        }
        else {
          var id = Meteor.userId();
          if (Meteor.user().role == 'admin') {
            Router.go('subscribersList');
          } else {
            Router.go('userPage', {_id: id});
          }
        }
      }
    );
  },
  "click #resetPassword": function(e, t) {
    e.preventDefault();
    console.log('send reset was clicked');
    var email = trimInput(t.find('#login-email').value)

    if (email) {
      Session.set('loading', true);
      Accounts.forgotPassword({email: email}, function(err){
        if (err)
          throwFlash.error(err.reason);
        else {
          throwFlash.success('Email sent!');
          Session.set('forgotVisible', false);
          //Session.set('displayMessage', 'Email Sent. Please check your email.')
        }
        Session.set('loading', false);
      });
    }
    return false;
  },
  "click .forgot": function(e, t) {
    e.preventDefault();
    console.log('forgot was clicked');

    Session.set('forgotVisible', true);
  },
  "click .nevermind": function(e, t) {
    e.preventDefault();
    console.log('nevermind was clicked');

    Session.set('forgotVisible', false);
  }
});