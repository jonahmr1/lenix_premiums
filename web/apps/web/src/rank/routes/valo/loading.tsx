import { Spinner } from "@workspace/ui/components/spinner";
import { Layout } from "@workspace/ui/elements/layout";

export const LoadingScreen = () => (
	<Layout className="h-screen bg-muted">
		<Spinner />
	</Layout>
)