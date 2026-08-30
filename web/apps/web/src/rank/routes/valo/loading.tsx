import { Spinner } from "@workspace/ui/components/spinner";
import { Layout } from "@/components/layout";

export const Loading = () => (
	<Layout className="h-screen">
		<Layout className="w-8/10 bg-muted">
			Joining...<Spinner />
		</Layout>
	</Layout>
)