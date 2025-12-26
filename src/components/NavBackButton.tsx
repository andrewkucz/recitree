import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

export function NavBackButton() {
	return (
		<Button asChild size="icon" variant="outline">
			<Link to="..">
				<ArrowLeftIcon />
			</Link>
		</Button>
	);
}
