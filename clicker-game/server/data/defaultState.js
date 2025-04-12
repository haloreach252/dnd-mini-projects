const defaultState = {
	clickCount: 0,
	gold: 0,
	clickPower: 1,
	autoClickers: 0,
	megaClickers: 0,
	clickPowerLevel: 0,
	autoClickerLevel: 0,
	megaClickerLevel: 0,
	upgradeLevels: {}, // { clickPower: 1, autoClicker: 3, ... }
	autoClickerInterval: 1000,
	cheatsUsed: false,
	completedMilestones: [],
	goldEarned: 0,
	goldMultiplier: 1,
	clickMultiplier: 1,
	megaClickerInterval: 1000,
};

module.exports = {
	defaultState,
};
