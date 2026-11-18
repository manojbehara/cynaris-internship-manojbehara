const employees = [
  { id: 1, name: "Maya Chen", role: "Product Designer", department: "Design", salary: 92000 },
  { id: 2, name: "Liam Patel", role: "Frontend Engineer", department: "Engineering", salary: 108000 },
  { id: 3, name: "Ava Martinez", role: "Data Analyst", department: "Data", salary: 89000 },
  { id: 4, name: "Noah Williams", role: "Account Executive", department: "Sales", salary: 98000 },
  { id: 5, name: "Zoe Thompson", role: "Brand Strategist", department: "Marketing", salary: 85000 },
  { id: 6, name: "Ethan Kim", role: "Backend Engineer", department: "Engineering", salary: 112000 },
  { id: 7, name: "Sofia Garcia", role: "UX Researcher", department: "Design", salary: 94000 },
  { id: 8, name: "Oliver Brown", role: "Growth Manager", department: "Marketing", salary: 99000 },
  { id: 9, name: "Priya Shah", role: "Machine Learning Engineer", department: "Data", salary: 125000 }
];

const state = {
  department: "All",
  query: "",
  sort: "name"
};

const elements = {
  grid: document.querySelector("#employee-grid"),
  search: document.querySelector("#search-input"),
  departmentButtons: document.querySelector("#department-buttons"),
  sort: document.querySelector("#sort-select"),
  reset: document.querySelector("#reset-button"),
  visibleCount: document.querySelector("#visible-count"),
  averageSalary: document.querySelector("#average-salary"),
  highestSalary: document.querySelector("#highest-salary"),
  departmentTotal: document.querySelector("#department-total")
};

const formatSalary = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const departments = [...new Set(employees.map(({ department }) => department))];

departments.forEach((department) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-button";
  button.dataset.department = department;
  button.textContent = department;
  elements.departmentButtons.append(button);
});

const getFilteredEmployees = () => {
  const normalizedQuery = state.query.toLowerCase().trim();

  const filtered = employees
    .filter(({ department }) => state.department === "All" || department === state.department)
    .filter(({ name, role }) => {
      return !normalizedQuery
        || name.toLowerCase().includes(normalizedQuery)
        || role.toLowerCase().includes(normalizedQuery);
    });

  return [...filtered].sort((first, second) => {
    if (state.sort === "salary-desc") return second.salary - first.salary;
    if (state.sort === "salary-asc") return first.salary - second.salary;
    return first.name.localeCompare(second.name);
  });
};

const getSummary = (dataset) => dataset.reduce((summary, employee) => {
  const { salary, department } = employee;
  summary.totalSalary += salary;
  summary.highestSalary = Math.max(summary.highestSalary, salary);
  summary.departments.add(department);
  return summary;
}, { totalSalary: 0, highestSalary: 0, departments: new Set() });

const employeeCard = ({ name, role, department, salary }) => `
  <article class="employee-card">
    <span class="department">${department}</span>
    <h3>${name}</h3>
    <span class="role">${role}</span>
    <span class="salary">${formatSalary.format(salary)}</span>
  </article>
`;

const render = () => {
  const dataset = getFilteredEmployees();
  const summary = getSummary(dataset);

  elements.visibleCount.textContent = dataset.length;
  elements.averageSalary.textContent = dataset.length
    ? formatSalary.format(summary.totalSalary / dataset.length)
    : "—";
  elements.highestSalary.textContent = dataset.length
    ? formatSalary.format(summary.highestSalary)
    : "—";
  elements.departmentTotal.textContent = dataset.length
    ? summary.departments.size
    : "0";

  elements.grid.innerHTML = dataset.length
    ? dataset.map(employeeCard).join("")
    : '<p class="empty-state">No employees match these filters.</p>';
};

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

elements.departmentButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-department]");
  if (!button) return;

  state.department = button.dataset.department;
  elements.departmentButtons.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("active", item === button);
  });
  render();
});

elements.sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

elements.reset.addEventListener("click", () => {
  state.department = "All";
  state.query = "";
  state.sort = "name";
  elements.search.value = "";
  elements.sort.value = "name";
  elements.departmentButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.department === "All");
  });
  render();
});

render();
