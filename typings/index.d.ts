declare const chrome;

declare const __DEV__;
declare const require;

// temp fix for mobx...flow.d.ts
declare type AsyncGenerator<A, B, C> = any;

declare type MobX = typeof import("mobx");
declare type MobXReact = typeof import("mobx-react");