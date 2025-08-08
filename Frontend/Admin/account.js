const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const accountList = document.getElementById("account-list");

let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const gender = document.getElementById("gender").value;
    const phone = document.getElementById("phone").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    if (accounts.some(acc => acc.username === username)) {
        alert("Tài khoản đã tồn tại!");
        return;
    }

    const account = { fullname, gender, phone, username, password };
    accounts.push(account);

    localStorage.setItem("accounts", JSON.stringify(accounts));

    renderAccounts();
    registerForm.reset();
    alert("Đăng ký thành công!");
});

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const loginUsername = document.getElementById("loginUsername").value.trim();
    const loginPassword = document.getElementById("loginPassword").value;

    const account = accounts.find(acc => acc.username === loginUsername && acc.password === loginPassword);

    if (account) {
        alert(`Xin chào ${account.fullname}, bạn đã đăng nhập thành công!`);
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }

    loginForm.reset();
});

function renderAccounts() {
    accountList.innerHTML = "";
    accounts.forEach(acc => {
        const row = `<tr>
            <td class="py-2 px-6">${acc.fullname}</td>
            <td class="py-2 px-6">${acc.gender}</td>
            <td class="py-2 px-6">${acc.phone}</td>
            <td class="py-2 px-6">${acc.username}</td>
        </tr>`;
        accountList.innerHTML += row;
    });
}
renderAccounts();