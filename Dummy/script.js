function fetchEmployees() {
    fetch('https://dummy.restapiexample.com/api/v1/employees')
        .then(response => response.json())
        .then(data => {
            const employeeTableBody = document.querySelector('#employeeTable tbody');
            employeeTableBody.innerHTML = '';
  
            data.data.forEach(employee => {
                const row = `
                    <tr>
                        <td>${employee.id}</td>
                        <td>${employee.employee_name}</td>
                        <td>${employee.employee_age}</td>
                        <td>${employee.employee_salary}</td>
                    </tr>
                `;
                employeeTableBody.innerHTML += row;
            });
  
            localStorage.setItem('employeesData', JSON.stringify(data.data));
        })
        .catch(error => {
            console.error('Erro ao buscar os dados dos funcionários:', error);
        });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const employeesData = localStorage.getItem('employeesData');
    if (employeesData) {
        const parsedData = JSON.parse(employeesData);
        const employeeTableBody = document.querySelector('#employeeTable tbody');
        parsedData.forEach(employee => {
            const row = `
                <tr>
                    <td>${employee.id}</td>
                    <td>${employee.employee_name}</td>
                    <td>${employee.employee_age}</td>
                    <td>${employee.employee_salary}</td>
                </tr>
            `;
            employeeTableBody.innerHTML += row;
        });
    } else {
        fetchEmployees();
    }
  
    const employeeSearchForm = document.getElementById('employeeSearchForm');
    employeeSearchForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
  
        const employeeIdInput = document.getElementById('employeeId');
        const employeeId = employeeIdInput.value;
  
        if (employeeId.trim() === '') {
            alert('Por favor, insira um ID de funcionário válido.');
            return;
        }
  
        fetch(`https://dummy.restapiexample.com/api/v1/employee/${employeeId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Funcionário não encontrado ou erro na requisição.');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    const employeeDetailsResult = document.getElementById('employeeDetailsResult');
                    const employee = data.data;
                    employeeDetailsResult.innerHTML = `
                        <h4>Detalhes do Funcionário</h4>
                        <p><strong>ID:</strong> ${employee.id}</p>
                        <p><strong>Nome:</strong> ${employee.employee_name}</p>
                        <p><strong>Idade:</strong> ${employee.employee_age}</p>
                        <p><strong>Salário:</strong> ${employee.employee_salary}</p>
                    `;
                } else {
                    throw new Error('Erro ao obter os dados do funcionário.');
                }
            })
            .catch(error => {
                const employeeDetailsResult = document.getElementById('employeeDetailsResult');
                employeeDetailsResult.innerHTML = `<p>${error.message}</p>`;
            });
    });
  
    const employeeFilterForm = document.getElementById('employeeFilterForm');
    employeeFilterForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const filterCriterion = document.getElementById('filterCriterion').value;
        const filterValue = document.getElementById('filterValue').value.toLowerCase();
  
        const filteredEmployees = JSON.parse(localStorage.getItem('employeesData')).filter(employee => {
            if (filterCriterion === 'name') {
                return employee.employee_name.toLowerCase().includes(filterValue);
            } else if (filterCriterion === 'age') {
                return employee.employee_age.toString() === filterValue;
            } else if (filterCriterion === 'salary') {
                return employee.employee_salary.toString() === filterValue;
            }
        });
        const employeeTableBody = document.querySelector('#employeeTable tbody');
        employeeTableBody.innerHTML = '';
        filteredEmployees.forEach(employee => {
            const row = `
                <tr>
                    <td>${employee.id}</td>
                    <td>${employee.employee_name}</td>
                    <td>${employee.employee_age}</td>
                    <td>${employee.employee_salary}</td>
                </tr>
            `;
            employeeTableBody.innerHTML += row;
        });
    });
});