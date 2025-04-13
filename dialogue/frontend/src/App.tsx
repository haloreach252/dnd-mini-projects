import { DialogueForm } from './components/DialogueForm';
import { DialogueOutput } from './components/DialogueOutput';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🧙 Dialogue Generator</h1>
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <div className="flex-1">
          <DialogueForm />
        </div>
        <div className="flex-1">
          <DialogueOutput />
        </div>
      </div>
    </div>
  );
}
