import { Link, useLocation } from "@tanstack/react-router";
import {
	CalendarDaysIcon,
	CircleEllipsisIcon,
	CogIcon,
	ScrollTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function ActionsMenu() {
	const { pathname } = useLocation();

	const getLink = (to: string, icon: React.ReactNode) => {
		return (
			<Button
				variant={pathname === to ? "default" : "outline"}
				size="icon-lg"
				asChild
				data-active={to === pathname}
			>
				<Link to={to}>{icon}</Link>
			</Button>
		);
	};

	return (
		<ButtonGroup>
			{getLink("/recipes", <ScrollTextIcon />)}
			<Button variant="outline" size="icon-lg" disabled>
				<CalendarDaysIcon />
			</Button>
			<Button variant="outline" size="icon-lg" disabled>
				<CogIcon />
			</Button>
			<Button variant="outline" size="icon-lg" disabled>
				<CircleEllipsisIcon />
			</Button>
		</ButtonGroup>
	);
}
