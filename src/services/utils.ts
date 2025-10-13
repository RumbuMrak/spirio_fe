import { GuideProfileType } from '@/features/user/types/user';
import { ImageType } from '@types';
import { clsx, type ClassValue } from 'clsx';
import { Options, serialize } from 'object-to-formdata';
import { twMerge } from 'tailwind-merge';
export const appName = 'Spirio';
export const appDescription = 'Description';
export const pageTitle = (title?: string) => {
  return title ? `${title} • ${appName}` : appName;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const setNoScroll = (condition: boolean) => {
  document.body.style.overflow = condition ? 'hidden' : 'visible';
};
export const serializeJsonToFormData = (data: any, options?: Options) => {
  return serialize(data, {
    booleansAsIntegers: true,
    indices: true,
    nullsAsUndefineds: true,
    ...options,
  });
};
export const formatNumber = (number: number, { locale = 'cs', currency, round }: { round?: number; locale?: string; currency?: string }) => {
  return Intl.NumberFormat(locale, {
    style: currency ? 'currency' : undefined,
    currency: currency,
    maximumFractionDigits: round || 0,
  }).format(number);
};
export const formatDateToTime = (date: string) => {
  return date.split('T')[1].split(':').slice(0, 2).join(':');
};
export const createCallLink = (userId: string, guideId: string) => {
  return `${userId}-${guideId}-${new Date().getTime()}`;
};
export const createAudioCallLink = (userId: string, guideId: string) => {
  return `${userId}-${guideId}-${new Date().getTime()}-audio`;
};
export const createChatLink = (userId: string, guideId: string) => {
  return `chat-${userId}-${guideId}-${new Date().getTime()}`;
};
export const secondsToMinutes = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} min ${secs} sec`;
};
export const guideName = (guide: GuideProfileType) => {
  if (!guide) return '';
  return [guide.first_name, guide.last_name].join(' ');
};
export const getImageUrl = (image: ImageType) => (image.original || image.conversions?.[0]?.urls?.[0]?.url) ?? '';
export const transformJSONAPIData = <T, R = {}>(data: { data: any } & Record<string, any>) => {
  const included: Record<string, any> = {};
  const eliminatedIncluded: Record<string, any> = {};
  let resultData: any;
  const innerRecursion = (includedData: Record<string, any>) => {
    if (includedData?.relationships) {
      includedData = { ...includedData, ...setRelationships(includedData.relationships) };
      delete includedData.relationships;
    }
    return includedData;
  };
  const setRelationships = (relationships: Record<string, { data: Record<string, any> }>) => {
    const result: Record<string, any> = {};
    const keys = Object.keys(relationships);
    keys.forEach((key) => {
      const relationship = relationships[key]?.data;
      if (!relationship) return;
      if (Array.isArray(relationship)) {
        result[key] = relationship.map((rel) => {
          if (eliminatedIncluded[rel.type]?.[rel.id] === 50) return null;
          if (!eliminatedIncluded[rel.type]) {
            eliminatedIncluded[rel.type] = {};
          }
          if (!eliminatedIncluded[rel.type][rel.id]) {
            eliminatedIncluded[rel.type][rel.id] = 0;
          }
          eliminatedIncluded[rel.type][rel.id]++;
          return innerRecursion(included[rel.type]?.[rel.id]);
        });
      } else {
        if (eliminatedIncluded[relationship.type]?.[relationship.id] === 50) return null;
        if (!eliminatedIncluded[relationship.type]) {
          eliminatedIncluded[relationship.type] = {};
        }
        if (!eliminatedIncluded[relationship.type][relationship.id]) {
          eliminatedIncluded[relationship.type][relationship.id] = 0;
        }
        eliminatedIncluded[relationship.type][relationship.id]++;
        result[key] = innerRecursion(included[relationship.type]?.[relationship.id]);
      }
    });
    return result;
  };
  if (data.included) {
    data.included.forEach((item: Record<string, any>) => {
      const { id, slug, type, attributes, ...values } = item;
      included[type] = { ...(included[type] ?? {}) };
      included[type][id] = { id, ...attributes, ...values };
    });
  }
  if (Array.isArray(data.data)) {
    data.data.forEach((item) => {
      const { id, type, slug, relationships, attributes, ...values } = item;
      resultData = [...(resultData ?? []), { id, ...attributes, ...setRelationships(item.relationships ?? {}), ...values }];
    });
    resultData = { ...data, data: resultData };
  } else {
    const { id, type, slug, relationships, attributes, ...values } = data.data;
    resultData = { ...data, data: { id, ...attributes, ...setRelationships(data.data.relationships ?? {}), ...values } };
  }
  delete resultData.included;
  return resultData as { data: T } & R;
};
