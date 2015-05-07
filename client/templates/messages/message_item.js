Template.messageItem.helpers({
  from: function() {
    return this.status == "received" ? "you" : "me";
  },
  submittedText: function() {
    // sort needs to be flipped so it grabs the last message rather than the very first message
    var previousMessage = Messages.findOne({ $and: [ { submitted: { $lt: this.submitted } }, { userId: this.userId } ] }, {sort: {submitted: -1}});
    if (typeof previousMessage !== 'undefined') {
      // only show timestamp is time diff between messages is more than 12 hours
      if ((this.submitted - previousMessage.submitted)/(1000*60*60) > 12) {
        return '<li class="date text-center">' + moment(this.submitted).calendar() + '</li>';
      }
    }
  }
});

