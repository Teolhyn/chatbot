import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
	const { data: session, isPending } = authClient.useSession();
	const navigate = useNavigate();

	const privateData = useQuery(orpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			navigate("/login");
		}
	}, [session, isPending]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<p>privateData: {privateData.data?.message}</p>
		</div>
	);
}
