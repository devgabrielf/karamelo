const errorMessages = {
	CREDENTIALS_INCORRECT: "E-mail e/ou senha incorretos.",
	CREDENTIALS_TAKEN: "Já existe uma conta com esse e-mail.",
};

export const getErrorMessage = (message?: keyof typeof errorMessages) => {
	if (message && Object.keys(errorMessages).includes(message)) {
		return errorMessages[message];
	}

	return "Ocorreu um erro insesperado.";
};
