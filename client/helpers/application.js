// trim helper
trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

Template.registerHelper({
  name: function() {
    return Meteor.user().profile.name;
  },
  phone: function() {
    return Meteor.user().profile.phone;
  }
});
