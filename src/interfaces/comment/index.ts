import { ReactionInterface } from 'interfaces/reaction';
import { ThreadInterface } from 'interfaces/thread';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CommentInterface {
  id?: string;
  content: string;
  thread_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  reaction?: ReactionInterface[];
  thread?: ThreadInterface;
  user?: UserInterface;
  _count?: {
    reaction?: number;
  };
}

export interface CommentGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  thread_id?: string;
  user_id?: string;
}
