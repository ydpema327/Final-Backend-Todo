import { ITodo } from './../types/authTypes';
import { model, Schema } from "mongoose";

const UserSchema: Schema = new Schema<ITodo>({
    text: { type: String, required: true,},
    completed: { type: Boolean, required: true }
}, {
    timestamps: true
})

export default model<ITodo>("Todo", UserSchema)