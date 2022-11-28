import { json } from "@remix-run/node"
import { useCatch, useLoaderData } from "@remix-run/react"
import { Link } from "react-router-dom"
import { Chart, ExpenseStatistics } from "~/components/expenses"
import { Error } from "~/components/util"
import { requireUserSession } from "~/data/auth.server"
import { getExpenses } from "~/data/expenses.server"
import expenseStyles from '~/styles/expenses.css'

const ExpensesAnalysisPage = () => {
  const expensesList = useLoaderData()
  return (
    <main>
      <Chart expenses={expensesList} />
      <ExpenseStatistics expenses={expensesList} />
      {/* {
        expensesList && expensesList.length > 0 ? (
          <>
            <Chart expenses={expensesList} />
            <ExpenseStatistics expenses={expensesList} />
          </>
        ) : (
          <section id="no-expenses">
            <h1>No expenses yet.</h1>
            <p>You can <Link to='/expenses/add'>add</Link> your first expense.</p>
          </section>
        )
      } */}
    </main>
  )
}

export function links() {
  return [{ rel: 'stylesheet', href: expenseStyles }]
}

export function CatchBoundary() {
  const caughtResponse = useCatch()
  return <main>
    <Error title={caughtResponse.statusText}>
      <p>{caughtResponse.data?.message || 'Something went wrong. Could not load expenses.'}</p>
      <p>If you haven't added expenses yet, you can to it <Link to='/expenses/add'>HERE.</Link></p>
    </Error>
  </main>
}

export async function loader({ request }) {
  const userId = await requireUserSession(request)

  const expensesList = await getExpenses(userId)
  if (!expensesList || expensesList.length === 0) {
    throw json(
      { message: 'Could not load expenses for the requested analysis.' },
      { status: 404, statusText: 'Expenses not found.' }
    )
  }
  return expensesList
}
export default ExpensesAnalysisPage