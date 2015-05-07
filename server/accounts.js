Meteor.startup(function () {
  if ( Meteor.users.find().count() === 0 ) {
    var admin = Accounts.createUser({
      email: 'achievewitheve@gmail.com',
      password: 'letsmakemoney14',
      profile: {
        name: 'Admin Eve',
        phone: '(512) 710-8383',
      },
    });
    Meteor.users.update({_id: admin}, { $set: {role: 'admin'} });
  }
  FutureTasks.find().forEach(function(message) {
    //     console.log(later.parse.text(message.when));
    if (later.parse.text(message.when) < new Date()) {
      sendMessage(message);
    } else {
      addTask(message._id, message);
    }
  });
  SyncedCron.start(); // starts the cron jobs
});

Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.validateNewUser(function (user) {
  var errors = {};
  if(!user.profile.name)
    errors.name = "Please fill in a name";

  if(!user.profile.phone)
    errors.phone = "Please fill in a phone";

  if (user.emails[0].address === "") {
    errors.email = "Please fill in an email";
  } else {
    if (!isValidEmail(user.emails[0].address)) {
      errors.email = "Please double check your email";
    }
  }
  console.log(errors);
  return errors;
});
