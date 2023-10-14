import Joi from 'joi';
import { JoiAuthBearer } from '../helpers/validator';

export const authBearerSchema = Joi.object().keys({
    authorization: JoiAuthBearer().required(),
}).unknown(true)