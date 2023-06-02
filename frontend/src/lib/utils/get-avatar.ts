import avatarPlaceholder from "../../assets/avatar_placeholder.png"

export const getAvatar = (url: string | undefined) => {
	if (url) {
		return url;
	}
	return avatarPlaceholder;
};
