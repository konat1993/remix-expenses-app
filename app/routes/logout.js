import { json } from "@remix-run/node"
import { destroyUserSession } from "~/data/auth.server"

export async function action({ request }) {
    if (request.method !== 'POST') {
        // throw new Error('Invalid request!')
        throw json({ message: 'Invalid request method' }, { status: 400 })
    }
    return await destroyUserSession(request)
}