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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cow = void 0;
const mongoose_1 = require("mongoose");
const cow_constant_1 = require("./cow.constant");
const cowSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
        enum: cow_constant_1.location,
    },
    breed: {
        type: String,
        required: true,
        enum: cow_constant_1.breed,
    },
    weight: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
        enum: cow_constant_1.label,
    },
    category: {
        type: String,
        required: true,
        enum: cow_constant_1.category,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// validate seller of cow
cowSchema.statics.isSellerValid = function (cowId, sellerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.exists({ _id: cowId, seller: sellerId }).lean();
    });
};
// // if seller update? check if valid or not
// cowSchema.pre("findOneAndUpdate", async function (next) {
//   const updateQuery = this.getUpdate() as UpdateQuery<Partial<ICow | null>>;
//   if (!updateQuery.seller) {
//     next(); // no seller _id, so no update.
//   } else {
//     const userData = await User.findById(updateQuery.seller);
//     if (!userData) {
//       throw new ApiError(httpStatus.NOT_FOUND, "Seller not found !");
//     } else if (userData.role !== "seller") {
//       throw new ApiError(httpStatus.NOT_FOUND, "User is not a seller");
//     } else {
//       next();
//     }
//   }
// });
// // if seller exist in user model & role === seller
// cowSchema.pre("save", async function (next) {
//   const userData = await User.findById(this.seller);
//   if (!userData) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Seller is not found");
//   } else if (userData.role !== "seller") {
//     throw new ApiError(httpStatus.NOT_FOUND, "User is not a Seller");
//   } else {
//     next();
//   }
// });
exports.Cow = (0, mongoose_1.model)('Cow', cowSchema);
