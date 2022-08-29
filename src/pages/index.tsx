import { useLocalStorage } from '@mantine/hooks';
import ModifierTabs from 'components/ModifierTabs';
import { useState } from 'react';
import { ModifierComponent, ModifierTab } from 'types/ModifierTypes';

export default function Main() {
	const [tabs, setTabs] = useLocalStorage<ModifierTab[]>({
		key: 'tabs',
		defaultValue: [],
	});
	const [selectedTab, setSelectedTab] = useState<number>(0);
	if (selectedTab > tabs.length - 1 && tabs.length > 0) setSelectedTab(0);

	const addTab = () => {
		setTabs([...tabs, { modifiers: [], name: `Tab ${tabs.length + 1}` }]);
	};
	const deleteTab = (i: number) => {
		tabs.splice(i, 1);
		setTabs([...tabs]);
	};

	return (
		<div>
			<header className="w-screen h-9">
				<div>
					<ModifierTabs
						tabs={tabs}
						selectedIndex={selectedTab}
						setSelectedIndex={setSelectedTab}
						addTab={addTab}
						deleteTab={deleteTab}
					/>
				</div>
			</header>
			<main>
				<div></div>
				<div></div>
			</main>
		</div>
	);
}
