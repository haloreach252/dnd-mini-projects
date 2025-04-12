const { defaultState } = require('./defaultState');

const cheatRegistry = {
	moneyCheat: {
		id: 'moneyCheat',
		name: 'Money',
		description: 'Gives you 1,000,000 gold',
		effect: (state) => {
			state.gold += 1000000;
		},
	},
	resetCheat: {
		id: 'resetCheat',
		name: 'Reset Game',
		description: 'Resets the game back to the start',
		effect: (state, startAutoClickers) => {
			//state = defaultState;
			Object.assign(state, JSON.parse(JSON.stringify(defaultState)));
			startAutoClickers();
		},
	},
};

function useCheat(cheatId, state, startAutoClickers) {
	const cheat = cheatRegistry[cheatId];

	if (!cheat) return null;

	cheat.effect(state, startAutoClickers);
	state.cheatsUsed = true;

	return cheat.name;
}

function getCheats() {
	return Object.values(cheatRegistry);
}

module.exports = {
	getCheats,
	useCheat,
};
