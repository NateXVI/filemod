import { ReactElement } from 'react';

export type ModifierInput = {
	files: string[]; // files being modified
	dirs: string[]; // directories being modified
};
export type ModifierOutput = ModifierInput;

export type ModifierProps = {
	state: any;
	update: () => {};
	input: ModifierInput;
};

export type ModifierComponent = (props: ModifierProps) => ReactElement;

export type ModifyFunction = (
	input: ModifierInput,
	state: any
) => Promise<ModifierOutput> | ModifierOutput;
export type PreviewFunction = (
	input: ModifierInput,
	state: any
) => Promise<ModifierOutput> | ModifierOutput;

export type ModifierExports = {
	component: ModifierComponent;
	modify: ModifyFunction;
	preview: PreviewFunction;
};

export type ModifierTab = {
	name: string;
	modifiers: {
		module: string;
		state: any;
		enabled: boolean;
	}[];
};
