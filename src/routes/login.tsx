import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { unauthPageMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	server: {
		middleware: [unauthPageMiddleware],
	},
});

function LoginPage() {
	const { mutate: login } = useMutation({
		mutationFn: async (provider: "discord") => {
			const result = await authClient.signIn.social({ provider });
			if (result.error) {
				throw result.error;
			}
			return result.data;
		},
		onError(error) {
			console.error(error);
		},
	});

	return (
		<div>
			<h1>Login</h1>
			<div>
				<Button onClick={() => login("discord")}>Login with Discord</Button>
			</div>
		</div>
	);
}
