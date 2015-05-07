Messages = new Mongo.Collection('messages');

Meteor.methods({
  messageInsert: function(messageAttributes) {
    if (messageAttributes.status == 'received') {
      console.log(messageAttributes.from);
      var user = Meteor.users.findOne({'profile.phone': messageAttributes.from})
      console.log(user);
      var isRead = false;
    } else {
      var user = Meteor.users.findOne({'profile.phone': messageAttributes.to});
      var isRead = true;
    }

    var message = _.extend(messageAttributes, {
      userId: user._id,
      //from: messageAttributes.from,
      submitted: new Date(),
      read: isRead
    });
    console.log(message);

    return Messages.insert(message);
  }
})