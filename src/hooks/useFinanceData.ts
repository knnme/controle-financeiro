import { useState, useEffect } from 'react'

export interface Transaction {
  id: string
  description: string
  amount: number
  category: string
  date: string
  type: 'income' | 'expense'
}

// Manter compatibilidade com código existente
export interface Expense extends Omit<Transaction, 'type'> {}

export interface Category {
  id: string
  name: string
  color: string
  budget?: number
  type: 'income' | 'expense' | 'both'
}

export interface BudgetAlert {
  category: string
  spent: number
  budget: number
  percentage: number
}

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  // Carregar dados do localStorage
  useEffect(() => {
    // Verificar se estamos no cliente (evitar erros de SSR)
    if (typeof window === 'undefined') return
    
    const savedTransactions = localStorage.getItem('finance-transactions')
    const savedExpenses = localStorage.getItem('finance-expenses') // Compatibilidade
    const savedCategories = localStorage.getItem('finance-categories')
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    } else if (savedExpenses) {
      // Migrar dados antigos de expenses para transactions
      const oldExpenses = JSON.parse(savedExpenses)
      const migratedTransactions = oldExpenses.map((exp: any) => ({
        ...exp,
        type: 'expense'
      }))
      setTransactions(migratedTransactions)
    }
    
    if (savedCategories) {
      const savedCats = JSON.parse(savedCategories)
      // Migrar categorias antigas para incluir type
      const migratedCategories = savedCats.map((cat: any) => ({
        ...cat,
        type: cat.type || 'expense'
      }))
      setCategories(migratedCategories)
    } else {
      // Categorias padrão se não houver dados salvos
      const defaultCategories: Category[] = [
        // Categorias de despesas
        { id: '1', name: 'Alimentação', color: '#10B981', type: 'expense' },
        { id: '2', name: 'Transporte', color: '#3B82F6', type: 'expense' },
        { id: '3', name: 'Lazer', color: '#8B5CF6', type: 'expense' },
        { id: '4', name: 'Saúde', color: '#EF4444', type: 'expense' },
        { id: '5', name: 'Educação', color: '#F59E0B', type: 'expense' },
        { id: '6', name: 'Casa', color: '#06B6D4', type: 'expense' },
        { id: '7', name: 'Roupas', color: '#EC4899', type: 'expense' },
        { id: '8', name: 'Outros', color: '#6B7280', type: 'expense' },
        // Categorias de receitas
        { id: '9', name: 'Salário', color: '#059669', type: 'income' },
        { id: '10', name: 'Freelance', color: '#0891B2', type: 'income' },
        { id: '11', name: 'Investimentos', color: '#7C3AED', type: 'income' },
        { id: '12', name: 'Vendas', color: '#DC2626', type: 'income' },
        { id: '13', name: 'Bonificação', color: '#EA580C', type: 'income' },
        { id: '14', name: 'Outros Ganhos', color: '#65A30D', type: 'income' }
      ]
      setCategories(defaultCategories)
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (transactions.length > 0) {
      localStorage.setItem('finance-transactions', JSON.stringify(transactions))
    }
  }, [transactions])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (categories.length > 0) {
      localStorage.setItem('finance-categories', JSON.stringify(categories))
    }
  }, [categories])

  // Funções utilitárias
  const getCurrentMonth = () => new Date().toISOString().slice(0, 7)
  
  const getTransactionsByMonth = (month?: string) => {
    const targetMonth = month || getCurrentMonth()
    return transactions.filter(transaction => transaction.date.startsWith(targetMonth))
  }

  const getCurrentMonthExpenses = () => {
    return getTransactionsByMonth().filter(t => t.type === 'expense')
  }

  const getCurrentMonthIncomes = () => {
    return getTransactionsByMonth().filter(t => t.type === 'income')
  }

  const getTotalCurrentMonth = () => {
    return getCurrentMonthExpenses().reduce((sum, exp) => sum + exp.amount, 0)
  }

  const getTotalCurrentMonthIncome = () => {
    return getCurrentMonthIncomes().reduce((sum, inc) => sum + inc.amount, 0)
  }

  const getNetCurrentMonth = () => {
    return getTotalCurrentMonthIncome() - getTotalCurrentMonth()
  }

  const getMonthlyData = (months: number = 6) => {
    const monthlyData = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStr = date.toISOString().slice(0, 7)
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      
      const monthExpenses = transactions
        .filter(t => t.date.startsWith(monthStr) && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const monthIncomes = transactions
        .filter(t => t.date.startsWith(monthStr) && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      monthlyData.push({ 
        month: monthName, 
        expenses: monthExpenses,
        incomes: monthIncomes,
        net: monthIncomes - monthExpenses
      })
    }
    
    return monthlyData
  }

  const getCategoryData = (month?: string) => {
    const monthTransactions = getTransactionsByMonth(month).filter(t => t.type === 'expense')
    
    return categories
      .filter(cat => cat.type === 'expense' || cat.type === 'both')
      .map(cat => {
        const categoryTransactions = monthTransactions.filter(t => t.category === cat.name)
        const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
        return {
          name: cat.name,
          value: total,
          color: cat.color,
          budget: cat.budget
        }
      }).filter(item => item.value > 0)
  }

  const getIncomeCategoryData = (month?: string) => {
    const monthTransactions = getTransactionsByMonth(month).filter(t => t.type === 'income')
    
    return categories
      .filter(cat => cat.type === 'income' || cat.type === 'both')
      .map(cat => {
        const categoryTransactions = monthTransactions.filter(t => t.category === cat.name)
        const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
        return {
          name: cat.name,
          value: total,
          color: cat.color
        }
      }).filter(item => item.value > 0)
  }

  const getBudgetAlerts = (): BudgetAlert[] => {
    const currentMonthExpenses = getCurrentMonthExpenses()
    
    return categories
      .filter(cat => cat.budget && (cat.type === 'expense' || cat.type === 'both'))
      .map(cat => {
        const spent = currentMonthExpenses
          .filter(exp => exp.category === cat.name)
          .reduce((sum, exp) => sum + exp.amount, 0)
        
        return {
          category: cat.name,
          spent,
          budget: cat.budget!,
          percentage: (spent / cat.budget!) * 100
        }
      })
      .filter(alert => alert.percentage > 80)
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    }
    setTransactions(prev => [...prev, newTransaction])
  }

  const updateTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...transaction, id } : t
    ))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // Manter compatibilidade com código existente
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    addTransaction({ ...expense, type: 'expense' })
  }

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    updateTransaction(id, { ...expense, type: 'expense' })
  }

  const deleteExpense = (id: string) => {
    deleteTransaction(id)
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    }
    setCategories(prev => [...prev, newCategory])
  }

  // Compatibilidade: expenses como transações de despesa
  const expenses = transactions.filter(t => t.type === 'expense') as Expense[]
  const incomes = transactions.filter(t => t.type === 'income')

  return {
    // Dados
    transactions,
    expenses, // Compatibilidade
    incomes,
    categories,
    
    // Funções de consulta
    getTransactionsByMonth,
    getCurrentMonthExpenses,
    getCurrentMonthIncomes,
    getTotalCurrentMonth,
    getTotalCurrentMonthIncome,
    getNetCurrentMonth,
    getMonthlyData,
    getCategoryData,
    getIncomeCategoryData,
    getBudgetAlerts,
    
    // Funções de manipulação
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addExpense, // Compatibilidade
    updateExpense, // Compatibilidade
    deleteExpense, // Compatibilidade
    addCategory
  }
}