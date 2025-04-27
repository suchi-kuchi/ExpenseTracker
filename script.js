document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    displayExpenses(expenses);
    updateTotalAmount();

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showSpinner();

        setTimeout(() => {
            const name = document.getElementById("expense-name").value;
            const amount = parseFloat(document.getElementById("expense-amount").value);
            const category = document.getElementById("expense-category").value;
            const date = document.getElementById("expense-date").value;

            const expense = {
                id: Date.now(),
                name,
                amount,
                category,
                date
            };

            expenses.push(expense);
            saveExpenses();
            displayExpenses(expenses);
            updateTotalAmount();
            expenseForm.reset();
            hideSpinner();

            Swal.fire({
                icon: 'success',
                title: 'Expense Added!',
                text: 'Your expense has been added successfully.',
                showConfirmButton: false,
                timer: 1500
            });

        }, 700);
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    showSpinner();
                    setTimeout(() => {
                        expenses = expenses.filter(expense => expense.id !== id);
                        saveExpenses();
                        displayExpenses(expenses);
                        updateTotalAmount();
                        hideSpinner();
                        Swal.fire(
                            'Deleted!',
                            'Your expense has been deleted.',
                            'success'
                        );
                    }, 700);
                }
            });
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;

            expenses = expenses.filter(expense => expense.id !== id);
            saveExpenses();
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

    function saveExpenses() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function showSpinner() {
        document.getElementById("loading-spinner").style.display = "block";
    }

    function hideSpinner() {
        document.getElementById("loading-spinner").style.display = "none";
    }
    // Search Expenses
document.getElementById("search-expense").addEventListener("input", function(e) {
    const searchText = e.target.value.toLowerCase();
    const filtered = expenses.filter(expense =>
        expense.name.toLowerCase().includes(searchText) ||
        expense.category.toLowerCase().includes(searchText) ||
        expense.date.includes(searchText)
    );
    displayExpenses(filtered);
});

// Download CSV
document.getElementById("download-csv").addEventListener("click", function() {
    if (expenses.length === 0) {
        Swal.fire('No expenses to download!');
        return;
    }

    let csv = 'Name,Amount,Category,Date\n';
    expenses.forEach(expense => {
        csv += `${expense.name},${expense.amount},${expense.category},${expense.date}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
});


});
