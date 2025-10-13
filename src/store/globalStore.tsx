import { UserType } from '@/features/user/types/user';
import { useState } from 'react';
import { createContainer } from 'react-tracked';
const initialState = {
  init: false,
  counter: 0,
  user: null as UserType | null,
  userMenuOpen: false,
  modal: [] as { name: string; queries?: Record<string, string> }[],
};
export const {
  Provider: GlobalStoreProvider,
  useTracked: useGlobalStore,
  useTrackedState: useGlobalStoreState,
  useUpdate: useGlobalStoreUpdate,
} = createContainer(() => useState<typeof initialState>(initialState));
