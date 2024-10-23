import mongoose from 'mongoose';


const userSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
  cedula: {
    type: String,
    required: [ true, 'Cedula is required' ]
  },
  email: {
    type: String,
    required: [ true, 'Email is required' ],
    unique: true,
  },
  password: {
    type: String,
    required: [ true, 'Password is required' ]
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }

} );

userSchema.pre('validate', function (next) {
  if (!this.isNew) {
    // Skip required validation for certain fields when updating
    this.markModified('password');
    this.markModified('name');
    this.markModified('cedula');
    this.markModified('email');
  }
  next();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
    delete ret.password;
  },
})


export const UserModel = mongoose.model('User', userSchema);

