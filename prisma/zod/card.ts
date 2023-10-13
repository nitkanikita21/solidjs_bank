import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteTransaction, RelatedTransactionModel } from "./index"

export const CardModel = z.object({
  id: z.string(),
  ownerId: z.string(),
  createTime: z.date(),
  numericalId: z.string(),
  image: z.string().nullish(),
  name: z.string(),
  balance: z.number().int(),
})

export interface CompleteCard extends z.infer<typeof CardModel> {
  owner: CompleteUser
  transactionFrom: CompleteTransaction[]
  transactionTo: CompleteTransaction[]
}

/**
 * RelatedCardModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCardModel: z.ZodSchema<CompleteCard> = z.lazy(() => CardModel.extend({
  owner: RelatedUserModel,
  transactionFrom: RelatedTransactionModel.array(),
  transactionTo: RelatedTransactionModel.array(),
}))
