import { prisma } from "./database.server.js"

export async function addExpense(expensesData, userId) {
    try {
        return await prisma.expense.create({
            data: {
                title: expensesData.title,
                amount: +expensesData.amount,
                date: new Date(expensesData.date),
                User: { connect: { id: userId } }
            }
        })
    } catch (error) {
        throw new Error('Failed to add expense.')
    }
}

export async function getExpenses(userId) {
    if (!userId) {
        throw new Error('Failed to get expenses.')
    }
    try {
        const expenses = await prisma.expense.findMany({
            where: { userId: userId },
            orderBy: { date: 'desc' }
        })
        return expenses
    } catch (error) {
        throw new Error('Failed to get expenses.')
    }
}
export async function getExpenseById(id) {
    try {
        const expenses = await prisma.expense.findFirst({ where: { id: id } })
        return expenses
    } catch (error) {
        throw new Error('Failed to get expense.')
    }
}
export async function updateExpense(id, expenseData) {
    try {
        const expenses = await prisma.expense.update({
            where: { id: id },
            data: {
                title: expenseData.title,
                amount: +expenseData.amount,
                date: new Date(expenseData.date)
            }
        })
        return expenses
    } catch (error) {
        throw new Error('Failed to update expense.')
    }
}
export async function deleteExpense(id) {
    try {
        const expenses = await prisma.expense.delete({ where: { id: id } })
        return expenses
    } catch (error) {
        throw new Error('Failed to delete expense.')
    }
}