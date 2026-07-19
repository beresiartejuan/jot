import { Route, Switch } from "wouter";
import { LandingPage } from "@/pages/LandingPage";
import { TermsPage } from "@/pages/TermsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { DashboardPage } from "@/pages/DashboardPage";

function App(): React.JSX.Element {
	return (
		<Switch>
			<Route path="/" component={LandingPage} />
			<Route path="/terms" component={TermsPage} />
			<Route path="/privacy" component={PrivacyPage} />
			<Route path="/login" component={LoginPage} />
			<Route path="/signup" component={SignupPage} />
			<Route path="/dashboard" component={DashboardPage} />
			<Route path="/explore">{<div className="p-8">Explore public notes — coming soon.</div>}</Route>
			<Route>
				{<div className="flex min-h-screen items-center justify-center p-8 text-muted-foreground">
					Page not found
				</div>}
			</Route>
		</Switch>
	);
}

export default App;
