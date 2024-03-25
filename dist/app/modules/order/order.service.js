"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const order_model_1 = require("./order.model");
const user_model_1 = require("../user/user.model");
const cow_model_1 = require("../cow/cow.model");
const mongoose_1 = __importDefault(require("mongoose"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const users_1 = require("../../../enums/users");
// create order
const createOrder = (user, order) => __awaiter(void 0, void 0, void 0, function* () {
    if (order.buyer !== user._id) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Buyer Field will be your user id : ${user._id}`);
    }
    const buyer = yield user_model_1.User.findById(order.buyer).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Buyer not found'));
    const cow = yield cow_model_1.Cow.findOne({
        _id: order.cow,
        label: { $ne: 'sold out' },
    }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Cow not found or Cow has been Sold'));
    if (buyer.budget >= cow.price) {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // Seller income addition
            yield user_model_1.User.findByIdAndUpdate(cow.seller, { $inc: { income: Number(cow.price) } }, { new: true, session }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to update seller'));
            // Buyer budget deduction
            yield user_model_1.User.findByIdAndUpdate(buyer._id, { $inc: { budget: -Number(cow.price) } }, { new: true, session }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to update buyer'));
            // cow sold out
            yield cow_model_1.Cow.findByIdAndUpdate(cow._id, { label: 'sold out' }, { new: true, session }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to update cow'));
            // create order
            const newOrder = yield order_model_1.Order.create([order], { session });
            yield session.commitTransaction();
            yield session.endSession();
            const populatedOrder = yield order_model_1.Order.findById(newOrder[0]._id)
                .populate({
                path: 'cow',
                populate: {
                    path: 'seller',
                },
            })
                .populate('buyer');
            return populatedOrder;
        }
        catch (error) {
            yield session.abortTransaction();
            throw error;
        }
    }
    else {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Buyer has insufficient budget');
    }
});
// get specific orders
const getAllOrders = (userAuthData) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, role } = userAuthData;
    const query = {};
    // field filtering: in populated data with match: if no match, cow = null
    const populatePaths = [
        { path: 'buyer' },
        {
            path: 'cow',
            match: role === users_1.ENUM_USER_ROLE.SELLER ? { seller: _id } : undefined,
            populate: {
                path: 'seller',
            },
        },
    ];
    // buyer: add field filter
    // admin | seller: do nothing: query= {};
    // !buyer | !admin | !seller: throw error
    if (role === users_1.ENUM_USER_ROLE.BUYER) {
        query.buyer = _id; // field filtering
    }
    else if (role !== users_1.ENUM_USER_ROLE.ADMIN && role !== users_1.ENUM_USER_ROLE.SELLER) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'User must be Admin | Buyer | Seller');
    }
    let orders = yield order_model_1.Order.find(query)
        .lean()
        .populate(populatePaths)
        .orFail(new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Failed / invalid access. buyer/ seller can only access orders related to them. Admin access all.'));
    // seller & push the order.cow !== null
    if (role === users_1.ENUM_USER_ROLE.SELLER) {
        orders = orders.filter(order => order.cow !== null);
    }
    // empty means this user have no access of any orders
    if (!orders.length) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "This seller's cows have not been ordered yet");
    }
    return orders;
});
// get specific single order
const getSingleOrder = (userAuthData, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, role } = userAuthData;
    const query = { _id: orderId };
    // field filtering: in populated data with match: if no match cow = null
    const populatePaths = [
        { path: 'buyer' },
        {
            path: 'cow',
            match: role === users_1.ENUM_USER_ROLE.SELLER ? { seller: _id } : undefined,
            populate: {
                path: 'seller',
            },
        },
    ];
    // buyer: add field filter
    // admin | seller: do nothing: { _id: orderId };
    // !buyer | !admin | !seller: throw error
    if (role === users_1.ENUM_USER_ROLE.BUYER) {
        query.buyer = _id; // field filtering
    }
    else if (role !== users_1.ENUM_USER_ROLE.ADMIN && role !== users_1.ENUM_USER_ROLE.SELLER) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'User must be Admin | Buyer | Seller');
    }
    const order = yield order_model_1.Order.findOne(query)
        .lean()
        .populate(populatePaths)
        .orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed / invalid access. buyer/ seller can only access order related to them. Admin access all.'));
    // seller & order.cow === null
    if (role === users_1.ENUM_USER_ROLE.SELLER && !order.cow) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Seller only have access to order of own cow.');
    }
    return order;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getSingleOrder,
};
