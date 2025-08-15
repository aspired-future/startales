export type MessageEnvelope = {
	id: string;
	channel: string;
	createdAt: number;
	payload: unknown;
};

export type EnvConfig = {
	offline: boolean;
};

export type Channel = {
	name: string;
};

export { type CrdtDoc, createCrdtDoc } from './crdt';

