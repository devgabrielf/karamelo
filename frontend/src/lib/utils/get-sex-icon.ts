import { Sex } from "$enums";
import male from "$assets/male.svg";
import female from "$assets/female.svg";

export const getSexIcon = (sex: Sex) => {
	if (sex === Sex.MALE) {
		return male;
	}

	return female;
};
