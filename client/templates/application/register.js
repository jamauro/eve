Template.register.created = function() {
  Session.set('registerErrors', {});
}

Template.register.rendered = function() {
  $("#account-phone").intlTelInput({
    //allowExtensions: true,
    //autoFormat: false,
    //autoHideDialCode: false,
    //autoPlaceholder: false,
    //defaultCountry: "auto",
    //ipinfoToken: "yolo",
    //nationalMode: false,
    //numberType: "MOBILE",
    //onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
    //preferredCountries: ['cn', 'jp'],
    utilsScript: "libphonenumber/utils.js"
  });
}

Template.register.helpers({
  errorMessage: function(field) {
    return Session.get('registerErrors')[field];
  },
  errorClass: function(field) {
    // !! converts to boolean and ensures boolean type
    return !!Session.get('registerErrors')[field] ? 'has-error' : '';
  }
});

Template.register.events({
  // e = event, t = template
  'blur #account-email': function(e, t) {
    var email = t.find('#account-email').value;
    var isValid = isValidEmail(email);
    if(!isValid) {
      var errors = {
        email: "Whoops, double check your email"
      };
      return Session.set('registerErrors', errors);
    } else {
      if (!!Session.get('registerErrors')['email']) {
        return Session.set('registerErrors')['email'] = '';
      }
    }
  },
  'blur #account-phone': function(e, t) {
    var phone = t.find('#account-phone').value;
    var isValid = t.$("#account-phone").intlTelInput("isValidNumber");
    if(!isValid) {
      var errors = {
        phone: "Whoops, double check your phone"
      };
      return Session.set('registerErrors', errors);
    } else {
      if (!!Session.get('registerErrors')['phone']) {
        return Session.set('registerErrors')['phone'] = '';
      }
    }
  },
  'blur #account-password': function(e, t) {
    var password = t.find('#account-password').value;
    var isValid = isValidPassword(password);
    if(!isValid) {
      var errors = {
        password: "Try something longer. Multiple words is best."
      };
      return Session.set('registerErrors', errors);
    } else {
      if (!!Session.get('registerErrors')['password']) {
        return Session.set('registerErrors')['password'] = '';
      }
    }
  },
  'submit #register-form': function(e, t) {
    e.preventDefault();
    var intlPhone = t.$("#account-phone").intlTelInput("getNumber");
    var user = {
      name: t.find('#account-name').value,
      phone: intlPhone,
      email: t.find('#account-email').value,
      password: t.find('#account-password').value
    };

    var email = trimInput(user.email);

    var errors = validateNewUser(user);
    // if errors is not empty, show the errors
    if (!_.isEmpty(errors)) {
      return Session.set('registerErrors', errors);
    }

    // if (errors.name || errors.phone || errors.email || errors.password)
    console.log(user);
    Accounts.createUser({
      email: email,
      password: user.password,
      profile: {
        name: user.name,
        phone: user.phone
      },
    }, function(err){
      if (err) {
        // Inform the user that account creation failed
        console.log(err);
        return throwFlash.error(err.reason);
      } else {
        // Success. Account has been created and the user
        // has logged in successfully.
        /* analytics.ready(function(){
          var anonId = mixpanel.get_distinct_id();
        }); */
        var userId = Meteor.userId();
        analytics.alias(userId);
        analytics.identify(userId, {
          name: user.name,
          phone: user.phone
        });
        analytics.track('Signed Up');
        Router.go('dashboard');
        // Send user email to complete enrollment with link to password
        // Accounts.sendEnrollmentEmail(userId);
      }
    });


    return false;
  }
});