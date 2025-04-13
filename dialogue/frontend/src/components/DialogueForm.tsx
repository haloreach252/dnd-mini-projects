import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDialogueStore } from '@/store/useDialogueStore';
import { fetchDialogue } from '@/lib/api';
import { dialogueSchema, DialogueSchema } from '@/lib/promptSchema';
import { predefinedRoles, predefinedPersonalities } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

export function DialogueForm() {
  const { request, setRequest, setResponse, setLoading } = useDialogueStore();
  const [customRole, setCustomRole] = useState('');
  const [customPersonality, setCustomPersonality] = useState('');

  const form = useForm<DialogueSchema>({
    resolver: zodResolver(dialogueSchema),
    defaultValues: request,
  });

  const onSubmit = async (data: DialogueSchema) => {
    try {
      setLoading(true);
      const result = await fetchDialogue(data);
      setResponse(result);
      setRequest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generate NPC Dialogue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Prompt */}
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" {...form.register('prompt')} />
          </div>

          {/* NPC Role */}
          <div>
            <Label htmlFor="npcRole">NPC Role</Label>
            <Select
              onValueChange={(val) => {
                setCustomRole('');
                form.setValue('npcRole', val);
              }}
              defaultValue={form.getValues('npcRole')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select or type a role" />
              </SelectTrigger>
              <SelectContent>
                {predefinedRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="mt-2"
              placeholder="Custom role"
              value={customRole}
              onChange={(e) => {
                setCustomRole(e.target.value);
                form.setValue('npcRole', e.target.value);
              }}
            />
          </div>

          {/* Personality */}
          <div>
            <Label htmlFor="personality">Personality</Label>
            <Select
              onValueChange={(val) => {
                setCustomPersonality('');
                form.setValue('personality', val);
              }}
              defaultValue={form.getValues('personality')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select or type a personality" />
              </SelectTrigger>
              <SelectContent>
                {predefinedPersonalities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="mt-2"
              placeholder="Custom personality"
              value={customPersonality}
              onChange={(e) => {
                setCustomPersonality(e.target.value);
                form.setValue('personality', e.target.value);
              }}
            />
          </div>

          {/* Scene Context */}
          <div>
            <Label htmlFor="sceneContext">Scene Context</Label>
            <Input id="sceneContext" {...form.register('sceneContext')} />
          </div>

          {/* Expected Length */}
          <div>
            <Label htmlFor="expectedLength">Expected Length (1–3)</Label>
            <Input
              id="expectedLength"
              type="number"
              min={1}
              max={3}
              {...form.register('expectedLength', { valueAsNumber: true })}
            />
          </div>

            {/* Line Length Style */}
            <div>
            <Label htmlFor="lineStyle">Line Style</Label>
            <Select
                onValueChange={(val) => form.setValue('lineStyle', val as any)}
                defaultValue={form.getValues('lineStyle') || 'normal'}
            >
                <SelectTrigger>
                <SelectValue placeholder="Select line style" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* Model Selector */}
            <div>
            <Label htmlFor="model">Model</Label>
            <Select
                onValueChange={(val) => form.setValue('model', val as any)}
                defaultValue={form.getValues('model') || 'deepseek/deepseek-chat-v3-0324:free'}
            >
                <SelectTrigger>
                <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="openrouter/optimus-alpha">Optimus Alpha</SelectItem>
                <SelectItem value="deepseek/deepseek-chat-v3-0324:free">Deepseek</SelectItem>
                <SelectItem value="deepseek/deepseek-r1:free">Deepseek Reasoning</SelectItem>
                </SelectContent>
            </Select>
            </div>

          <Button type="submit" className="w-full">
            Generate Dialogue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
