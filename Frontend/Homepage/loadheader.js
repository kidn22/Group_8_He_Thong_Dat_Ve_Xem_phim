document.addEventListener("DOMContentLoaded", () => {
    fetch("../Homepage/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            const fullName = localStorage.getItem("fullName");
            const userNameLink = document.getElementById("userNameLink");
            const logoutLink = document.getElementById("logoutLink");

            if (fullName && userNameLink) {
                // Nếu đã đăng nhập -> hiện tên và bật logout
                userNameLink.textContent = fullName;
                userNameLink.href = "#";

                if (logoutLink) {
                    logoutLink.style.display = "inline";
                    logoutLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        localStorage.clear();
                        window.location.href = "../Login/login.html";
                    });
                }
            } else {
                // Nếu chưa đăng nhập -> để userNameLink trỏ tới Login, ẩn logout
                if (userNameLink) {
                    userNameLink.textContent = "Login";
                    userNameLink.href = "../Login/login.html";
                }
                if (logoutLink) {
                    logoutLink.style.display = "none";
                }
            }
        })
        .catch(err => console.error("Lỗi load header:", err));
});
