import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Beats from "./pages/Beats";
import Submit from "./pages/Submit";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import PurchaseSuccess from "./pages/PurchaseSuccess";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/beats"} component={Beats} />
      <Route path={"/submit"} component={Submit} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/purchase-success"} component={PurchaseSuccess} />
      <Route path={"/404"} component={NotFound} />
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
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
