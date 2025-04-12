const storyRegistry = {
	intro1: {
		id: 'intro1',
		text: 'You feel the itch to begin... to *click*. Why? You don’t question it.',
		requirement: (state) => state.clickCount >= 10,
	},
	intro2: {
		id: 'intro2',
		text: 'You mutter a small spell under your breath. The room shifts. This is working.',
		requirement: (state) => state.clickCount >= 50,
	},
	voice1: {
		id: 'voice1',
		text: "A whisper: _'Yes... feed me.'_\nYou look around. You're alone. Aren’t you?",
		requirement: (state) => state.clickCount >= 100,
	},
	awakening1: {
		id: 'awakening1',
		text: 'The clicks aren’t just sounds. They’re incantations. You feel them taking hold.',
		requirement: (state) => state.clickCount >= 250,
	},
	influence1: {
		id: 'influence1',
		text: 'Your mana flows stronger. People nearby obey your simplest requests without protest.',
		requirement: (state) => state.goldEarned >= 500,
	},
	voice2: {
		id: 'voice2',
		text: "_'Build your tower. It will anchor us.'_ says the voice, now clearer.",
		requirement: (state) => state.clickCount >= 500,
	},
	vision1: {
		id: 'vision1',
		text: 'You see it — a portal, barely formed, flickering in the air behind your thoughts.',
		requirement: (state) => state.goldEarned >= 1000,
	},
	upgradeWhisper: {
		id: 'upgradeWhisper',
		text: 'Your tools hum. Your spells resonate. Something *more* stirs when you enhance your power.',
		requirement: (state) => {
			let total = 0;
			for (const id in state.upgradeLevels)
				total += state.upgradeLevels[id];
			return total >= 5;
		},
	},
	obsession1: {
		id: 'obsession1',
		text: 'You haven’t slept. You barely eat. But you’ve never felt *closer* to the truth.',
		requirement: (state) => state.clickCount >= 1000,
	},
	act1_finale: {
		id: 'act1_finale',
		text: 'You gather your first followers. The world doesn’t yet notice — but it will.',
		requirement: (state) => state.goldEarned >= 5000,
	},
};

function checkStoryTriggers(state) {
	if (!state.unlockedStory) state.unlockedStory = [];

	const newMessages = [];

	for (const [id, story] of Object.entries(storyRegistry)) {
		if (state.unlockedStory.includes(id)) continue;
		if (story.requirement(state)) {
			state.unlockedStory.push(id);
			newMessages.push({ id, text: story.text });
		}
	}

	return newMessages;
}

module.exports = {
	checkStoryTriggers,
};
