export class CreateItemVoucherDto {
    name: String;
    symbol: String;
    token_address: String;
    token_id: String;
    token_uri: String;
    owner_of: String;
    amount: Number;
    contract_type: String;
    metadata: String;
    is_valid: Number;
    frozen: Number;
    min_price: Number;
    signature: String;
    creator_address: String;
    royalty: Number;
    fee: Number;
}
