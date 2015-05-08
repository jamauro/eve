Meteor.publish('users', function() {
  return Meteor.users.find();
});

Meteor.publish('messages', function() {
  return Messages.find();
});

Meteor.publish('userMessages', function(userId, limit) {
  return Messages.find({userId: userId}, {skip: Messages.find({userId: userId}).count() - limit});
});

Meteor.publish('userData', function(userId) {
  check(userId, String);
  if (userId) {
    return Meteor.users.find({_id: userId}, {
      fields: {
        "profile": 1,
        "emails.address[0]": 1,
        "subscription": 1,
        "role": 1
      }
    });
  } else {
    return this.ready();
  }
});

/* Meteor.publish('subscribers', function() {
  return Meteor.users.find({ "subscription.status": 'active' });
}); */