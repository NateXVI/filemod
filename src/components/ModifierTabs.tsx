import { ActionIcon, Group } from '@mantine/core';
import { Plus, X } from 'tabler-icons-react';
import { ModifierTab } from 'types/ModifierTypes';

interface ModifierTabsProps {
	tabs: ModifierTab[];
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
	addTab: () => void;
	deleteTab: (i: number) => void;
}

export default function ModifierTabs({
	tabs,
	selectedIndex,
	setSelectedIndex,
	addTab,
	deleteTab,
}: ModifierTabsProps) {
	return (
		<Group>
			{tabs.map((v, i) => {
				let classes =
					'cursor-pointer p-2 h-9 w-[210px] flex-none flex justify-between items-center';
				if (i === selectedIndex) classes += ' bg-gray-400';
				return (
					<div key={i} className={classes} onClick={() => setSelectedIndex(i)}>
						{v.name}
						<ActionIcon>
							<X onClick={() => deleteTab(i)} />
						</ActionIcon>
					</div>
				);
			})}
			<div>
				<ActionIcon onClick={() => addTab()}>
					<Plus />
				</ActionIcon>
			</div>
		</Group>
	);
}
