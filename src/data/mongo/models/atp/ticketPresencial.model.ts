import mongoose from 'mongoose';


const ticketPresencialSchema = new mongoose.Schema({

  descripcion: {
    type: String,
    required: [true, 'descripcion is required']
  },
  cedulaCliente: {
    type: String,
    required: [true, 'cedulaCliente is required']
  },
  resultado: {
    type: String,
    required: [true, 'resultado is required'],
    enum: ['Resuelto','No Resuelto','Se fue']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'fechaInicio is required']
  },
  fechaFin: {
    type: Date,
    required: [true, 'fechaFin is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'userId is required'],
    ref: 'User'
  },
});

ticketPresencialSchema.pre('validate', function (next) {
  if (!this.isNew) {
    // Skip required validation for certain fields when updating
    this.markModified('descripcion');
    this.markModified('cedulaCliente');
    this.markModified('resultado');
    this.markModified('fechaInicio');
    this.markModified('fechaFin');
    this.markModified('userId');
  }
  next();
});

ticketPresencialSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.password;
  },
})


export const TicketPresencialModel = mongoose.model('Ticket_Presencial', ticketPresencialSchema);

