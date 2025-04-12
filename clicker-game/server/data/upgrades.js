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
		costMultiplier: 2.2,
		visibleIf: (state) => state.upgradeLevels?.autoClicker >= 1,
		purchasableIf: (state) => state.upgradeLevels?.autoClicker >= 1,
		effect: (state, startAutoClickers) => {
			state.autoClickerInterval = Math.max(
				state.autoClickerInterval - 25,
				50
			);
			startAutoClickers();
		},
	},
	megaClicker: {
		id: 'megaClicker',
		name: 'Mega Clicker',
		description: 'Adds 50 auto clicks per second',
		baseCost: 1000000,
		costMultiplier: 1.55,
		visibleIf: (state) => {
			return (
				state.upgradeLevels?.autoClicker >= 25 &&
				state.clickCount >= 5000
			);
		},
		purchasableIf: (state) => {
			return (
				state.upgradeLevels?.autoClicker >= 25 &&
				state.clickCount >= 5000
			);
		},
		effect: (state) => {
			state.megaClickers += 1;
		},
	},
	clickMultiplier: {
		id: 'clickMultiplier',
		name: 'Click Multiplier',
		description: 'Multiplies click power by 5',
		baseCost: 500000,
		costMultiplier: 1,
		visibleIf: (state) => {
			return (
				state.upgradeLevels?.clickPower >= 25 &&
				state.clickCount >= 5000 &&
				!state.upgradeLevels?.clickMultiplier
			);
		},
		purchasableIf: (state) => {
			return (
				state.upgradeLevels?.clickPower >= 25 &&
				state.clickCount >= 5000 &&
				!state.upgradeLevels?.clickMultiplier
			);
		},
		effect: (state) => {
			// Add 4 because it brings the multiplier to 5
			state.clickMultiplier += 4;
		},
	},
	precisionTapping: {
		id: 'precisionTapping',
		name: 'Precision Tapping',
		description: 'Increases critical click chance by 1%',
		baseCost: 750,
		costMultiplier: 1.5,
		visibleIf: () => true,
		purchasableIf: () => true,
		effect: (state) => {
			state.criticalChance = Math.min(
				(state.criticalChance || 0) + 0.01,
				0.5 // Max 50% crit chance
			);
		},
	},
	goldenTouch: {
		id: 'goldenTouch',
		name: 'Golden Touch',
		description: 'Increases critical click multiplier by 0.5x',
		baseCost: 1000,
		costMultiplier: 1.6,
		visibleIf: () => true,
		purchasableIf: () => true,
		effect: (state) => {
			state.criticalMultiplier = (state.criticalMultiplier || 2) + 0.5;
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
