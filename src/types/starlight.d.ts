declare module '@astrojs/starlight' {
  const content: any;
  export default content;
}

declare module '@astrojs/starlight/config' {
  const content: any;
  export default content;
}

declare module '@astrojs/starlight/integrations/*' {
  const content: any;
  export default content;
}

declare global {
  interface Window {
    __hero3dModule?: any;
    __heroLensflareModule?: any;
    __heroLensflareCleanup?: (() => void) | null;
    __knowledgeNavigatorModule?: any;
  }

  interface Element {
    __graphCleanup?: (() => void) | null;
  }
}

export {};
