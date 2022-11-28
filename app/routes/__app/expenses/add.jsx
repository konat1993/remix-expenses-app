import { redirect } from "@remix-run/node"
import { useNavigate } from "@remix-run/react"
import { ExpenseForm } from "~/components/expenses"
import { Modal } from "~/components/util"
import { requireUserSession } from "~/data/auth.server"
import { addExpense } from "~/data/expenses.server"
import { validateExpenseInput } from "~/data/validation.server"

const AddExpenses = () => {
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

export async function action({ request }) {
  const userId = await requireUserSession(request)
  const formData = await request.formData()
  const expenseData = Object.fromEntries(formData)

  try {
    validateExpenseInput(expenseData)
  } catch (error) {
    return error
  }

  await addExpense(expenseData, userId)
  return redirect('/expenses')
}
export default AddExpenses