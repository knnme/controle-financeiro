export const exportFinancialReport = (expenses: any[], total: number, month: string) => {
  // Criar conteúdo HTML para o relatório
  const monthName = new Date(month + '-01').toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  })
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Relatório Financeiro - ${monthName}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #10B981;
          padding-bottom: 20px;
        }
        .summary { 
          background: #f8f9fa; 
          padding: 20px; 
          border-radius: 8px; 
          margin-bottom: 30px;
        }
        .transaction { 
          display: flex; 
          justify-content: space-between; 
          padding: 10px 0; 
          border-bottom: 1px solid #eee;
        }
        .total { 
          font-weight: bold; 
          font-size: 18px; 
          color: #10B981;
          text-align: right;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #10B981;
        }
        .category { 
          color: #666; 
          font-size: 14px;
        }
        .amount { 
          font-weight: bold;
          color: #EF4444;
        }
        .date { 
          color: #888; 
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório Financeiro</h1>
        <h2>${monthName}</h2>
        <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      
      <div class="summary">
        <h3>Resumo do Mês</h3>
        <p><strong>Total de Despesas:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Número de Transações:</strong> ${expenses.length}</p>
      </div>
      
      <h3>Detalhamento das Despesas</h3>
      ${expenses.map(expense => `
        <div class="transaction">
          <div>
            <div><strong>${expense.description}</strong></div>
            <div class="category">${expense.category}</div>
            <div class="date">${new Date(expense.date).toLocaleDateString('pt-BR')}</div>
          </div>
          <div class="amount">R$ ${expense.amount.toFixed(2)}</div>
        </div>
      `).join('')}
      
      <div class="total">
        Total Geral: R$ ${total.toFixed(2)}
      </div>
    </body>
    </html>
  `
  
  // Criar blob e fazer download
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `relatorio-financeiro-${month}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}