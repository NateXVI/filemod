import ExampleModifier from './ExampleModifier';
import type { ModifierExports } from 'types/ModifierTypes';

const exports: ModifierExports = {
	component: ExampleModifier,
	modify: (input, state) => input,
	preview: (input, state) => input, // this modifier doesn't do anything, so it just returns what it gets
};

module.exports = exports;
