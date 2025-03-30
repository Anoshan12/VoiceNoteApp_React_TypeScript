import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { Notification } from "./components/notification";
import { SimpleThemeProvider } from "./context/simple-theme-context";
import { SimpleNotesProvider } from "./context/simple-notes-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <SimpleThemeProvider>
      <SimpleNotesProvider>
        <Router />
        <Toaster />
        <Notification />
      </SimpleNotesProvider>
    </SimpleThemeProvider>
  );
}

export default App;
