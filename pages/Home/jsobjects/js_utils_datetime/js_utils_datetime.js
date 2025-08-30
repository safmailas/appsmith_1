export default {
	getCurrentTimePeriod(timePeriods) {
		const currentTime = new Date();
		const currentDay = currentTime.toLocaleDateString("en-US", { weekday: "long" });
		const currentDate = currentTime.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
		const currentTimeString = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
		const currentPeriod = radioShiftSelected.selectedOptionValue ?? appsmith.store.period;
		
		const dayTimePeriods = timePeriods[currentDay];
		
		for (const timePeriod of dayTimePeriods) {
			const { start, end } = timePeriod;
			if (js_utils_datetime.isTimeInRange(currentTimeString, start, end)) {
				return { date: currentDate, period: currentPeriod, day: currentDay, ...timePeriod };
			}
		}

		return null;
		},


	
	isTimeInRange(time, start, end) {
		const startTime = new Date(`2000-01-01 ${start}`);
		const endTime = new Date(`2000-01-01 ${end}`);
		const currentTime = new Date(`2000-01-01 ${time}`);

		if (endTime < startTime) {
			// Time period crosses midnight, so adjust the end time
			endTime.setDate(endTime.getDate() + 1);
		}

		return currentTime >= startTime && currentTime <= endTime;
	},



	getTimePeriod() { // Get the current time period
		const timePeriods = {  // Example time periods dictionary
			Monday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Tuesday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Wednesday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Thursday: [
				{ start: "08:00", end: "15:59" },
				{ start: "16:00", end: "03:59" }
			],
			Friday: [
				{ start: "08:00", end: "13:59" },
				{ start: "14:00", end: "23:59" }
			],
			Saturday: [
				{ start: "00:00", end: "07:59" },
				{ start: "08:00", end: "13:59" },
				{ start: "14:00", end: "23:59" }
			],
			Sunday: [
				{ start: "00:00", end: "07:59" },
				{ start: "08:00", end: "13:59" },
				{ start: "14:00", end: "23:59" }
			]
		};

		const currentPeriod = js_utils_datetime.getCurrentTimePeriod(timePeriods);

		if (currentPeriod) {
			console.log("Current time falls within the following time period:");
			console.log(currentPeriod);
			return currentPeriod;
		} else {
			console.log("No matching time period found for the current time.");
			return false;
		}
		
		
	},
}