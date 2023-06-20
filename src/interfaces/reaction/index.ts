import { CommentInterface } from 'interfaces/comment';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ReactionInterface {
  id?: string;
  type: string;
  comment_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  comment?: CommentInterface;
  user?: UserInterface;
  _count?: {};
}

export interface ReactionGetQueryInterface extends GetQueryInterface {
  id?: string;
  type?: string;
  comment_id?: string;
  user_id?: string;
}
