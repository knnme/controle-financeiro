'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, Target, Download, Edit2, Trash2, AlertTriangle, Moon, Sun, Calendar, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts'
import { useFinanceData, type Transaction } from '@/hooks/useFinanceData'
import { useTheme } from '@/hooks/useTheme'
import { exportFinancialReport } from '@/lib/pdfExport'

export default function FinanceApp() {
  const {
    transactions,
    expenses,
    incomes,
    categories,
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
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory
  } = useFinanceData()

  const { isDark, toggleTheme } = useTheme()

  // Estado para controlar hidratação
  const [mounted, setMounted] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState('')

  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [selectedMonth, setSelectedMonth] = useState('')
  
  // Form states
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    type: 'expense' as 'income' | 'expense'
  })
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#10B981',
    budget: '',
    type: 'expense' as 'income' | 'expense' | 'both'
  })

  // Inicializar datas após hidratação
  useEffect(() => {
    setMounted(true)
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const monthStr = now.toISOString().slice(0, 7)
    
    setCurrentDate(dateStr)
    setCurrentMonth(monthStr)
    setSelectedMonth(monthStr)
    setNewTransaction(prev => ({ ...prev, date: dateStr }))
  }, [])

  // Não renderizar até estar hidratado
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Dados calculados
  const currentMonthExpenses = getCurrentMonthExpenses()
  const currentMonthIncomes = getCurrentMonthIncomes()
  const totalCurrentMonth = getTotalCurrentMonth()
  const totalCurrentMonthIncome = getTotalCurrentMonthIncome()
  const netCurrentMonth = getNetCurrentMonth()
  const monthlyData = getMonthlyData()
  const categoryData = getCategoryData(selectedMonth)
  const incomeCategoryData = getIncomeCategoryData(selectedMonth)
  const budgetAlerts = getBudgetAlerts()
  const selectedMonthTransactions = getTransactionsByMonth(selectedMonth)

  // Handlers
  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) return

    addTransaction({
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      date: newTransaction.date,
      type: newTransaction.type
    })

    resetTransactionForm()
    setIsAddTransactionOpen(false)
  }

  const handleUpdateTransaction = () => {
    if (!editingTransaction || !newTransaction.description || !newTransaction.amount || !newTransaction.category) return

    updateTransaction(editingTransaction.id, {
      description: newTransaction.description,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      date: newTransaction.date,
      type: newTransaction.type
    })
    
    setEditingTransaction(null)
    resetTransactionForm()
  }

  const handleAddCategory = () => {
    if (!newCategory.name) return

    addCategory({
      name: newCategory.name,
      color: newCategory.color,
      budget: newCategory.budget ? parseFloat(newCategory.budget) : undefined,
      type: newCategory.type
    })

    setNewCategory({ name: '', color: '#10B981', budget: '', type: 'expense' })
    setIsAddCategoryOpen(false)
  }

  const resetTransactionForm = () => {
    setNewTransaction({
      description: '',
      amount: '',
      category: '',
      date: currentDate,
      type: 'expense'
    })
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setNewTransaction({
      description: transaction.description,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      type: transaction.type
    })
    setIsAddTransactionOpen(true)
  }

  const handleExportPDF = () => {
    const monthExpenses = selectedMonthTransactions.filter(t => t.type === 'expense')
    const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    exportFinancialReport(monthExpenses as any, monthTotal, selectedMonth)
  }

  const getAvailableCategories = () => {
    return categories.filter(cat => 
      cat.type === newTransaction.type || cat.type === 'both'
    )
  }

  // Gerar opções de mês de forma estática
  const getMonthOptions = () => {
    const options = []
    const baseDate = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1)
      const monthStr = date.toISOString().slice(0, 7)
      const monthName = date.toLocaleDateString('pt-BR', { 
        month: 'long', 
        year: 'numeric' 
      })
      options.push({ value: monthStr, label: monthName })
    }
    
    return options
  }

  const monthOptions = getMonthOptions()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900'
    } p-4`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2 flex-1">
            <h1 className={`text-3xl md:text-4xl font-bold ${
              isDark ? 'text-white' : 'text-slate-800'
            }`}>
              Controle Financeiro
            </h1>
            <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
              Gerencie seus gastos e receitas de forma simples e eficaz
            </p>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`${
              isDark 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Seletor de Mês */}
        <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5" />
              <Label htmlFor="month-select">Visualizar mês:</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alertas de Orçamento */}
        {budgetAlerts.length > 0 && (
          <div className="space-y-2">
            {budgetAlerts.map(alert => (
              <Alert key={alert.category} className={`${
                isDark 
                  ? 'border-orange-600 bg-orange-900/20' 
                  : 'border-orange-200 bg-orange-50'
              }`}>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className={isDark ? 'text-orange-200' : 'text-orange-800'}>
                  <strong>{alert.category}</strong>: Você gastou R$ {alert.spent.toFixed(2)} 
                  de R$ {alert.budget.toFixed(2)} ({alert.percentage.toFixed(0)}% do orçamento)
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Receitas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalCurrentMonthIncome.toFixed(2)}
              </div>
              <p className="text-xs opacity-90 mt-1">
                {currentMonthIncomes.length} entradas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Despesas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalCurrentMonth.toFixed(2)}
              </div>
              <p className="text-xs opacity-90 mt-1">
                {currentMonthExpenses.length} transações
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            netCurrentMonth >= 0 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
              : 'bg-gradient-to-r from-orange-500 to-orange-600'
          } text-white`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Saldo do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {netCurrentMonth.toFixed(2)}
              </div>
              <p className="text-xs opacity-90 mt-1">
                {netCurrentMonth >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedMonthTransactions.length}
              </div>
              <p className="text-xs opacity-90 mt-1">
                no mês selecionado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <DialogHeader>
                <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                  {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
                </DialogTitle>
                <DialogDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  {editingTransaction ? 'Modifique os dados da transação' : 'Adicione uma nova receita ou despesa'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newTransaction.type} onValueChange={(value: 'income' | 'expense') => setNewTransaction({...newTransaction, type: value, category: ''})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">💰 Receita</SelectItem>
                      <SelectItem value="expense">💸 Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    placeholder={newTransaction.type === 'income' ? 'Ex: Salário mensal' : 'Ex: Almoço no restaurante'}
                    className={isDark ? 'bg-slate-700 border-slate-600' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    placeholder="0,00"
                    className={isDark ? 'bg-slate-700 border-slate-600' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newTransaction.category} onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCategories().map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className={isDark ? 'bg-slate-700 border-slate-600' : ''}
                  />
                </div>
                <Button 
                  onClick={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {editingTransaction ? 'Atualizar' : 'Adicionar'} Transação
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className={`${
                isDark 
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' 
                  : 'border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}>
                <Target className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <DialogHeader>
                <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>Nova Categoria</DialogTitle>
                <DialogDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Crie uma nova categoria para organizar suas transações
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryType">Tipo</Label>
                  <Select value={newCategory.type} onValueChange={(value: 'income' | 'expense' | 'both') => setNewCategory({...newCategory, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">💰 Receitas</SelectItem>
                      <SelectItem value="expense">💸 Despesas</SelectItem>
                      <SelectItem value="both">🔄 Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="categoryName">Nome da Categoria</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="Ex: Investimentos"
                    className={isDark ? 'bg-slate-700 border-slate-600' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="categoryColor">Cor</Label>
                  <Input
                    id="categoryColor"
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                    className={isDark ? 'bg-slate-700 border-slate-600' : ''}
                  />
                </div>
                {(newCategory.type === 'expense' || newCategory.type === 'both') && (
                  <div>
                    <Label htmlFor="categoryBudget">Orçamento Mensal (Opcional)</Label>
                    <Input
                      id="categoryBudget"
                      type="number"
                      step="0.01"
                      value={newCategory.budget}
                      onChange={(e) => setNewCategory({...newCategory, budget: e.target.value})}
                      placeholder="0,00"
                      className={isDark ? 'bg-slate-700 border-slate-600' : ''}
                    />
                  </div>
                )}
                <Button 
                  onClick={handleAddCategory}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Criar Categoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={handleExportPDF}
            variant="outline" 
            className={`${
              isDark 
                ? 'border-purple-600 text-purple-400 hover:bg-purple-900/20' 
                : 'border-purple-200 text-purple-700 hover:bg-purple-50'
            }`}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        {/* Conteúdo Principal */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className={`grid w-full grid-cols-4 ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'
          }`}>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="monthly">Por Mês</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico Mensal Comparativo */}
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-700'
                  }`}>
                    <TrendingUp className="w-5 h-5" />
                    Receitas vs Despesas (6 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [
                          `R$ ${Number(value).toFixed(2)}`, 
                          name === 'incomes' ? 'Receitas' : name === 'expenses' ? 'Despesas' : 'Saldo'
                        ]}
                      />
                      <Bar dataKey="incomes" fill="#10B981" name="incomes" />
                      <Bar dataKey="expenses" fill="#EF4444" name="expenses" />
                      <Bar dataKey="net" fill="#3B82F6" name="net" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico por Categoria de Despesas */}
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-700'}>
                    Despesas por Categoria ({monthOptions.find(m => m.value === selectedMonth)?.label || 'Mês atual'})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({name, value}) => `${name}: R$ ${value.toFixed(2)}`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => `R$ ${Number(value).toFixed(2)}`} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className={`flex items-center justify-center h-[300px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Nenhuma despesa registrada neste mês
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gráfico por Categoria de Receitas */}
              <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
                <CardHeader>
                  <CardTitle className={isDark ? 'text-white' : 'text-slate-700'}>
                    Receitas por Categoria ({monthOptions.find(m => m.value === selectedMonth)?.label || 'Mês atual'})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {incomeCategoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={incomeCategoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={({name, value}) => `${name}: R$ ${value.toFixed(2)}`}
                        >
                          {incomeCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: isDark ? '#1f2937' : '#ffffff',
                            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => `R$ ${Number(value).toFixed(2)}`} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className={`flex items-center justify-center h-[300px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Nenhuma receita registrada neste mês
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-700'}>Transações Recentes</CardTitle>
                <CardDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Suas últimas receitas e despesas registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 15)
                      .map(transaction => {
                        const category = categories.find(cat => cat.name === transaction.category)
                        return (
                          <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-lg ${
                            isDark ? 'bg-slate-700' : 'bg-slate-50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: category?.color || '#6B7280' }}
                                />
                                <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} className="text-xs">
                                  {transaction.type === 'income' ? '💰' : '💸'}
                                </Badge>
                              </div>
                              <div>
                                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                  {transaction.description}
                                </p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${
                                transaction.type === 'income' 
                                  ? 'text-emerald-600' 
                                  : isDark ? 'text-red-400' : 'text-red-600'
                              }`}>
                                {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditTransaction(transaction)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteTransaction(transaction.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Nenhuma transação registrada ainda.
                    <br />
                    Clique em "Nova Transação" para começar!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-700'}>
                  Transações de {monthOptions.find(m => m.value === selectedMonth)?.label || 'Mês selecionado'}
                </CardTitle>
                <CardDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Todas as movimentações do mês selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedMonthTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {/* Resumo do mês */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-emerald-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium">Receitas</span>
                        </div>
                        <div className="text-xl font-bold text-emerald-600">
                          R$ {selectedMonthTransactions
                            .filter(t => t.type === 'income')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-red-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Despesas</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          R$ {selectedMonthTransactions
                            .filter(t => t.type === 'expense')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Saldo</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          R$ {(selectedMonthTransactions
                            .filter(t => t.type === 'income')
                            .reduce((sum, t) => sum + t.amount, 0) -
                            selectedMonthTransactions
                            .filter(t => t.type === 'expense')
                            .reduce((sum, t) => sum + t.amount, 0))
                            .toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Lista de transações */}
                    <div className="space-y-3">
                      {selectedMonthTransactions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(transaction => {
                          const category = categories.find(cat => cat.name === transaction.category)
                          return (
                            <div key={transaction.id} className={`flex items-center justify-between p-3 rounded-lg ${
                              isDark ? 'bg-slate-700' : 'bg-slate-50'
                            }`}>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded-full" 
                                    style={{ backgroundColor: category?.color || '#6B7280' }}
                                  />
                                  <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} className="text-xs">
                                    {transaction.type === 'income' ? '💰' : '💸'}
                                  </Badge>
                                </div>
                                <div>
                                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {transaction.description}
                                  </p>
                                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${
                                  transaction.type === 'income' 
                                    ? 'text-emerald-600' 
                                    : isDark ? 'text-red-400' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditTransaction(transaction)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteTransaction(transaction.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ) : (
                  <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Nenhuma transação registrada neste mês.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryExpenses = currentMonthExpenses.filter(exp => exp.category === category.name)
                const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                const budgetPercentage = category.budget ? (spent / category.budget) * 100 : 0

                return (
                  <Card key={category.id} className={`relative ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'
                  }`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                        <Badge variant="outline" className="text-xs">
                          {category.type === 'income' ? '💰' : category.type === 'expense' ? '💸' : '🔄'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Gasto este mês:
                          </span>
                          <span className="font-semibold">R$ {spent.toFixed(2)}</span>
                        </div>
                        
                        {category.budget && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Orçamento:
                              </span>
                              <span className="text-sm">R$ {category.budget.toFixed(2)}</span>
                            </div>
                            
                            <div className={`w-full rounded-full h-2 ${
                              isDark ? 'bg-slate-600' : 'bg-slate-200'
                            }`}>
                              <div 
                                className={`h-2 rounded-full transition-all ${
                                  budgetPercentage > 100 ? 'bg-red-500' : 
                                  budgetPercentage > 80 ? 'bg-orange-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                              />
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                {budgetPercentage.toFixed(0)}% usado
                              </span>
                              {budgetPercentage > 100 && (
                                <Badge variant="destructive" className="text-xs">
                                  Excedido
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                        
                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          {categoryExpenses.length} transações
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}