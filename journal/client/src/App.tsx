import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EntryFormModal, EntryFormData } from '@/components/EntryForm';
import { EntryList } from '@/components/EntryList';
import '@/index.css';

// API base URL (update if needed)
const API_URL = 'http://localhost:3001';

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  visibility: 'PLAYER' | 'GM';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

const queryClient = new QueryClient();

function AppContent() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch entries
  const { data: entries = [], isLoading, error } = useQuery<JournalEntry[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/entries`);
      if (!res.ok) throw new Error('Failed to fetch entries');
      return res.json();
    },
  });

  // Create entry mutation
  const createEntry = useMutation({
    mutationFn: async (data: EntryFormData) => {
      const res = await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tags: data.tags.split(',').map(t => t.trim()).filter(Boolean) }),
      });
      if (!res.ok) throw new Error('Failed to create entry');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      setOpen(false);
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 dark">
      <h1 className="text-4xl font-bold mb-8">Lore & Journal Entries</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8">New Entry</Button>
        </DialogTrigger>
        <EntryFormModal
          open={open}
          setOpen={setOpen}
          onSubmit={data => createEntry.mutate(data)}
          isSubmitting={createEntry.isPending}
          error={createEntry.isError ? (createEntry.error as Error).message : null}
        />
      </Dialog>
      <EntryList entries={entries} isLoading={isLoading} error={error as Error | null} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
