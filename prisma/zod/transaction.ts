import * as z from "zod"
import { TransactionType } from "@prisma/client"
import { CompleteCard, RelatedCardModel } from "./index"

export const TransactionModel = z.object({
  id: z.string(),
  type: z.nativeEnum(TransactionType),
  summ: z.number().int(),
  reason: z.string(),
  date: z.date(),
  comment: z.string().nullish(),
  fromCardId: z.string(),
  toCardId: z.string().nullish(),
})

export interface CompleteTransaction extends z.infer<typeof TransactionModel> {
  fromCard: CompleteCard
  toCard?: CompleteCard | null
}

/**
 * RelatedTransactionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTransactionModel: z.ZodSchema<CompleteTransaction> = z.lazy(() => TransactionModel.extend({
  fromCard: RelatedCardModel,
  toCard: RelatedCardModel.nullish(),
}))
