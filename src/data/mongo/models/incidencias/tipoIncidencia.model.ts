import mongoose from 'mongoose';


const tipoIncidenciaSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
} );

tipoIncidenciaSchema.pre('validate', function (next) {
  if (!this.isNew) {
    this.markModified('name');
  }
  next();
});

tipoIncidenciaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
    delete ret.password;
  },
})


export const TipoIncidenciaModel = mongoose.model('TipoIncidencia', tipoIncidenciaSchema);

