import mongoose from 'mongoose'

const DEFAULT_NAME = 'Uncategorized'
const STARTER_NAMES = ['Food', 'Transport', 'Rent', 'Airtime & Data', 'Health', 'Entertainment', 'Education']

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 30 },
    // the fallback category. it cannot be renamed or deleted
    isDefault: { type: Boolean, default: false },
  },
  {
    // adds createdAt and updatedAt
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        return ret
      },
    },
  },
)

// no two categories with the same name, ignoring upper and lower case
categorySchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } })

// makes sure the default category exists. on an empty database it adds the starter ones too
categorySchema.statics.ensureDefault = async function () {
  const total = await this.countDocuments()

  if (total === 0) {
    const names = STARTER_NAMES.map((name) => ({ name }))
    await this.insertMany([{ name: DEFAULT_NAME, isDefault: true }, ...names])
    return
  }

  await this.updateOne(
    { isDefault: true },
    { $setOnInsert: { name: DEFAULT_NAME, isDefault: true } },
    { upsert: true },
  )
}

export default mongoose.model('Category', categorySchema)
