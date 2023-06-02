export const getFormattedAge = (_months: number) => {
	const years = Math.floor(_months / 12);
	const months = _months - years * 12;

	const age =
		(years > 0 ? `${years} ano${years > 1 ? "s" : ""}${months > 0 ? " e " : ""}` : "") +
		(months > 0 ? `${months} ${months > 1 ? "meses" : "mês"}` : "");

	return age;
};
