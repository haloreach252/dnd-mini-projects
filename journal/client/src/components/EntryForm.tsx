import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type EntryFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: EntryFormData) => void;
  isSubmitting: boolean;
  error: string | null;
};

export type EntryFormData = {
  title: string;
  content: string;
  tags: string;
  visibility: 'PLAYER' | 'GM';
  createdBy: string;
};

const defaultForm: EntryFormData = {
  title: '',
  content: '',
  tags: '',
  visibility: 'PLAYER',
  createdBy: '',
};

export function EntryFormModal({ open, setOpen, onSubmit, isSubmitting, error }: EntryFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EntryFormData>({ defaultValues: defaultForm });

  const handleClose = () => {
    setOpen(false);
    reset(defaultForm);
  };

  return (
    <DialogContent className="bg-card">
      <DialogHeader>
        <DialogTitle>New Journal Entry</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit((data) => { onSubmit(data); reset(defaultForm); })}
        className="flex flex-col gap-4"
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title', { required: 'Title is required' })} autoFocus />
          {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" {...register('content', { required: 'Content is required' })} rows={4} />
          {errors.content && <div className="text-red-500 text-sm">{errors.content.message}</div>}
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" {...register('tags')} placeholder="e.g. adventure, ruins" />
        </div>
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select defaultValue="PLAYER" onValueChange={val => setValue('visibility', val as 'PLAYER' | 'GM')}>
            <SelectTrigger id="visibility">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PLAYER">Player</SelectItem>
              <SelectItem value="GM">GM Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="createdBy">Created By (optional)</Label>
          <Input id="createdBy" {...register('createdBy')} />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Entry'}</Button>
      </form>
    </DialogContent>
  );
}
