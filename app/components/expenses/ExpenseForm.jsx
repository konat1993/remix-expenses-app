import { Form, Link, useActionData, useLoaderData, useMatches, useParams, useTransition } from "@remix-run/react"

function ExpenseForm() {
  const validationErrors = useActionData()
  const navigation = useTransition()
  const params = useParams()
  const today = new Date().toISOString().slice(0, 10) // yields something like 2023-09-10
  // const expenseData = useLoaderData()
  const matches = useMatches()
  const allExpensesData = matches
    .find(match => match.pathname === '/expenses')
    .data
  const expenseData = allExpensesData
    .find(expense => expense.id === params.id)
  // If we need to implement some logic during submission we can use onSubmit event and use useSubmit hook
  // to trigger remix form submission -> so that we could also make our request and validate fields on the server side
  // But if we don't need to use additional logic here we can simply use Form remix component
  // const submit = useSubmit()
  // const submitHandler = (e) => {
  //   e.preventDefault()
  // ...

  // submit(event.target, {
  // method: 'post'
  // })
  // }

  // cool way to handle it without mapping through data and check id specific id exists
  if (params.id && !expenseData) {
    return <p>Invalid expense id.</p>
    // throw new Response() // this solution is not good because remix will treat it as regular error.
  }

  const defaultValues = expenseData ? {
    title: expenseData.title,
    amount: expenseData.amount,
    date: expenseData.date
  } : {
    title: '',
    amount: '',
    date: ''
  }
  const isSubmitting = navigation.state !== 'idle'

  return (
    <Form
      method={expenseData ? 'patch' : 'post'}
      className="form"
      id="expense-form"
    >
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={defaultValues.title}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={defaultValues.date ? defaultValues.date.slice(0, 10) : ''}
          />
        </p>
      </div>
      {
        validationErrors && <ul>
          {Object.values(validationErrors).map(error => <li key={error}>
            {error}
          </li>)}
        </ul>
      }
      <div className="form-actions">
        <button disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Expense'}</button>
        {/* .. means to go to path before current (the same as we would use => '/expenses) */}
        <Link to="..">Cancel</Link>
      </div>
    </Form>
  )
}

export default ExpenseForm
