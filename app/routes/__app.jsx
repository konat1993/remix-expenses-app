import { Outlet } from '@remix-run/react'
import { ExpensesHeader } from '~/components/navigation'
import expensesStyles from '~/styles/expenses.css'

const ExpensesAppLayout = () => {
    return (
        <>
            <ExpensesHeader />
            <Outlet />
        </>
    )
}

export default ExpensesAppLayout

export function links() {
    return [
        { rel: 'stylesheet', href: expensesStyles }
    ]
}