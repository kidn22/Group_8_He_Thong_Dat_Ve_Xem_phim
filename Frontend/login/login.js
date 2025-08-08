document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Đăng nhập thất bại");
            return;
        }

        // Lưu thông tin user vào localStorage
        localStorage.setItem("fullName", data.account.fullName);
        localStorage.setItem("username", data.account.username);
        localStorage.setItem("isLoggedIn", "true");


        alert(data.message || "Đăng nhập thành công!");

        // Chuyển hướng về trang chủ
        if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            window.location.href = "../Homepage/index.html";
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("Không thể kết nối server!");
    }
});
///

document.addEventListener("DOMContentLoaded", () => {
    fetch("../Homepage/header.html") // đường dẫn đến file header
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            // Sau khi load xong header, đổi Login thành tên nếu có

            const userNameLink = document.getElementById("userNameLink");
            if (fullName) {
                userNameLink.textContent = fullName;
                userNameLink.href = "#";
            }
        })
        .catch(err => console.error("Lỗi load header:", err));
});