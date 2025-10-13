import api from '@/services/api';
import { serializeJsonToFormData, transformJSONAPIData } from '@/services/utils';
import { StreamType } from '../types/calls';
import { PaginatedResponse } from '@types';
export const generateCallToken = (user_id?: string) => {
  return api.post('/getstream/generate_token', serializeJsonToFormData({ user_id })).then(async (res) => {
    return res.data.token;
  });
};
export const getStreams = (page?: number, take?: number) => {
  return api
    .get('/streams/index', {
      params: { page, take, sort: ['-happening_at'] },
    })
    .then(async (res) => {
      const streams = transformJSONAPIData<StreamType[], PaginatedResponse>(res.data);
      return streams;
    });
};
export const storeCallRating = (callId?: string, rating?: number) => {
  return api.post('/calls/storeRating', serializeJsonToFormData({ callId, rating })).then(async (res) => {
    return res.data.token;
  });
};
export const getStreamsWeb = (page?: number, take?: number) => {
  return api
    .get('/streams/indexweb', {
      params: { page, take, sort: ['-happening_at'] },
    })
    .then(async (res) => {
      const streams = transformJSONAPIData<StreamType[], PaginatedResponse>(res.data);
      return streams;
    });
};
export const updateStream = (id:string, uuid: string, getstream_livestream_id: string) => {
  return api
    .post('/streams/update', serializeJsonToFormData({ id ,uuid,  getstream_livestream_id})
    )
    .then(async (res) => {
      return res.data.getstream_livestream_id;
    });
};
export const getStream = (uuid: string) => {
  return api
    .get(`/streams/index`, {
      params: {
        'filter[uuid]': [uuid],
      },
    })
    .then((res) => {
      const stream = transformJSONAPIData<StreamType[]>(res.data).data;
      return stream;
    });
};
export const getStreamWeb = (uuid: string) => {
  return api
    .get(`/streams/indexweb`, {
      params: {
        'filter[uuid]': [uuid],
      },
    })
    .then((res) => {
      const stream = transformJSONAPIData<StreamType[]>(res.data).data;
      return stream;
    });
};
export const deleteStream = (id: string) => {
  return api.post(`/streams/destroy`, serializeJsonToFormData({ id }));
};
