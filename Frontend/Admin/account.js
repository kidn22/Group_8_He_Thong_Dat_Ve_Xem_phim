let accountsData = db.load('accountsData');
const accountList = document.getElementById('account-list');
const addAccountForm = document.getElementById('add-account-form');

function renderAccountsTable() {
    accountList.innerHTML = '';
    accountsData.forEach((account, index) => {
        const newRow = document.createElement('tr');
        newRow.className = 'bg-white border-b';
        newRow.innerHTML = `
            <td class="py-3 px-6 font-medium text-gray-900">${account.username}</td>
            <td class="py-3 px-6 capitalize">${account.role}</td>
            <td class="py-3 px-6 space-x-2">
                <button class="btn-toggle-role bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors" data-index="${index}">
                    ${account.role === 'admin' ? 'Hạ quyền' : 'Nâng quyền'}
                </button>
                <button class="btn-delete-account bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors" data-index="${index}">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        `;
        accountList.appendChild(newRow);
    });
    document.querySelectorAll('.btn-toggle-role').forEach(button => {
        button.addEventListener('click', toggleRole);
    });
    document.querySelectorAll('.btn-delete-account').forEach(button => {
        button.addEventListener('click', deleteAccount);
    });
}
addAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (accountsData.some(acc => acc.username === username)) {
        showModal('Lỗi', 'Tên đăng nhập đã tồn tại!', [{ text: 'Đóng', class: 'bg-gray-200 text-gray-700 hover:bg-gray-300' }]);
        return;
    }
    const newAccount = { username, password, role };
    accountsData.push(newAccount);
    db.save('accountsData', accountsData);
    renderAccountsTable();
    addAccountForm.reset();
});
function toggleRole(e) {
    const index = e.target.dataset.index;
    accountsData[index].role = accountsData[index].role === 'admin' ? 'user' : 'admin';
    db.save('accountsData', accountsData);
    renderAccountsTable();
}
function deleteAccount(e) {
    const index = e.target.dataset.index;
    showModal('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa tài khoản này không?', [
        {
            text: 'Hủy',
            class: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        },
        {
            text: 'Xóa',
            class: 'bg-red-500 text-white hover:bg-red-600',
            callback: () => {
                accountsData.splice(index, 1);
                db.save('accountsData', accountsData);
                renderAccountsTable();
            }
        }
    ]);
}