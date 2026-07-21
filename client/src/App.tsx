import { Route, Switch } from "wouter";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { NoteEditPage } from "@/pages/NoteEditPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { SignupPage } from "@/pages/SignupPage";
import { TermsPage } from "@/pages/TermsPage";

function App(): React.JSX.Element {
	return (
		<Switch>
			<Route path="/" component={LandingPage} />
			<Route path="/terms" component={TermsPage} />
			<Route path="/privacy" component={PrivacyPage} />
			<Route path="/login" component={LoginPage} />
			<Route path="/signup" component={SignupPage} />
			<Route path="/dashboard" component={DashboardPage} />
			<Route path="/notes/:id" component={NoteEditPage} />
			<Route path="/explore">
				{<div className="p-8">Explore public notes — coming soon.</div>}
			</Route>
			<Route>
				{
					<div className="flex min-h-screen items-center justify-center p-8 text-muted-foreground">
						Page not found
					</div>
				}
			</Route>
		</Switch>
	);
}

export default App;
