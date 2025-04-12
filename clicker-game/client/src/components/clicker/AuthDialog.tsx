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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === 'login' ? 'Login' : 'Register'}
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Input
						placeholder="Username"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{authError && (
						<p className="text-sm text-red-500 text-center">
							{authError}
						</p>
					)}
					<Button
						onClick={submit}
						disabled={!input.trim() || !password.trim()}
					>
						{mode === 'login' ? 'Login' : 'Register'}
					</Button>
					<button
						onClick={() =>
							setMode(mode === 'login' ? 'register' : 'login')
						}
						className="text-xs text-muted-foreground hover:underline"
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
