const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const accountList = document.getElementById("account-list");

// ======== Đăng ký ========
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        fullName: document.getElementById("fullname").value.trim(),
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    if (data.password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resData => {
        if (resData.error) {
            alert(resData.error);
        } else {
            alert("Đăng ký thành công!");
            registerForm.reset();
            loadAccounts();
        }
    })
    .catch(err => console.error("Lỗi đăng ký:", err));
});

// ======== Đăng nhập ========
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        username: document.getElementById("loginUsername").value.trim(),
        password: document.getElementById("loginPassword").value.trim()
    };

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resData => {
        if (resData.error) {
            alert(resData.error);
        } else {
            alert(`Xin chào ${resData.account.fullName}, bạn đã đăng nhập thành công!`);
        }
    })
    .catch(err => console.error("Lỗi đăng nhập:", err));

    loginForm.reset();
});

// ======== Render danh sách tài khoản ========
function loadAccounts() {
    fetch("http://localhost:3000/accounts")
        .then(response => response.json())
        .then(accounts => {
            accountList.innerHTML = "";
            accounts.forEach(account => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td class="py-3 px-6">${account.fullName}</td>
                    <td class="py-3 px-6">${account.gender}</td>
                    <td class="py-3 px-6">${account.phone}</td>
                    <td class="py-3 px-6">${account.username}</td>
                `;
                accountList.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải danh sách tài khoản:", error);
        });
}

document.addEventListener("DOMContentLoaded", loadAccounts);
