export const formatHour = (_date: Date | string) => {
	let date: Date;

	if (typeof _date === "string") {
		date = new Date(_date);
	} else {
		date = _date;
	}

	const hours = date.getHours();
	let minutes = String(date.getMinutes());

	if (Number(minutes) < 10) {
		minutes = "0" + minutes;
	}

	const formattedTime = hours + "h" + minutes;

	return formattedTime;
};

export const getByDay = <T extends Record<string, unknown> & { createdAt: string }>(items: T[]) => {
	type ByDayItem = {
		date: string;
		items: T[];
	};

	const byDay: ByDayItem[] = [];

	let currentDate: string | null = null;

	items.forEach(item => {
		const itemDate = new Date(item.createdAt).toLocaleDateString();

		if (itemDate !== currentDate) {
			const newDay = {
				date: itemDate,
				items: [],
			};

			byDay.push(newDay as ByDayItem);

			currentDate = itemDate;
		}

		const currentDay = byDay[byDay.length - 1];
		currentDay.items.push(item);
	});

	return byDay;
};
