const upgradeRegistry = {
	clickPower: {
		id: 'clickPower',
		name: 'Click Power',
		description: 'Increase gold per click by +1',
		baseCost: 25,
		costMultiplier: 1.4,
		visibleIf: () => true,
		purchasableIf: () => true,
		effect: (state) => {
			state.clickPower += 1;
		},
	},
	autoClicker: {
		id: 'autoClicker',
		name: 'Auto Clicker',
		description: 'Adds an auto click every second',
		baseCost: 200,
		costMultiplier: 1.25,
		visibleIf: () => true,
		purchasableIf: () => true,
		effect: (state) => {
			state.autoClickers += 1;
		},
	},
	autoClickerSpeed: {
		id: 'autoClickerSpeed',
		name: 'Auto Clicker Speed',
		description: 'Makes auto clickers activate faster',
		baseCost: 1000,
		costMultiplier: 2.75,
		visibleIf: (state) => state.upgradeLevels?.autoClicker >= 1,
		purchasableIf: (state) => state.upgradeLevels?.autoClicker >= 1,
		effect: (state, startAutoClickers) => {
			state.autoClickerInterval = Math.max(
				state.autoClickerInterval - 100,
				100
			);
			startAutoClickers();
		},
	},
};

function getVisibleUpgrades(state) {
	return Object.values(upgradeRegistry)
		.filter((u) => !u.visibleIf || u.visibleIf(state))
		.map((u) => {
			const level = state.upgradeLevels?.[u.id] || 0;
			const cost = Math.floor(
				u.baseCost * Math.pow(u.costMultiplier, level)
			);
			const canBuy = !u.purchasableIf || u.purchasableIf(state);
			return {
				id: u.id,
				name: u.name,
				description: u.description,
				cost,
				level,
				canBuy,
			};
		});
}

function purchaseUpgrade(upgradeId, state, startAutoClickers) {
	const upgrade = upgradeRegistry[upgradeId];

	if (!upgrade) return null;

	const level = state.upgradeLevels?.[upgradeId] || 0;
	const cost = Math.floor(
		upgrade.baseCost * Math.pow(upgrade.costMultiplier, level)
	);

	if (state.gold < cost) return null;
	if (upgrade.purchasableIf && !upgrade.purchasableIf(state)) return null;

	state.gold -= cost;
	upgrade.effect(state, startAutoClickers);
	state.upgradeLevels = {
		...state.upgradeLevels,
		[upgradeId]: level + 1,
	};

	return upgrade.name;
}

module.exports = {
	getVisibleUpgrades,
	purchaseUpgrade,
};
