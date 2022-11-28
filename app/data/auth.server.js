import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { compare, hash } from "bcryptjs"
import { prisma } from "./database.server.js"

const SESSION_SECRET = process.env.SESSION_SECRET

const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        secrets: [SESSION_SECRET],
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true
    }
})

async function createUserSession(userId, redirectPath) {
    const session = await sessionStorage.getSession()
    session.set('userId', userId)

    return redirect(redirectPath, {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session)
        }
    })
}



export async function getUserFromSession(request) {
    const session = await sessionStorage.getSession(request.headers.get('Cookie'))

    const userId = session.get('userId')

    if (!userId) {
        return null
    }

    return userId
}

export async function requireUserSession(request) {
    const userId = await getUserFromSession(request)

    if (!userId) {
        throw redirect('/auth?mode=login')
    }

    return userId
}

export async function signup({ email, password }) {
    const getUser = await prisma.user.findFirst({ where: { email: email } })

    if (getUser) {
        const error = new Error('A user with the provided email address exists already.')
        error.status = 422
        throw error

    }
    const passwordHashed = await hash(password, 12)
    const newUser = await prisma.user.create(
        {
            data: {
                email: email,
                password: passwordHashed
            }
        }
    )
    return createUserSession(newUser.id, '/expenses')
}

export async function login({ email, password }) {
    const currentUser = await prisma.user.findFirst({ where: { email } })
    if (!currentUser) {
        const error = new Error("You've provided wrong credentials. Try again.")
        error.status = 401
        throw error
    }
    const passwordCorrect = await compare(password, currentUser.password)
    if (!passwordCorrect) {
        const error = new Error("You've provided wrong credentials. Try again.")
        error.status = 401
        throw error
    }

    return createUserSession(currentUser.id, '/expenses')
}

export async function destroyUserSession(request) {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    )

    return redirect('/', {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session)
        }
    })
}