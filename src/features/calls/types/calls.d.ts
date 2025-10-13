import { GuideProfileType } from '@/features/user/types/user';
export type StreamType = {
  created_at: string;
  guideProfile: GuideProfileType;
  happening_at: string;
  id: string;
  title: string;
  uuid: string;
  getstream_livestream_id:string;
};
