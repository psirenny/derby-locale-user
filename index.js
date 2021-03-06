'use strict';

module.exports = function (options) {
  if (!options) options = {};
  if (!options.key) options.key = 'local.locales';
  if (!options.path) options.path = '$locale';
  if (!options.name) options.name = 'user';

  return function (req, res, next) {
    var model = req.getModel();
    if (!model) return next();
    if (!req.isAuthenticated()) return next();
    var $user = model.at('users.' + req.user.id);

    $user.fetch(function (err) {
      if (err) return next(err);
      if (!$user.get()) return next();
      var path = options.path + '.strategies.' + options.name;
      var strategy = {};

      strategy.locales = $user.setNull(options.key, []);
      strategy.order = options.order;
      model.set(path, strategy);
      next();
    });
  };
};
