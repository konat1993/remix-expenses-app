import { requireUserSession } from "~/data/auth.server"
import { getExpenses } from "~/data/expenses.server"

export async function loader({ request }) {
    const userId = await requireUserSession(request)
    const expensesList = await getExpenses(userId)
    return expensesList
}