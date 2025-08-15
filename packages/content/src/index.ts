export type ContentPack = {
  id: string;
  name: string;
  version: string;
};

export function listPacks(): ContentPack[] {
  return [{ id: 'core', name: 'Core Pack', version: '0.1.0' }];
}


