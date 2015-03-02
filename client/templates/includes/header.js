Template.header.events({
  "click .logout": function(e, t) {
    e.preventDefault();
    Meteor.logout(function(err) {
      if (err) {
        // Display the logout error to the user however you want
        throwFlash.error(err.reason);
      }
      else {
        Router.go('home');
      }
    });
  }
});