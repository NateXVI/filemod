interface ModifierContainerProps {
	children: JSX.Element;
}

export default function ModifierContainer({ children }: ModifierContainerProps) {
	return <div>{children}</div>;
}
