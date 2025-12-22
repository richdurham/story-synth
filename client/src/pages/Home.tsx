import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to game interface
    navigate("/game");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white">Story Synth</CardTitle>
            <CardDescription className="text-slate-400">A collaborative political role-playing game</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-slate-300">
              <p className="mb-4">Join other players in a dynamic political simulation where your decisions shape the kingdom's fate.</p>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Play as different political roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Make decisions that affect the game state</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Communicate privately with other players</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold">•</span>
                  <span>Experience AI-generated narrative outcomes</span>
                </li>
              </ul>
            </div>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Sign In to Play
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
