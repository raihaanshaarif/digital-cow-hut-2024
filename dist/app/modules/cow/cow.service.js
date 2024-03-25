"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cow_model_1 = require("./cow.model");
const cow_constant_1 = require("./cow.constant");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
// create a cow
const createCow = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.seller !== user._id) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Seller Field will be your user id : ${user._id}`);
    }
    const newCow = (yield cow_model_1.Cow.create(payload)).populate('seller');
    if (!newCow) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create cow');
    }
    return newCow;
});
// get all cows
const getAllCows = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                if (field === 'maxPrice') {
                    return { price: { $lte: value } };
                }
                if (field === 'minPrice') {
                    return { price: { $gte: value } };
                }
                else {
                    return { [field]: value };
                }
            }),
        });
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.Cow.find(whereConditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield cow_model_1.Cow.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
// get single cow
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id)
        .populate('seller')
        .orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Cow not found'));
    return result;
});
// update a cow
const updateCow = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield cow_model_1.Cow.exists({ _id: id }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Cow not found'));
    // Only the specific seller of the cow can update
    const isSellerValid = yield cow_model_1.Cow.isSellerValid(id, user._id);
    if (!isSellerValid) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Can only be accessed by the seller of the cow');
    }
    // No data from client-side
    if (Object.keys(payload).length < 1) {
        throw new Error('No data found to update');
    }
    // if seller field updates?
    // seller field === logged in seller id
    if (payload.seller && payload.seller !== user._id) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Seller Field will be your user id : ${user._id}`);
    }
    const result = yield cow_model_1.Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    })
        .populate('seller')
        .orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to Update'));
    return result;
});
// delete a cow
const deleteCow = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    yield cow_model_1.Cow.exists({ _id: id }).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'No cow found to delete'));
    // Only the specific seller of the cow can delete
    const isSellerValid = yield cow_model_1.Cow.isSellerValid(id, user._id);
    if (!isSellerValid) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Can only be accessed by the seller of the cow');
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete(id).orFail(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Failed to Delete'));
    return result;
});
exports.CowService = {
    createCow,
    getAllCows,
    getSingleCow,
    updateCow,
    deleteCow,
};
