export type CrdtDoc<T> = {
  get(): T;
  apply(patch: Partial<T>): void;
};

export function createCrdtDoc<T>(initial: T): CrdtDoc<T> {
  let state = { ...initial } as T;
  return {
    get: () => state,
    apply: (patch: Partial<T>) => {
      state = { ...state, ...patch } as T;
    },
  };
}


