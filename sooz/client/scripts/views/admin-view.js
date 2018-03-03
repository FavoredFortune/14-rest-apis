'use strict';

var app = app || {};

(function (module) {
  const adminView = {};

  adminView.initAdminPage = function (ctx, next) {
    $('.nav-menu').slideUp(350);
    $('.admin-view').show();

    $('#admin-form').on('submit', function(event) {
      event.preventDefault();
      let token = event.target.passphrase.value;

      // COMMENT: Is the token cleared out of local storage? Do you agree or disagree with this structure?
      // RESPONSE: No, this function uses the token that is passed from the form to send to the database (model). It then updates a variable in localStorage called "token" to true from false, so the application can see if the user has a token or not in the future, but for security, the token is not actually stored in localStorage. This is a more secure way to manage token storage and correct structure.
      $.get(`${__API_URL__}/api/v1/admin`, {token})
        .then(res => {
          localStorage.token = true;
          page('/');
        })
        .catch(() => page('/'));
    });
  };

  adminView.verify = function(ctx, next) {
    if(!localStorage.token) $('.admin').addClass('admin-only');
    else $('.admin').show();
    next();
  };

  module.adminView = adminView;
})(app);