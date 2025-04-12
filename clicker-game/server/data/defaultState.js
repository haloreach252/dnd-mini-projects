const defaultState = {
	clickCount: 0,
	gold: 0,
	clickPower: 1,
	autoClickers: 0,
	clickPowerLevel: 0,
	autoClickerLevel: 0,
	upgradeLevels: {}, // { clickPower: 1, autoClicker: 3, ... }
	autoClickerInterval: 1000,
	cheatsUsed: false,
};

module.exports = {
	defaultState,
};
