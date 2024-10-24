import mongoose from 'mongoose';


const roleSchema = new mongoose.Schema( {

  nombre: {
    type: String,
    required: [ true, 'Nombre is required' ]
  },
  permisos: {
    type: [String],
    required: [ true, 'Permisos is required' ],
    enum: ['usuarios','atp','incidencias']
  }

} );


roleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
    delete ret.password;
  },
})


export const RoleModel = mongoose.model('Role', roleSchema);

