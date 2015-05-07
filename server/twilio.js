/* Meteor.methods({
  sendSMS: function(message) {
    twilio = Twilio(Meteor.settings.public.twilio.accountSID, Meteor.settings.public.twilio.authToken);
    twilio.sendSms({
      to: message.to, // Any number Twilio can deliver to
      from: '+15128656383', // A number you bought from Twilio and can use for outbound communication
      body: message.body // body of the SMS message
    }, function(err, response) { //this function is executed when a response is received from Twilio
      if (!err) { // "err" is an error received during the request, if any
        // "responseData" is a JavaScript object containing data received from Twilio.
        // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
        // http://www.twilio.com/docs/api/rest/sending-sms#example-1
        console.log(response.to); // outputs "+14506667788"
        console.log(response.body); // outputs "word to your mother."
      } else {
        console.log(err);
      }
    });
  }
}); */

SyncedCron.config({
  utc: true
});

FutureTasks = new Meteor.Collection('future_tasks');

// array of subscribers
// this should be reactive, right?
var subscribers = Meteor.users.find({'subscription.status': 'active'}).fetch();
// var subscribersProfiles = _.pluck(subscribers, 'profile');
// array of subscribers' phone numbers
// var subscribersPhoneNumbers = _.pluck(subscribersProfiles, 'phone');

var testList = [
  {
    _id: '123',
    profile: {
      name: "Leeah Kohley",
      phone: '(231) 215-7062'
    }
  },
  {
    _id: '456',
    profile: {
      name: "John Mauro",
      phone: '(210) 273-6251'
    }
  }
];

Meteor.methods({
  sendMessage: function(details) {
    twilio = Twilio(Meteor.settings.public.twilio.accountSID, Meteor.settings.public.twilio.authToken);
    _.each(details.to, function(subscriber) {
        // for mass messages
        if (details.name) {
          var messageName = details.name;
          var name = subscriber.profile.name;
          var firstName = name.substr(0,name.indexOf(' '));
          var body = createBody(messageName, firstName);
        } else {
          // message to single person
          var body = details.body;
        }
        var message = {
          to: subscriber.profile.phone,
          from: '+15128656383',
          body: body
        };
        var sendSmsSync = Meteor.wrapAsync(twilio.sms.messages.post, twilio.messages);
        try {
          var result = sendSmsSync({
            to: message.to,
            from: message.from,
            body: message.body
          });
          console.log(result);
          Meteor.call('messageInsert', message, function(err, res) {
            if (err) {
              console.log(err);
            }
          });
        }
        catch (err) {
          console.log(err);
        }
    });
  }
});



function createBody(messageName, personName) {
  console.log(messageName, personName);
  switch (messageName) {
    case 'Morning Message':
      return "Mornin' " + personName +"! Remember that you're awesome";
    case 'Afternoon Message':
      return "Howdy " + personName +"! How are things coming along?";
    case 'Evening Message':
      return "Good evening " + personName +"! How'd it go today and what's in store for tomorrow?";
  }
}

var morningMessage = {
  name: 'Morning Message',
  to: subscribers,
  when: 'at 2:00pm'
}

var afternoonMessage = {
  name: 'Afternoon Message',
  to: subscribers,
  when: 'at 7:00pm'
}

var eveningMessage = {
  name: 'Evening Message',
  to: subscribers,
  when: 'at 2:00am' //except on Saturday'
}

function scheduleMessage(details) {
  if (details.when < new Date()) {
    sendMessage(details);
  } else {
    var thisId = FutureTasks.insert(details);
    addTask(thisId, details);
  }
  return true;
}

addTask = function (id, details) {
  SyncedCron.add({
    name: details.name,
    schedule: function(parser) {
      return parser.text(details.when);
    },
    job: function(intendedAt) {
      details.intendedAt = intendedAt;
      sendMessage(details);
      FutureTasks.remove(id);
      // SyncedCron.remove(id);
      console.log('job should be running at:');
      console.log(intendedAt);
      return id;
    }
  });
}


scheduleMessage(morningMessage);
scheduleMessage(afternoonMessage);
scheduleMessage(eveningMessage);