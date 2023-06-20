import * as yup from 'yup';

export const threadValidationSchema = yup.object().shape({
  title: yup.string().required(),
  organization_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
