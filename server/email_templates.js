Accounts.emailTemplates.siteName = "eve";
Accounts.emailTemplates.from = "eve <achievewitheve@gmail.com>";

Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Hi " + user.profile.name + ",\n\nTo reset your password, simply click the link below:\n\n"
     + url
     + "\n\nIf you did not request to reset your password, you can just ignore this email."
     + "\n\nYou're the best, \neve";
};