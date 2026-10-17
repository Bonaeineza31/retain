import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    // stores the hashed password, never the real one. hidden from queries by default
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    // adds createdAt and updatedAt
    timestamps: true,
    toJSON: {
      // never send the password hash or the internal version field
      transform(doc, ret) {
        delete ret.__v
        delete ret.password
        return ret
      },
    },
  },
)

export default mongoose.model('User', userSchema)
