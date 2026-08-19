import { Spinner } from "@workspace/ui/components/spinner";
import { Layout } from "@workspace/ui/elements/layout";

export const Loading = () => (
	<Layout className="h-screen bg-muted">
		Joining...<Spinner />
	</Layout>
)