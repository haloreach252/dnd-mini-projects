import { create } from 'zustand';

export interface DialogueRequest {
    prompt: string;
    npcRole: string;
    personality: string;
    sceneContext?: string;
    expectedLength?: number;
    lineStyle?: "short" | "normal" | "long";
    model?: "openrouter/optimus-alpha" | "deepseek/deepseek-chat-v3-0324:free" | "deepseek/deepseek-r1:free";
}

export interface DialogueResponse {
    lines: string[];
    tags: string[];
}

interface DialogueStore {
    request: DialogueRequest;
    response: DialogueResponse | null;
    loading: boolean;
    setRequest: (req: Partial<DialogueRequest>) => void;
    setResponse: (res: DialogueResponse | null) => void;
    setLoading: (val: boolean) => void;
    reset: () => void;
}

export const useDialogueStore = create<DialogueStore>((set) => ({
    request: {
        prompt: '',
        npcRole: '',
        personality: '',
        sceneContext: '',
        expectedLength: 2,
        lineStyle: 'normal',
        model: "deepseek/deepseek-chat-v3-0324:free",
    },
    response: null,
    loading: false,

    setRequest: (req) => set((state) => ({
        request: { ...state.request, ...req }
    })),
    setResponse: (res) => set({ response: res }),
    setLoading: (val) => set({ loading: val }),
    reset: () =>
        set({
            request: {
                prompt: '',
                npcRole: '',
                personality: '',
                sceneContext: '',
                expectedLength: 2,
                lineStyle: 'normal',
                model: "deepseek/deepseek-chat-v3-0324:free",
            },
            response: null,
            loading: false,
        }),
}));