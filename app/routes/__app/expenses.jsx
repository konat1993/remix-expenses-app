import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { ExpensesList } from '~/components/expenses'
import { FaPlus, FaDownload } from 'react-icons/fa'
import { getExpenses } from '~/data/expenses.server'
import { requireUserSession } from '~/data/auth.server'
import { json } from '@remix-run/node'

const ExpensesLayout = () => {
    const expensesList = useLoaderData()

    const hasExpenses = expensesList && expensesList.length > 0
    return (
        <>
            <Outlet />
            <main>
                <section id="expenses-actions">
                    <Link to='add'>
                        <FaPlus />
                        <span>Add expense</span>
                    </Link>
                    <a href='/expenses/raw'>
                        <FaDownload />
                        <span>Load Raw Data</span>
                    </a>
                </section>
                {
                    hasExpenses ? (
                        <ExpensesList expenses={expensesList} />
                    ) : (
                        <section id='no-expenses'>
                            <h1>
                                No expenses found.
                            </h1>
                            <p>
                                Start
                                <Link to='add'> adding some </Link>
                                today.
                            </p>
                        </section>
                    )
                }
            </main>
        </>
    )
}

export async function loader({ request }) {
    const userId = await requireUserSession(request)

    const expensesList = await getExpenses(userId)
    // return expensesList
    return json(expensesList, {
        headers: {
            'Cache-Control': 'max-age=3'
        }
    })
}

export function headers({
    actionHeaders,
    loaderHeaders,
    parentHeaders
  }) {
    return {
      'Cache-Control': loaderHeaders.get('Cache-Control')
    }
  }

export default ExpensesLayout