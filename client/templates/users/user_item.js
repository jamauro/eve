Template.userItem.helpers({
  unreadCount: function() {
    console.log(this);
    return Messages.find({userId: this._id, read: false}).count();
  }
});

Template.userItem.events({
  'click a': function () {
    // clear the unread count
    var unreadMessages = Messages.find({userId: this._id, read: false}).fetch();
    _.each(unreadMessages, function (message){
      Messages.update({_id: message._id}, {$set: {read: true}});
    });
  }
});