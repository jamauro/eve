UI.registerHelper('formatTime', function(date) {
  if (typeof(date) == 'number') {
    // take an epoch and make it human readable
    return moment.unix(date).format("dddd, MMMM Do YYYY");
  } else {
    return moment(date).format("MMMM YYYY");
  }
});

UI.registerHelper('formatPhone', function(phone) {
  console.log(phone);
  return intlTelInputUtils.formatNumber(phone);
});

Template.registerHelper('name', function() {
  return Meteor.user().profile.name;
});

Template.registerHelper('phone', function() {
  return Meteor.user().profile.phone;
});

Template.registerHelper('firstName', function() {
  var name = Meteor.user().profile.name;
  return name.substr(0,name.indexOf(' '));
});

Template.registerHelper('isSubscribed', function() {
  return Meteor.user().subscription.status === 'active';
});

Template.registerHelper('isAdmin', function() {
  return Meteor.user().role == 'admin';
});
