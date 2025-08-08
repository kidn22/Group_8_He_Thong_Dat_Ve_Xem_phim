document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Lấy dữ liệu từ form
    const fullName = document.getElementById("fullName").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const resultDiv = document.getElementById("result");

    // Reset thông báo
    resultDiv.textContent = "";
    resultDiv.style.color = "red";

    // Kiểm tra dữ liệu
    if (!fullName || !gender || !phone.match(/^0\d{9}$/) || !username || !password || !confirmPassword) {
        resultDiv.textContent = "Vui lòng điền đầy đủ và đúng định dạng.";
        return;
    }

    if (password.length < 6) {
        resultDiv.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
        return;
    }

    if (password !== confirmPassword) {
        resultDiv.textContent = "Mật khẩu và xác nhận mật khẩu không khớp.";
        return;
    }

    try {
        // Gửi request tới Flask API
        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({fullName, gender, phone, username, password})
        });

        const data = await res.json();

        if (!res.ok) {
            // Thông báo lỗi từ server
            resultDiv.textContent = data.error || "Đăng ký thất bại!";
        } else {
            // Thành công
            resultDiv.style.color = "green";
            resultDiv.textContent = "Đăng ký thành công!";
// Lưu họ tên vào localStorage
            localStorage.setItem("fullName", fullName);
            // Chuyển sang trang chủ sau 1.5 giây
            setTimeout(() => {
                window.location.href = "../Checkout/checkout.html";
            }, 1500);
        }
    } catch (err) {
        console.error("Lỗi:", err);
        resultDiv.textContent = "Không kết nối được server!";
    }
});
document.addEventListener("DOMContentLoaded", () => {
    fetch("../Homepage/header.html") // đường dẫn đến file header
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            // Sau khi load xong header, đổi Login thành tên nếu có
            const fullName = localStorage.getItem("fullName");
            const userNameLink = document.getElementById("userNameLink");
            if (fullName) {
                userNameLink.textContent = fullName;
                userNameLink.href = "#";
            }
        })
        .catch(err => console.error("Lỗi load header:", err));
});
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("username", "Nguyen Van A");
