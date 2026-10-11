import { env } from '$env/dynamic/private';

const responseHeaders = {
	'content-type': 'application/json; charset=utf-8',
	'cache-control': 'no-store'
};

function json(body, status = 200) {
	return new Response(JSON.stringify(body), { status, headers: responseHeaders });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, platform }) {
	const contentLength = Number(request.headers.get('content-length') ?? 0);
	if (contentLength > 16000) return json({ message: 'Message is too large.' }, 413);

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ message: 'Request body must be valid JSON.' }, 400);
	}

	if (typeof body?.website === 'string' && body.website.trim()) return json({ ok: true });

	const values = {
		name: typeof body?.name === 'string' ? body.name.trim() : '',
		email: typeof body?.email === 'string' ? body.email.trim() : '',
		subject: typeof body?.subject === 'string' ? body.subject.trim() : '',
		message: typeof body?.message === 'string' ? body.message.trim() : ''
	};
	const errors = {};

	if (!values.name) errors.name = ['Name is required.'];
	else if (values.name.length > 120) errors.name = ['Name must be 120 characters or fewer.'];

	if (!values.email) errors.email = ['Email is required.'];
	else if (values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = ['Enter a valid email address.'];
	}

	if (!values.subject) errors.subject = ['Subject is required.'];
	else if (values.subject.length > 200 || /[\r\n]/.test(values.subject)) {
		errors.subject = ['Subject must be 200 characters or fewer and contain no line breaks.'];
	}

	if (!values.message) errors.message = ['Message is required.'];
	else if (values.message.length > 10000) errors.message = ['Message must be 10,000 characters or fewer.'];

	if (Object.keys(errors).length) return json({ errors }, 400);

	const settings = { ...env, ...(platform?.env ?? {}) };
	const apiKey = settings.RESEND_API_KEY;
	const from = settings.CONTACT_EMAIL_FROM;
	const to = settings.CONTACT_EMAIL_TO;
	if (!apiKey || !from || !to) {
		return json({ message: 'Contact email delivery is not configured.' }, 503);
	}

	let providerResponse;
	try {
		providerResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				authorization: `Bearer ${apiKey}`,
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				from,
				to: [to],
				reply_to: values.email,
				subject: `Website contact: ${values.subject}`,
				text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
			})
		});
	} catch {
		return json({ message: 'The email service could not be reached.' }, 502);
	}

	if (!providerResponse.ok) return json({ message: 'The email service could not send this message.' }, 502);
	return json({ ok: true });
}
