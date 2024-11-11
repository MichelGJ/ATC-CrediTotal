import mongoose from 'mongoose';


const ticketPresencialSchema = new mongoose.Schema({

  descripcion: {
    type: String
  },
  cedulaCliente: {
    type: String,
  },
  resultado: {
    type: String,
    enum: ['Resuelto','No Resuelto','Se fue', 'Incompleto']
  },
  fechaInicio: {
    type: Date
  },
  fechaFin: {
    type: Date
  },
  user: {
    type: String,
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

