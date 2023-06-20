import * as yup from 'yup';

export const reactionValidationSchema = yup.object().shape({
  type: yup.string().required(),
  comment_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
