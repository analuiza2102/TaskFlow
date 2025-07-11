class TaskFlowApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.currentSection = 'dashboard';
        this.editingTaskId = null;
        this.charts = {
            status: null,
            category: null
        };
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadInitialData();
        this.loadTheme();
    }

    checkAuth() {
        const authData = this.getAuthData();
        if (!authData) {
            window.location.href = 'login.html';
            return;
        }

        this.currentUser = authData.user;
        this.displayUserInfo();
    }

    getAuthData() {
        const sessionData = sessionStorage.getItem('authData');
        const localData = localStorage.getItem('authData');
        
        if (sessionData) {
            return JSON.parse(sessionData);
        } else if (localData) {
            return JSON.parse(localData);
        }
        
        return null;
    }

    displayUserInfo() {
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        
        if (userNameElement) userNameElement.textContent = this.currentUser.name;
        if (userEmailElement) userEmailElement.textContent = this.currentUser.email;
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (sidebarToggle) sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        if (sidebarClose) sidebarClose.addEventListener('click', () => this.closeSidebar());
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => this.closeSidebar());

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

        // Task actions
        const newTaskBtn = document.getElementById('newTaskBtn');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const saveTaskBtn = document.getElementById('saveTaskBtn');
        
        if (newTaskBtn) newTaskBtn.addEventListener('click', () => this.showTaskModal());
        if (addTaskBtn) addTaskBtn.addEventListener('click', () => this.showTaskModal());
        if (saveTaskBtn) saveTaskBtn.addEventListener('click', () => this.saveTask());

        // Task form
        const taskForm = document.getElementById('taskForm');
        if (taskForm) taskForm.addEventListener('submit', (e) => e.preventDefault());

        // Filters
        const searchTasks = document.getElementById('searchTasks');
        const filterStatus = document.getElementById('filterStatus');
        const filterPriority = document.getElementById('filterPriority');
        const filterCategory = document.getElementById('filterCategory');
        const clearFilters = document.getElementById('clearFilters');
        
        if (searchTasks) searchTasks.addEventListener('input', () => this.filterTasks());
        if (filterStatus) filterStatus.addEventListener('change', () => this.filterTasks());
        if (filterPriority) filterPriority.addEventListener('change', () => this.filterTasks());
        if (filterCategory) filterCategory.addEventListener('change', () => this.filterTasks());
        if (clearFilters) clearFilters.addEventListener('click', () => this.clearFilters());

        // Set default due date
        const taskDueDate = document.getElementById('taskDueDate');
        if (taskDueDate) taskDueDate.value = new Date().toISOString().split('T')[0];

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const taskModal = document.getElementById('taskModal');
                if (taskModal && typeof bootstrap !== 'undefined') {
                    const modal = bootstrap.Modal.getInstance(taskModal);
                    if (modal) {
                        modal.hide();
                    }
                }
            }
        });
    }

    loadInitialData() {
        this.loadTasks();
        this.showSection('dashboard');
    }

    loadTasks() {
        // Load tasks from localStorage or use default tasks
        const savedTasks = localStorage.getItem('taskflow_tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks).map(task => ({
                ...task,
                dueDate: new Date(task.dueDate),
                createdAt: new Date(task.createdAt)
            }));
        } else {
            // Default tasks for demo
            this.tasks = [
                {
                    id: '1',
                    title: 'Finalizar relatório mensal',
                    description: 'Completar e revisar o relatório de vendas do mês',
                    category: 'trabalho',
                    priority: 'alta',
                    status: 'pendente',
                    dueDate: new Date('2025-07-15'),
                    createdAt: new Date('2025-07-10')
                },
                {
                    id: '2',
                    title: 'Consulta médica',
                    description: 'Consulta de rotina com cardiologista',
                    category: 'saude',
                    priority: 'media',
                    status: 'pendente',
                    dueDate: new Date('2025-07-20'),
                    createdAt: new Date('2025-07-09')
                },
                {
                    id: '3',
                    title: 'Curso online JavaScript',
                    description: 'Completar módulo 5 do curso de JavaScript avançado',
                    category: 'educacao',
                    priority: 'baixa',
                    status: 'concluida',
                    dueDate: new Date('2025-07-08'),
                    createdAt: new Date('2025-07-05')
                }
            ];
            this.saveTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.getAttribute('data-section');
        this.showSection(section);
    }

    showSection(sectionName) {
        // Update active navigation
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            }
        });

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Update page title
            this.updatePageTitle(sectionName);
            
            // Load section-specific data
            this.loadSectionData(sectionName);
        }

        // Close sidebar on mobile
        this.closeSidebar();
    }

    updatePageTitle(sectionName) {
        const titles = {
            dashboard: 'Dashboard',
            tasks: 'Tarefas',
            categories: 'Categorias',
            calendar: 'Calendário',
            reports: 'Relatórios'
        };
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'TaskFlow';
        }
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'tasks':
                this.loadTasksSection();
                break;
        }
    }

    loadDashboard() {
        this.updateStats();
        this.updateCharts();
        this.loadRecentTasks();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.status === 'concluida').length;
        const pending = this.tasks.filter(task => task.status === 'pendente').length;
        const overdue = this.tasks.filter(task => 
            task.status === 'pendente' && task.dueDate < new Date()
        ).length;

        const totalElement = document.getElementById('totalTasks');
        const completedElement = document.getElementById('completedTasks');
        const pendingElement = document.getElementById('pendingTasks');
        const overdueElement = document.getElementById('overdueTasks');

        if (totalElement) totalElement.textContent = total;
        if (completedElement) completedElement.textContent = completed;
        if (pendingElement) pendingElement.textContent = pending;
        if (overdueElement) overdueElement.textContent = overdue;
    }

    updateCharts() {
        try {
            this.updateStatusChart();
            this.updateCategoryChart();
        } catch (error) {
            console.warn('Erro ao atualizar gráficos:', error);
            this.showChartError();
        }
    }

    showChartError() {
        const statusChartContainer = document.getElementById('statusChart');
        const categoryChartContainer = document.getElementById('categoryChart');
        
        if (statusChartContainer) {
            statusChartContainer.parentElement.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center text-muted">
                        <i class="bi bi-bar-chart fs-1 mb-2"></i>
                        <p>Gráfico temporariamente indisponível</p>
                    </div>
                </div>
            `;
        }
        
        if (categoryChartContainer) {
            categoryChartContainer.parentElement.innerHTML = `
                <div class="d-flex align-items-center justify-content-center h-100">
                    <div class="text-center text-muted">
                        <i class="bi bi-pie-chart fs-1 mb-2"></i>
                        <p>Gráfico temporariamente indisponível</p>
                    </div>
                </div>
            `;
        }
    }

    updateStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não está carregado');
            return;
        }

        const completed = this.tasks.filter(task => task.status === 'concluida').length;
        const pending = this.tasks.filter(task => task.status === 'pendente').length;
        const inProgress = this.tasks.filter(task => task.status === 'em_andamento').length;
        const cancelled = this.tasks.filter(task => task.status === 'cancelada').length;

        const data = {
            labels: ['Concluídas', 'Pendentes', 'Em Andamento', 'Canceladas'],
            datasets: [{
                data: [completed, pending, inProgress, cancelled],
                backgroundColor: [
                    '#198754',
                    '#0d6efd',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        };

        // Destroy existing chart
        if (this.charts.status) {
            this.charts.status.destroy();
        }

        try {
            this.charts.status = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                color: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#e9ecef' : '#495057'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao criar gráfico de status:', error);
        }
    }

    updateCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não está carregado');
            return;
        }

        const categoryCount = {};
        this.tasks.forEach(task => {
            const category = this.getCategoryLabel(task.category);
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        const data = {
            labels: Object.keys(categoryCount),
            datasets: [{
                label: 'Tarefas',
                data: Object.values(categoryCount),
                backgroundColor: '#0d6efd',
                borderRadius: 4,
                borderSkipped: false,
            }]
        };

        // Destroy existing chart
        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const theme = document.documentElement.getAttribute('data-bs-theme');
        const textColor = theme === 'dark' ? '#e9ecef' : '#495057';
        const gridColor = theme === 'dark' ? '#404040' : '#dee2e6';

        try {
            this.charts.category = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: textColor
                            },
                            grid: {
                                color: gridColor
                            }
                        },
                        x: {
                            ticks: {
                                color: textColor
                            },
                            grid: {
                                color: gridColor
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao criar gráfico de categoria:', error);
        }
    }

    loadRecentTasks() {
        const recentTasks = this.tasks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const container = document.getElementById('recentTasksList');
        if (!container) return;
        
        if (recentTasks.length === 0) {
            container.innerHTML = '<div class="text-center py-4"><p class="text-muted">Nenhuma tarefa encontrada</p></div>';
            return;
        }

        container.innerHTML = recentTasks.map(task => {
            const isOverdue = task.status === 'pendente' && task.dueDate < new Date();
            return `
                <div class="task-item">
                    <div class="task-info">
                        <div class="priority-indicator ${task.priority}"></div>
                        <div class="task-details">
                            <h6>${task.title}</h6>
                            <p>${this.getCategoryLabel(task.category)} • ${this.formatDate(task.dueDate)} ${isOverdue ? '• <span class="text-danger">Atrasada</span>' : ''}</p>
                        </div>
                    </div>
                    <div class="task-meta">
                        <span class="status-badge ${task.status}">${this.getStatusLabel(task.status)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadTasksSection() {
        this.updateCategoryFilter();
        this.filterTasks();
    }

    updateCategoryFilter() {
        const select = document.getElementById('filterCategory');
        if (!select) return;
        
        const categories = [...new Set(this.tasks.map(task => task.category))];
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">Todas</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.getCategoryLabel(category);
            select.appendChild(option);
        });
        
        select.value = currentValue;
    }

    filterTasks() {
        const searchTasks = document.getElementById('searchTasks');
        const filterStatus = document.getElementById('filterStatus');
        const filterPriority = document.getElementById('filterPriority');
        const filterCategory = document.getElementById('filterCategory');

        const searchTerm = searchTasks ? searchTasks.value.toLowerCase() : '';
        const statusFilter = filterStatus ? filterStatus.value : '';
        const priorityFilter = filterPriority ? filterPriority.value : '';
        const categoryFilter = filterCategory ? filterCategory.value : '';

        let filteredTasks = this.tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) ||
                                task.description.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || task.status === statusFilter;
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesCategory = !categoryFilter || task.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
        });

        this.displayTasks(filteredTasks);
    }

    displayTasks(tasks) {
        const container = document.getElementById('tasksGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!container || !emptyState) return;

        if (tasks.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        container.innerHTML = tasks.map(task => {
            const isOverdue = task.status === 'pendente' && task.dueDate < new Date();
            return `
                <div class="task-card priority-${task.priority}" data-task-id="${task.id}">
                    <div class="task-card-header">
                        <h5>${task.title}</h5>
                        <div class="task-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="app.editTask('${task.id}')">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="app.deleteTask('${task.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="task-card-body">
                        <p>${task.description}</p>
                    </div>
                    <div class="task-card-footer">
                        <div class="task-badges">
                            <span class="badge bg-secondary">${this.getCategoryLabel(task.category)}</span>
                            <span class="badge bg-${this.getPriorityColor(task.priority)}">${this.getPriorityLabel(task.priority)}</span>
                            <span class="badge status-badge ${task.status}">${this.getStatusLabel(task.status)}</span>
                        </div>
                        <div class="task-date ${isOverdue ? 'overdue' : ''}">
                            <i class="bi bi-calendar"></i>
                            ${this.formatDate(task.dueDate)}
                            ${isOverdue ? '<br><small>Atrasada</small>' : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    showTaskModal(taskId = null) {
        const taskModal = document.getElementById('taskModal');
        if (!taskModal || typeof bootstrap === 'undefined') return;
        
        this.editingTaskId = taskId;
        const modal = new bootstrap.Modal(taskModal);
        const modalTitle = document.getElementById('taskModalLabel');
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                if (modalTitle) modalTitle.textContent = 'Editar Tarefa';
                this.populateTaskForm(task);
            }
        } else {
            if (modalTitle) modalTitle.textContent = 'Nova Tarefa';
            this.clearTaskForm();
        }
        
        modal.show();
    }

    populateTaskForm(task) {
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');
        const taskCategory = document.getElementById('taskCategory');
        const taskPriority = document.getElementById('taskPriority');
        const taskStatus = document.getElementById('taskStatus');
        const taskDueDate = document.getElementById('taskDueDate');

        if (taskTitle) taskTitle.value = task.title;
        if (taskDescription) taskDescription.value = task.description;
        if (taskCategory) taskCategory.value = task.category;
        if (taskPriority) taskPriority.value = task.priority;
        if (taskStatus) taskStatus.value = task.status;
        if (taskDueDate) taskDueDate.value = task.dueDate.toISOString().split('T')[0];
    }

    clearTaskForm() {
        const taskForm = document.getElementById('taskForm');
        const taskDueDate = document.getElementById('taskDueDate');
        const taskStatus = document.getElementById('taskStatus');
        const taskPriority = document.getElementById('taskPriority');

        if (taskForm) taskForm.reset();
        if (taskDueDate) taskDueDate.value = new Date().toISOString().split('T')[0];
        if (taskStatus) taskStatus.value = 'pendente';
        if (taskPriority) taskPriority.value = 'media';
    }

    saveTask() {
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');
        const taskCategory = document.getElementById('taskCategory');
        const taskPriority = document.getElementById('taskPriority');
        const taskStatus = document.getElementById('taskStatus');
        const taskDueDate = document.getElementById('taskDueDate');

        if (!taskTitle || !taskCategory || !taskDueDate) {
            this.showAlert('Elementos do formulário não encontrados.', 'danger');
            return;
        }

        const title = taskTitle.value.trim();
        const description = taskDescription ? taskDescription.value.trim() : '';
        const category = taskCategory.value;
        const priority = taskPriority ? taskPriority.value : 'media';
        const status = taskStatus ? taskStatus.value : 'pendente';
        const dueDate = new Date(taskDueDate.value);

        if (!title || !category) {
            this.showAlert('Por favor, preencha todos os campos obrigatórios.', 'danger');
            return;
        }

        const taskData = {
            title,
            description,
            category,
            priority,
            status,
            dueDate
        };

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskData);
        } else {
            this.createTask(taskData);
        }

        const taskModal = document.getElementById('taskModal');
        if (taskModal && typeof bootstrap !== 'undefined') {
            const modal = bootstrap.Modal.getInstance(taskModal);
            if (modal) modal.hide();
        }
        
        this.editingTaskId = null;
    }

    createTask(taskData) {
        const newTask = {
            id: Date.now().toString(),
            ...taskData,
            createdAt: new Date()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.refreshCurrentSection();
        this.showAlert('Tarefa criada com sucesso!', 'success');
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...taskData
            };
            this.saveTasks();
            this.refreshCurrentSection();
            this.showAlert('Tarefa atualizada com sucesso!', 'success');
        }
    }

    editTask(taskId) {
        this.showTaskModal(taskId);
    }

    deleteTask(taskId) {
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.refreshCurrentSection();
            this.showAlert('Tarefa excluída com sucesso!', 'success');
        }
    }

    refreshCurrentSection() {
        this.loadSectionData(this.currentSection);
    }

    clearFilters() {
        const searchTasks = document.getElementById('searchTasks');
        const filterStatus = document.getElementById('filterStatus');
        const filterPriority = document.getElementById('filterPriority');
        const filterCategory = document.getElementById('filterCategory');

        if (searchTasks) searchTasks.value = '';
        if (filterStatus) filterStatus.value = '';
        if (filterPriority) filterPriority.value = '';
        if (filterCategory) filterCategory.value = '';
        
        this.filterTasks();
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.toggle('show');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('show');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('show');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateThemeIcon(newTheme);
        this.updateChartsTheme(newTheme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
        }
    }

    updateChartsTheme(theme) {
        const textColor = theme === 'dark' ? '#e9ecef' : '#495057';
        const gridColor = theme === 'dark' ? '#404040' : '#dee2e6';

        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                try {
                    if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                        chart.options.plugins.legend.labels.color = textColor;
                    }
                    if (chart.options.scales) {
                        Object.keys(chart.options.scales).forEach(scale => {
                            if (chart.options.scales[scale].ticks) {
                                chart.options.scales[scale].ticks.color = textColor;
                            }
                            if (chart.options.scales[scale].grid) {
                                chart.options.scales[scale].grid.color = gridColor;
                            }
                        });
                    }
                    chart.update();
                } catch (error) {
                    console.warn('Erro ao atualizar tema do gráfico:', error);
                }
            }
        });
    }

    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            sessionStorage.removeItem('authData');
            localStorage.removeItem('authData');
            window.location.href = 'login.html';
        }
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertContainer.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'danger' ? 'x-circle' : 'info-circle'}-fill me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertContainer);
        
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.parentNode.removeChild(alertContainer);
            }
        }, 5000);
    }

    // Utility methods
    getCategoryLabel(category) {
        const labels = {
            trabalho: 'Trabalho',
            pessoal: 'Pessoal',
            saude: 'Saúde',
            educacao: 'Educação',
            lazer: 'Lazer',
            financeiro: 'Financeiro'
        };
        return labels[category] || category;
    }

    getStatusLabel(status) {
        const labels = {
            pendente: 'Pendente',
            em_andamento: 'Em Andamento',
            concluida: 'Concluída',
            cancelada: 'Cancelada'
        };
        return labels[status] || status;
    }

    getPriorityLabel(priority) {
        const labels = {
            baixa: 'Baixa',
            media: 'Média',
            alta: 'Alta'
        };
        return labels[priority] || priority;
    }

    getPriorityColor(priority) {
        const colors = {
            baixa: 'success',
            media: 'warning',
            alta: 'danger'
        };
        return colors[priority] || 'secondary';
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR');
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TaskFlowApp();
});

// Global functions for HTML onclick events
function showSection(sectionName) {
    if (app) {
        app.showSection(sectionName);
    }
}

function showTaskModal(taskId = null) {
    if (app) {
        app.showTaskModal(taskId);
    }
}