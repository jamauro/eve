Template.subscribersList.helpers({
  subscribers: function() {
    return Meteor.users.find({ "subscription.status": 'active' });
  },
  subscriberCount: function() {
   return Meteor.users.find({ "subscription.status": 'active' }).count();
  }
});

Template.subscribersList.events({
/*  "click button": function() {
    var message = {
      to: '(210) 273-6251',
      body: 'Hi!'
    }
    Meteor.call("sendSMS", message, function(err, response) {
      if (err) {
        console.log(err);
      } else {
        throwFlash.success("Message sent!");
      }
    });
  } */
});