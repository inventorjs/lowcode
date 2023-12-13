import { useEffect, useRef } from 'react';
import { LC_TARGET } from '../common/constants';
import { useMaterialResourceById } from './useMaterialResourceById';

export function useLCResourceById<T extends HTMLElement>(resourceId: string) {
  const { resource } = useMaterialResourceById(resourceId)
  const ref = useRef<T>(null)
  useEffect(() => {
    if (ref.current) {
      ref.current[LC_TARGET] = {
        id: resourceId,
        type: 'resource',
      }
    }
  }, [resourceId])

  return { ref, resource }
}
