const milestoneRegistry = {
	clicks100: {
		id: 'clicks100',
		name: '100 Click Club',
		description: 'Reached 100 total clicks',
		requirement: (state) => state.clickCount >= 100,
		reward: (state) => {
			state.clickPower += 1;
			return 'Permanent +1 Click Power';
		},
		icon: '👆',
	},
	clicks1000: {
		id: 'clicks1000',
		name: 'Click Master',
		description: 'Reached 1,000 total clicks',
		requirement: (state) => state.clickCount >= 1000,
		reward: (state) => {
			state.clickPower += 3;
			return 'Permanent +3 Click Power';
		},
		icon: '✌️',
	},
	clicks10000: {
		id: 'clicks10000',
		name: 'Click Legend',
		description: 'Reached 10,000 total clicks',
		requirement: (state) => state.clickCount >= 10000,
		reward: (state) => {
			state.clickPower += 10;
			return 'Permanent +10 Click Power';
		},
		icon: '🖐️',
	},

	// Gold-based milestones
	gold500: {
		id: 'gold500',
		name: 'Gold Collector',
		description: 'Accumulated 500 gold',
		requirement: (state) => state.goldEarned >= 500,
		reward: (state) => {
			state.goldMultiplier = (state.goldMultiplier || 1) * 1.1;
			return '10% more gold from all sources';
		},
		icon: '💰',
	},
	gold5000: {
		id: 'gold5000',
		name: 'Treasure Hunter',
		description: 'Accumulated 5,000 gold',
		requirement: (state) => state.goldEarned >= 5000,
		reward: (state) => {
			state.goldMultiplier = (state.goldMultiplier || 1) * 1.25;
			return '25% more gold from all sources';
		},
		icon: '💎',
	},

	// Upgrade-based milestones
	upgrades5: {
		id: 'upgrades5',
		name: 'Upgrader',
		description: 'Purchased 5 total upgrades',
		requirement: (state) => {
			// Count total upgrades purchased
			let total = 0;
			for (const id in state.upgradeLevels) {
				total += state.upgradeLevels[id];
			}
			return total >= 5;
		},
		reward: (state) => {
			// Unlock a special upgrade or provide a bonus
			state.autoClickerInterval = Math.max(
				state.autoClickerInterval * 0.9,
				100
			);
			return '10% faster auto-clickers';
		},
		icon: '🔧',
	},
};

// Check for newly completed milestones
function checkMilestones(state) {
	// Initialize milestones array if it doesn't exist
	if (!state.completedMilestones) {
		state.completedMilestones = [];
	}

	// Track gold earned (total, not current)
	if (!state.goldEarned) {
		state.goldEarned = state.gold;
	} else {
		// Make sure to call this when gold changes
		state.goldEarned = Math.max(state.goldEarned, state.gold);
	}

	// Check each milestone
	const newlyCompleted = [];

	for (const [id, milestone] of Object.entries(milestoneRegistry)) {
		// Skip already completed milestones
		if (state.completedMilestones.includes(id)) continue;

		// Check if milestone is completed
		if (milestone.requirement(state)) {
			// Apply reward
			const rewardText = milestone.reward(state);

			// Mark as completed
			state.completedMilestones.push(id);

			// Add to newly completed list
			newlyCompleted.push({
				id,
				name: milestone.name,
				description: milestone.description,
				reward: rewardText,
				icon: milestone.icon,
			});
		}
	}

	return newlyCompleted;
}

// Get all milestones with completion status
function getAllMilestones(state) {
	return Object.values(milestoneRegistry).map((milestone) => {
		return {
			id: milestone.id,
			name: milestone.name,
			description: milestone.description,
			icon: milestone.icon,
			completed:
				state.completedMilestones?.includes(milestone.id) || false,
		};
	});
}

module.exports = {
	checkMilestones,
	getAllMilestones,
};
