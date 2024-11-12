import mongoose from 'mongoose';


const ticketSoporteSchema = new mongoose.Schema({

  tipoIncidenciaId: {
    type: String,
    required: [true, 'tipoIncidenciaId is required'],
  },
  subTipoIncidenciaId: {
    type: String,
    required: [true, 'subTipoIncidenciaId is required'],
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
    type: String,
    required: [true, 'userId is required'],
  },
  estatus: {
    type: String,
    required: [true, 'estatus is required']
  },
  fecha: {
    type: Date,
    required: [true, 'fecha is required']
  },

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
    this.markModified('fecha');
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

