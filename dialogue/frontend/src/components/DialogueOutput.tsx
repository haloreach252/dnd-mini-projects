import { useDialogueStore } from '@/store/useDialogueStore';
import { useCallback, useState } from 'react';
import { fetchDialogue } from '@/lib/api';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

export function DialogueOutput() {
  const {
    request,
    response,
    loading,
    setResponse,
    setLoading,
  } = useDialogueStore();
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const regenerate = useCallback(async () => {
    try {
      setLoading(true);
      const newResponse = await fetchDialogue(request);
      setResponse(newResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [request, setLoading, setResponse]);

  const copyToClipboard = async () => {
    const text = showRaw
      ? JSON.stringify(response, null, 2)
      : (response?.lines || []).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Dialogue Output</CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="raw-toggle">Raw JSON</Label>
          <Switch
            id="raw-toggle"
            checked={showRaw}
            onCheckedChange={(val) => setShowRaw(val)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Generating dialogue...</p>
        ) : response ? (
          showRaw ? (
            <Textarea readOnly value={JSON.stringify(response, null, 2)} />
          ) : (
            <div className="space-y-3">
              <div>
                <Label>Lines</Label>
                <ul className="list-disc pl-5">
                  {response.lines.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {response.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-muted px-2 py-1 rounded text-sm text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <p className="text-muted-foreground">No dialogue generated yet.</p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={regenerate} disabled={loading}>
            Regenerate
          </Button>
          <Button onClick={copyToClipboard} disabled={!response}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
