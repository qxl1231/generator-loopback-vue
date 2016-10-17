var path = require('path');
var app = require(path.resolve(__dirname, '../server'));

app.models.User.validations.email =
    [
      { validation: 'format',
      allowNull: true,
      allowBlank: true,
      message: 'Must provide a valid email',
      with: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      options: {} },
      { validation: 'uniqueness',
      message: 'Email already exists',
      options: {async: true}}
    ];

app.models.User.create([{
  username: 'username',
  password: 'password'
}], function(err, users) {
  if (err) throw err;
  console.log('Admin account created.');

  app.models.User.generateVerificationToken(users[0].id, function(err, token){
    app.models.User.confirm(users[0].id, token.id, null, function(err, result) {
      if (err) throw err;
      console.log('Automatic verified; Ok to login');
    });
  });

  //create the admin role
  app.models.Role.create({
    name: 'admin'
  }, function(err, role) {
    if (err) throw err;

    console.log('Created role:', role);

    //assign an admin
    role.principals.create({
      principalType: app.models.RoleMapping.USER,
      principalId: users[0].id
    }, function(err, principal) {
      if (err) throw err;

      console.log('Created principal:', principal);
			// app.dataSources.appversion.disconnect(function(err){
			// 	if (err) throw err;
			// });
    });
  });
});
