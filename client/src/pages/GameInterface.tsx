import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Send, Mail } from "lucide-react";
import { toast } from "sonner";

export default function GameInterface() {
  const { user, isAuthenticated } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [recipientRole, setRecipientRole] = useState("");

  // Fetch game configuration
  const { data: config, isLoading: configLoading } = trpc.game.config.useQuery();

  // Fetch current game state
  const { data: gameState, isLoading: stateLoading, refetch: refetchState } = trpc.game.state.useQuery();

  // Fetch current issue
  const { data: currentIssue, isLoading: issueLoading } = trpc.game.currentIssue.useQuery();

  // Fetch player notes
  const { data: playerNotes, refetch: refetchNotes } = trpc.notes.getByRecipient.useQuery(
    { recipientRole: selectedRole },
    { enabled: !!selectedRole }
  );

  // Mutations
  const resolveIssueMutation = trpc.game.resolveIssue.useMutation({
    onSuccess: (data) => {
      toast.success("Issue resolved! Narrative outcome generated.");
      setShowDecisionDialog(false);
      refetchState();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const sendNoteMutation = trpc.notes.send.useMutation({
    onSuccess: () => {
      toast.success("Note sent successfully!");
      setNoteContent("");
      setRecipientRole("");
    },
    onError: (error) => {
      toast.error(`Error sending note: ${error.message}`);
    },
  });

  const markNoteAsReadMutation = trpc.notes.markAsRead.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Story Synth</CardTitle>
            <CardDescription>A collaborative political role-playing game</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please log in to play.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (configLoading || stateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const handleResolveIssue = (choice: string) => {
    if (!currentIssue || !selectedRole) return;

    resolveIssueMutation.mutate({
      issueId: currentIssue.id,
      playerRole: selectedRole,
      resolutionChoice: choice,
    });
  };

  const handleSendNote = () => {
    if (!noteContent || !recipientRole || !selectedRole) {
      toast.error("Please fill in all fields");
      return;
    }

    sendNoteMutation.mutate({
      senderRole: selectedRole,
      recipientRole: recipientRole,
      content: noteContent,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Story Synth</h1>
          <p className="text-slate-600">Round {gameState?.public_display.round || 1}</p>
        </div>

        {/* Role Selection */}
        {!selectedRole && config && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Role</CardTitle>
              <CardDescription>Choose a role to participate in the game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {config.roles.map((role) => (
                  <Button
                    key={role.id}
                    variant="outline"
                    className="h-auto flex flex-col items-center justify-center p-4"
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="font-bold">{role.name}</div>
                    {role.description && <div className="text-xs text-muted-foreground mt-1">{role.description}</div>}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedRole && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Issue Display */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Issue</CardTitle>
                  <CardDescription>Round {gameState?.public_display.round || 1}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentIssue ? (
                    <>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{currentIssue.title}</h3>
                        <p className="text-slate-600 mb-4">{currentIssue.description}</p>
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                          <span className="font-semibold">Type:</span> {currentIssue.type}
                        </div>
                      </div>

                      <Dialog open={showDecisionDialog} onOpenChange={setShowDecisionDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Make a Decision</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Choose Your Resolution</DialogTitle>
                            <DialogDescription>Select how your role will respond to this issue</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            {["Option A: Negotiate", "Option B: Assert Authority", "Option C: Compromise"].map(
                              (option) => (
                                <Button
                                  key={option}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleResolveIssue(option)}
                                  disabled={resolveIssueMutation.isPending}
                                >
                                  {resolveIssueMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                  {option}
                                </Button>
                              )
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <p className="text-slate-600">No active issue at the moment.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Dashboard & Notes */}
            <div className="space-y-6">
              {/* Player Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Dashboard</CardTitle>
                  <CardDescription>{config?.roles.find((r) => r.id === selectedRole)?.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Game Variables</h4>
                    <div className="space-y-2">
                      {gameState?.player_dashboard.variables &&
                        Object.entries(gameState.player_dashboard.variables).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-slate-600">{key}</span>
                            <span className="font-bold">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Private Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {playerNotes && playerNotes.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {playerNotes.map((note) => (
                        <div key={note.id} className="bg-slate-50 p-2 rounded text-sm">
                          <div className="font-semibold text-xs text-slate-600">From: {note.sender}</div>
                          <div className="mt-1">{note.content}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">No notes yet</p>
                  )}

                  <Dialog open={showNotesPanel} onOpenChange={setShowNotesPanel}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Send className="w-3 h-3 mr-2" />
                        Send Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Private Note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold">To:</label>
                          <select
                            value={recipientRole}
                            onChange={(e) => setRecipientRole(e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                          >
                            <option value="">Select recipient...</option>
                            {config?.roles
                              .filter((r) => r.id !== selectedRole)
                              .map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold">Message:</label>
                          <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Write your message..."
                            className="w-full mt-1 p-2 border rounded h-24"
                          />
                        </div>
                        <Button
                          onClick={handleSendNote}
                          disabled={sendNoteMutation.isPending}
                          className="w-full"
                        >
                          {sendNoteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Send Note
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
