import Joi from 'joi';
// import { COURSE_ENUM } from '../Course/Course'

export default {
  btcPay: Joi.object().keys({
    // course: Joi.string().required().valid(COURSE_ENUM.MASTER_CLASS, COURSE_ENUM.PREMIUM_VIP, COURSE_ENUM.PREMIUM_VIP_QUARTERLY, COURSE_ENUM.PREMIUM_VIP_YEARLY),
    // price: Joi.number().required(),
    currency: Joi.string().required().valid("USD"),
    itemCode: Joi.string().required(),
    itemDesc: Joi.string().required(),
    data: {
      product: Joi.string().required(),
      Action: Joi.string().required(),
      Email: Joi.string().required(),
      Telegram: Joi.string().required(),
    },
  }),
  chargeCoinbase: Joi.object().keys({
    // course: Joi.string().required().valid(COURSE_ENUM.MASTER_CLASS, COURSE_ENUM.PREMIUM_VIP, COURSE_ENUM.PREMIUM_VIP_QUARTERLY, COURSE_ENUM.PREMIUM_VIP_YEARLY)
  }),
  coinbase_header: Joi.object().keys({
    'X-CC-Webhook-Signature': Joi.string().required()
  }),
};