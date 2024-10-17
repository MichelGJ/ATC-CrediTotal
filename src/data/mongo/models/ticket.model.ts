import mongoose, { Schema } from 'mongoose';


const ticketSchema = new mongoose.Schema( {

  name: {
    type: String,
    required: [ true, 'Name is required' ],
    unique: true,
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
  

} );

ticketSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function( doc, ret, options ) {
    delete ret._id;
  },
})


export const ProductModel = mongoose.model('Ticket', ticketSchema);