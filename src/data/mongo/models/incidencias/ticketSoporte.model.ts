import mongoose from 'mongoose';


const ticketSoporteSchema = new mongoose.Schema({

  tipoIncidenciaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'tipoIncidenciaId is required'],
    ref: 'Tipo_Incidencia'
  },
  subTipoIncidenciaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'subTipoIncidenciaId is required'],
    ref: 'SubTipo_Incidencia'
  },
  descripcion: {
    type: String,
    required: [true, 'descripcion is required']
  },
  cedulaCliente: {
    type: String,
    required: [true, 'cedulaCliente is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'userId is required'],
    ref: 'User'
  },
  estatus: {
    type: String,
    required: [true, 'estatus is required']
  }

});

ticketSoporteSchema.pre('validate', function (next) {
  if (!this.isNew) {
    // Skip required validation for certain fields when updating
    this.markModified('tipoIncidenciaId');
    this.markModified('subTipoIncidenciaId');
    this.markModified('descripcion');
    this.markModified('cedulaCliente');
    this.markModified('userId');
    this.markModified('estatus');
  }
  next();
});

ticketSoporteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.password;
  },
})


export const TicketSoporteModel = mongoose.model('Ticket_Soporte', ticketSoporteSchema);

