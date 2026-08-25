import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import Reports from "./pages/Reports";
import Findings from "./pages/Findings";
import Recon from "./pages/Recon";
import Pipeline from "./pages/Pipeline";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/DashboardLayout";

const modulePaths = ["/workspace", "/findings", "/reports", "/authorization"];

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/workspace"} component={Workspace} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/findings"} component={Findings} />
      <Route path={"/recon"} component={Recon} />
      <Route path={"/pipeline"} component={Pipeline} />
      <Route path={"/settings"} component={Settings} />
      {modulePaths.filter((path) => path !== "/workspace" && path !== "/reports" && path !== "/findings" && path !== "/recon").map((path) => <Route key={path} path={path} component={Home} />)}
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <DashboardLayout><Router /></DashboardLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
