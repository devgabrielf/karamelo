import avatarPlaceholder from "$assets/avatar_placeholder.png";

export const getAvatar = (url: string | undefined) => url || avatarPlaceholder;
