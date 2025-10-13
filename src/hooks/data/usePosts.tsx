import { GuideProfileType } from '@/features/user/types/user';
import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import { ImageType, PaginatedResponse } from '@types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
const take = 5;
const usePosts = (params?: PostParamsType) => {
  const router = useRouter();
  const page = router.query['posts-page'] ? Number(router.query['posts-page']) : 1;
  const data = useSWR(
    ['posts', page, JSON.stringify(params)],
    router.isReady
      ? () => {
          return getPosts(page, params);
        }
      : null,
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
    },
  );
  return { ...data, data: data.data?.data, postsCount: data.data?.meta.count ?? 0, postsPages: Math.ceil(data.data?.meta.count ?? 0) / take };
};
export default usePosts;
export const getPosts = (page?: number, params?: PostParamsType) => {
  return api
    .get('/articles/index', {
      params: { page, take, ...params },
    })
    .then(async (res) => {
      const posts = transformJSONAPIData<PostsType[], PaginatedResponse>(res.data);
      return posts;
    });
};
export const getPost = (slug?: string) => {
  return api
    .get('/articles/show', {
      params: { slug },
    })
    .then(async (res) => {
      const post = transformJSONAPIData<PostsType>(res.data).data;
      return post;
    });
};
export type PostsType = {
  content: string;
  cover: ImageType;
  created_at: string;
  guideProfile: GuideProfileType;
  id: string;
  specializations: [];
  title: string;
  updated_at: string;
};
type PostParamsType = {
  page?: number;
  take?: number;
  'filter[guide_profile_id]'?: string;
  'filter[not_id]'?: string[];
};
