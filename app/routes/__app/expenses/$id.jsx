import { redirect } from "@remix-run/node"
import { useNavigate } from "@remix-run/react"
import { ExpenseForm } from "~/components/expenses"
import { Modal } from "~/components/util"
import { deleteExpense, updateExpense } from "~/data/expenses.server"
import { validateExpenseInput } from "~/data/validation.server"

// data in meta are loader data
// parentsData => object containing all the data from all parent routes
export const meta = ({ params, location, data, parentsData }) => {
  const expense = parentsData['routes/__app/expenses'].find(expense => expense.id === params.id)
  return {
    title: `Remix ${expense.title}`,
    description: 'Update expense.'
  }
}

const UpdatedExpensesPage = () => {
  const navigate = useNavigate()

  const closeHandler = () => {
    navigate('..')
  }
  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  )
}

export async function action({ params, request }) {
  const expenseId = params.id

  if (request.method === 'PATCH') {
    const formData = await request.formData()
    const updatedExpensesData = Object.fromEntries(formData)

    try {
      validateExpenseInput(updatedExpensesData)
    } catch (error) {
      return error
    }

    await updateExpense(expenseId, updatedExpensesData)

    return redirect('/expenses')
  }

  if (request.method === 'DELETE') {
    await deleteExpense(expenseId)
    return { deletedId: expenseId }
  }
}

export default UpdatedExpensesPage