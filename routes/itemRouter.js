import express from "express"
import NftVoucherModel from "../models/NftVoucher.js"
import Moralis from "moralis/node.js"
import asyncify from "express-asyncify"
import dotenv from "dotenv"


dotenv.config();

const itemRouter = asyncify(express.Router());

//Get metadata for one token
// const Moralis = require('moralis');
/* Moralis init code */
const serverUrl = process.env.MORALIS_SERVER;
const appId = process.env.MORALIS_APP_ID;
Moralis.start({ serverUrl, appId });

// GET All vouchers
itemRouter.get('/vouchers', function (req, res) {
    NftVoucherModel.find(function (err, vouchers) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.json(vouchers);
    })
});

// GET Voucher
itemRouter.get('/vouchers/:token_id', function (req, res) {
    NftVoucherModel.findOne({ _id: req.params.token_id }, function (err, voucher) {
        if (err) return res.status(500).json({ error: err });
        if (!voucher) return res.status(404).json({ error: 'voucher not found' });
        res.json(voucher);
    })
});

// GET All my minted item and lazy-mint item
itemRouter.get('/all', async function (req, res) {

    const lazyMintedItems = await NftVoucherModel.find().exec();

    console.log(lazyMintedItems)

    // const options = { chain: req.query.chain, address: '0xcEA695c0F108833f347239bB2f05CEF06F6a7658' };
    const options = { chain: req.query.chain, address: req.query.address };
    const mintedMyNFTs = await Moralis.Web3API.account.getNFTs(options);
    console.log(mintedMyNFTs)

    const allItems = [...lazyMintedItems, ...mintedMyNFTs.result]

    res.json(allItems)

});


// Create Voucher
itemRouter.post('/voucher', function (req, res) {
    var voucher = new NftVoucherModel();
    voucher.name = req.body.name;
    voucher.symbol = req.body.symbol;
    voucher.token_address = req.body.token_address;
    voucher.token_id = req.body.token_id;
    voucher.token_uri = req.body.token_uri;
    voucher.owner_of = req.body.owner_of;
    voucher.amount = req.body.amount;
    voucher.contract_type = req.body.contract_type;
    voucher.metadata = req.body.metadata;
    voucher.is_valid = req.body.is_valid;
    voucher.frozen = req.body.frozen;
    voucher.min_price = req.body.min_price;
    voucher.signature = req.body.signature;
    voucher.creator_address = req.body.creator_address;
    voucher.royalty = req.body.royalty;
    voucher.fee = req.body.fee;

    // console.log(JSON.stringify(req.body));
    // console.log(JSON.stringify(voucher));

    voucher.save(function (err) {
        if (err) {
            console.error(err);
            res.json({ result: 0 });
            return;
        }

        res.json({ result: 1 });

    });
});


// DELETE voucher
itemRouter.delete('/vouchers/:token_id', function (req, res) {
    NftVoucherModel.deleteOne({ token_id: req.params.token_id }, function (err, output) {
        if (err) return res.status(500).json({ error: "database failure" });

        res.status(204).end();
    })
});

export default itemRouter;