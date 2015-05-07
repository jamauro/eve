Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound' /*,
  waitOn: function() {
    return Meteor.subscribe('users');
  } */
});

Router.route('/', {name: 'home'});
Router.route('/dashboard', {
  name: 'dashboard',
  waitOn: function() {
    return Meteor.subscribe('userData');
  }
});
Router.route('/settings', {
  name: 'settings',
  waitOn: function() {
    return Meteor.subscribe('userData');
  }
});
Router.route('/subscribers', {
  name: 'subscribersList',
  waitOn: function() {
    return [Meteor.subscribe('users'), Meteor.subscribe('messages')];
  },
  onBeforeAction: function() {
    if (Meteor.user()) {
      if (Meteor.user().role == 'admin') {
        this.next();
      } else {
        Router.go('userPage');
      }
    } else {
      this.render('accessDenied');
    }
  }
});

UserPageController = RouteController.extend({
  template: 'userPage',
  increment: 5,
  messagesLimit: function() {
    return parseInt(this.params.messagesLimit) || this.increment;
  },
  findOptions: function() {
    var totalUserMessages = Messages.find({userId: this.params._id}).count();
    if (this.messagesLimit() < totalUserMessages) {
      return {skip: Messages.find({userId: this.params._id}).count() - this.messagesLimit()};
    }
  },
  waitOn: function() {
    return [
      Meteor.subscribe('userData', this.params._id),
      Meteor.subscribe('userData', Meteor.userId()),
      Meteor.subscribe('userMessages', this.params._id, {limit: this.messagesLimit})
    ];
  },
  messages: function() {
    return Messages.find({userId: this.params._id}, this.findOptions());
  },
  data: function() {
    var hasMore = this.messages().count() === this.messagesLimit();
    var nextPath = '/users/' + this.params._id + '/' + (this.messagesLimit() + this.increment);
    return {
      messages: this.messages(),
      user: Meteor.users.findOne(this.params._id),
      nextPath: hasMore ? nextPath : null
    };
  },
  onBeforeAction: function() {
    if (Meteor.userId() == this.params._id || Meteor.user().role == 'admin') {
      this.next();
    } else {
      this.render('accessDenied');
    }
  }
});

Router.route('/users/:_id/:messagesLimit?', {
  name: 'userPage'
  /* waitOn: function() {
    var limit = parseInt(this.params.messagesLimit) || 5;
    return [Meteor.subscribe('userData', this.params._id), Meteor.subscribe('userData', Meteor.userId()), Meteor.subscribe('userMessages', this.params._id, {limit: limit})];
  },
  data: function() {
    // this refers to route
    var limit = parseInt(this.params.messagesLimit) || 5;
    return {
      messages: Messages.find({userId: this.params._id}, {skip: Messages.find({userId: this.params._id}).count() - limit}),
      user: Meteor.users.findOne(this.params._id)
    };
  },
  onBeforeAction: function() {
    if (Meteor.userId() == this.params._id || Meteor.user().role == 'admin') {
      this.next();
    } else {
      this.render('accessDenied');
    }
  } */
});

Router.route('/reset-password/:resetToken', {
  name: 'resetPassword',
  onBeforeAction: function() {
    Session.set('resetToken', this.params.resetToken);
    console.log(this.params.resetToken);
    this.next();
  }
});

Router.route('/webhooks/stripe', function() {
  var request = this.request.body;

  switch(request.type) {
    case "customer.subscription.updated":
      stripeUpdateSubscription(request.data.object);
      break;
    case "invoice.payment_succeeded":
      stripeCreateInvoice(request.data.object);
      break;
  }

  this.reponse.statusCode = 200;
  //setting where server gives this route full access to NodeJS request and response objects
}, {where: 'server'});

Router.route('incoming', {
  path: '/api/twiml/sms',
  where: 'server',
  action: function() {
    var request = this.request.body;
    console.log(request);
    // test an automated response
    // this.response.writeHead(200, {'Content-Type': 'text/xml'});
    // this.response.end('<Response><Sms>Indeed!</Sms></Response>');
    var message = {
      to: request.To,
      from: request.From,
      body: request.Body,
      status: request.SmsStatus
    };
    Meteor.call('messageInsert', message, function(err, res) {
      if (err) {
        console.log(err);
      }
    });
  }
});


  /* '/api/twiml/sms', 'POST', function() {
  var rawIn = this.request.body;
  console.log(rawIn);
  if (Object.prototype.toString.call(rawIn) == "[object Object]") {
    twilioRawIn.insert(rawIn);
  }
  var to = rawIn.To;
  console.log(to);

  var xml = '<Response><Sms>Indeed!</Sms></Response>';
  return [200, {"Content-Type": "text/xml"}, xml];
}, {where: 'server'}); */

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    // what does this line do?
    this.next();
  }
}

// show the not found template if data for userPage returns a "falsy"
Router.onBeforeAction('dataNotFound', {only: 'userPage'});

// require login
Router.onBeforeAction(requireLogin, {only: 'dashboard'});




