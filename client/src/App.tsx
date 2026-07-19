import { Route, Switch } from "wouter";
import { LandingPage } from "@/pages/LandingPage";

function App(): React.JSX.Element {
	return (
		<Switch>
			<Route path="/" component={LandingPage} />
			<Route path="/explore">{<div className="p-8">Explore public notes — coming soon.</div>}</Route>
			<Route path="/login">{<div className="p-8">Log in — coming soon.</div>}</Route>
			<Route path="/signup">{<div className="p-8">Sign up — coming soon.</div>}</Route>
			<Route>
				{<div className="flex min-h-screen items-center justify-center p-8 text-muted-foreground">
					Page not found
				</div>}
			</Route>
		</Switch>
	);
}

export default App;
