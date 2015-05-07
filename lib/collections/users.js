// Users = new Mongo.Collection('users');

isValidEmail = function(val) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(val);
}

isValidPassword = function(val) {
  return val.length >= 6 ? true : false;
}

isValidPhone = function(val) {
  return val.intlTelInput("isValidNumber");
}

validateNewUser = function (user) {
  var errors = {};
  if(!user.name)
    errors.name = "Please fill in a name";

  if(!user.phone) {
    errors.phone = "Please fill in a phone";
  } else {
    if(!isValidPhone(user.phone)) {
      errors.phone = "Whoops, double check your phone";
    }
  }

  if (user.email === "") {
    errors.email = "Please fill in an email";
  } else {
    if (!isValidEmail(user.email)) {
      errors.email = "Please double check your email";
    }
  }

  if(!user.password) {
    errors.password = "Please fill in a password";
  } else {
    if(!isValidPassword(user.password)) {
      errors.password = "Try something longer. Multiple words is best."
    }
  }
  console.log(errors);
  return errors;
}

