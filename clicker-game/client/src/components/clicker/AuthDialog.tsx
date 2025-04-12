// components/AuthDialog.tsx
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AuthDialog({
	isOpen,
	mode,
	setMode,
	input,
	setInput,
	password,
	setPassword,
	authError,
	submit,
}) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="bg-slate-900 border-slate-700 text-slate-200 shadow-xl">
				<DialogHeader>
					<DialogTitle className="text-slate-200 text-xl">
						{mode === 'login' ? 'Login' : 'Register'}
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Input
						placeholder="Username"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
					/>
					{authError && (
						<p className="text-sm text-red-400 text-center">
							{authError}
						</p>
					)}
					<Button
						onClick={submit}
						disabled={!input.trim() || !password.trim()}
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						{mode === 'login' ? 'Login' : 'Register'}
					</Button>
					<button
						onClick={() =>
							setMode(mode === 'login' ? 'register' : 'login')
						}
						className="text-xs text-blue-400 hover:underline"
					>
						{mode === 'login'
							? "Don't have an account? Register"
							: 'Already have an account? Login'}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
