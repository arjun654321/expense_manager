
const transactionForm = document.getElementById('transaction-form');
        const transactionList = document.getElementById('transaction-list');
        const balanceElement = document.getElementById('balance');
        const ctx = document.getElementById('expense-chart').getContext('2d');

        let transactions = [];
        let totalIncome = 0;
        let totalExpense = 0;

        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    label: 'Expenses Breakdown',
                    data: [],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        function updateChart() {
            const expenseLabels = [];
            const expenseData = [];
            const expenseMap = {};

            transactions.forEach(transaction => {
                if (transaction.type === 'expense') {
                    expenseMap[transaction.name] = (expenseMap[transaction.name] || 0) + transaction.amount;
                }
            });

            for (const [name, amount] of Object.entries(expenseMap)) {
                expenseLabels.push(name);
                expenseData.push(amount);
            }

            chart.data.labels = expenseLabels;
            chart.data.datasets[0].data = expenseData;
            chart.update();
        }

        transactionForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission refresh

            const transactionName = document.getElementById('transaction-name').value.trim();
            const transactionAmount = parseFloat(document.getElementById('transaction-amount').value);
            const transactionType = document.getElementById('transaction-type').value;
            const timestamp = new Date().toLocaleString();

            if (!transactionName || isNaN(transactionAmount) || transactionAmount <= 0) {
                alert('Please provide valid inputs. Amount must be greater than zero.');
                return;
            }

            const transaction = {
                name: transactionName,
                amount: transactionAmount,
                type: transactionType,
                timestamp: timestamp
            };

            transactions.push(transaction);

            const transactionItem = document.createElement('div');
            transactionItem.classList.add('item');
            transactionItem.innerHTML = `
                <span>${transaction.name} (${transaction.timestamp})</span>
                <span>${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</span>
            `;
            transactionList.appendChild(transactionItem);

            if (transactionType === 'income') {
                totalIncome += transactionAmount;
            } else {
                totalExpense += transactionAmount;
            }

            const balance = totalIncome - totalExpense;
            balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;

            updateChart();

            transactionForm.reset();
        });