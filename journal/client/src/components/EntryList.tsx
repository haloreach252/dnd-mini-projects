import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

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

type EntryListProps = {
  entries: JournalEntry[];
  isLoading: boolean;
  error: Error | null;
};

export function EntryList({ entries, isLoading, error }: EntryListProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}
      {entries.map(entry => (
        <Card key={entry.id} className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>{entry.title}</CardTitle>
            <div className="flex gap-2 text-xs">
              {entry.tags.map(tag => (
                <span key={tag} className="bg-secondary px-2 py-0.5 rounded">{tag}</span>
              ))}
              <span className="ml-auto font-mono">{entry.visibility}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line mb-2">{entry.content}</p>
            <div className="text-xs opacity-70">
              {entry.createdBy && <span>By: {entry.createdBy} | </span>}
              Created: {format(new Date(entry.createdAt), 'yyyy-MM-dd HH:mm')}
            </div>
          </CardContent>
        </Card>
      ))}
      {!isLoading && entries.length === 0 && (
        <Card className="p-4 text-center">No entries found.</Card>
      )}
    </div>
  );
}
