import axios from 'axios';
import type { DialogueRequest, DialogueResponse } from '@/store/useDialogueStore';

export async function fetchDialogue(req: DialogueRequest): Promise<DialogueResponse> {
  const response = await axios.post('http://localhost:3001/generate', req);
  return response.data;
}
