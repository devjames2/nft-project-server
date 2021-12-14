import mongoose from 'mongoose'
// import mongoose from "mongoose"

var Schema = mongoose.Schema;

var nftVoucherSchema = new Schema(
  {
    // tokenId: { type: Number, required: true, unique: true },
    name: String,
    symbol: String,
    token_address: String,
    token_id: String,
    token_uri: String,
    owner_of: String,
    amount: Number,
    contract_type: String,
    metadata: String,
    is_valid: Number,
    frozen: Number,
    min_price: Number,
    signature: String,
    creator_address: String,
    royalty: Number,
    fee: Number
  },
  {
    collection: 'lazymint-items'
  }
);

// module.exports = mongoose.model('lazymint-voucher', nftVoucherSchema);
export default mongoose.model('lazymint-voucher', nftVoucherSchema);