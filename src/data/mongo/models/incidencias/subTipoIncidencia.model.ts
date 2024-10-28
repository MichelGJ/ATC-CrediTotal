import mongoose from 'mongoose';


const subTipoIncidenciaSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ]
  },
  tipoIncidenciaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [ true, 'Name is required' ],
    ref: 'TipoIncidencia'
  }
} );

subTipoIncidenciaSchema.pre('validate', function (next) {
  if (!this.isNew) {
    this.markModified('name');
    this.markModified('tipoIncidencia');
  }
  next();
});

subTipoIncidenciaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
    delete ret.password;
  },
})


export const SubTipoIncidenciaModel = mongoose.model('SubTipo_Incidencia', subTipoIncidenciaSchema);

