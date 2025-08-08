document.addEventListener("DOMContentLoaded", () => {
    fetch("../Homepage/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            const fullName = localStorage.getItem("fullName");
            const userNameLink = document.getElementById("userNameLink");
            const logoutLink = document.getElementById("logoutLink");

            if (fullName && userNameLink) {
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
            }
        })
        .catch(err => console.error("Lỗi load header:", err));
});
