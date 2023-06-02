import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ cookies, request }) => {
	cookies.delete("accessToken", { path: "/" });

	if (request.headers.get("accept") === "application/json") {
		return json({ success: true });
	}

	throw redirect(303, "/");
};
