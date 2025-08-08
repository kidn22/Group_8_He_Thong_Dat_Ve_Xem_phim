document.addEventListener("DOMContentLoaded", () => {
    const selectedSeats = localStorage.getItem("selectedSeats");
    const totalPrice = parseInt(localStorage.getItem("totalPrice")) || 0;
    const fee = 3000;
    const orderTable = document.querySelector(".order-summary tbody");

    let standardCount = 0;
    let vipCount = 0;
    let standardTotal = 0;
    let vipTotal = 0;

    // Xóa dòng mẫu
    orderTable.innerHTML = "";

    if (selectedSeats) {
        const seatsArray = selectedSeats.split(',');
        seatsArray.forEach(seat => {
            const isVIP = seat[0] === 'D' || seat[0] === 'E';
            if (isVIP) {
                vipCount++;
                vipTotal += 90000;
            } else {
                standardCount++;
                standardTotal += 60000;
            }
        });

        if (standardCount > 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>Standard</td><td>${standardCount}</td><td>${standardTotal.toLocaleString()} đ</td>`;
            orderTable.appendChild(row);
        }

        if (vipCount > 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>VIP</td><td>${vipCount}</td><td>${vipTotal.toLocaleString()} đ</td>`;
            orderTable.appendChild(row);
        }
    }

    const feeRow = document.createElement("tr");
    feeRow.innerHTML = `<td>Phí tiện ích</td><td></td><td>${fee.toLocaleString()} đ</td>`;
    orderTable.appendChild(feeRow);

    const finalTotal = standardTotal + vipTotal + fee;
    const totalRow = document.createElement("tr");
    totalRow.classList.add("total");
    totalRow.innerHTML = `<td>Tổng</td><td></td><td>${finalTotal.toLocaleString()} đ</td>`;
    orderTable.appendChild(totalRow);

    const ticketInfo = document.querySelector(".ticket-info p");
    if (selectedSeats) {
        ticketInfo.innerHTML = `<strong>Mang Mẹ Đi Bộ</strong><br>
        Beta Trần Quang Khải<br>
        Suất <strong>17:15 06/08/2025</strong><br>
        Phòng chiếu <strong>P2</strong> – Ghế <strong>${selectedSeats}</strong>`;
    }

    document.querySelector(".total-amount strong").innerText = finalTotal.toLocaleString() + " đ";

    // ==== Hiển thị tên người dùng và nút đăng xuất nếu đã đăng nhập ====
    const fullName = localStorage.getItem("fullName");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userNameLink = document.getElementById("userNameLink");

    if (isLoggedIn && fullName && userNameLink) {
        userNameLink.textContent = fullName;
        userNameLink.href = "#";

        const logoutBtn = document.createElement("a");
        logoutBtn.textContent = "Đăng xuất";
        logoutBtn.href = "#";
        logoutBtn.style.marginLeft = "15px";
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("fullName");
            window.location.reload();
        });

        userNameLink.parentNode.appendChild(logoutBtn);
    }

    // ==== Xử lý nút xác nhận thanh toán ====
    const confirmBtn = document.getElementById("confirmBtn");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function (e) {
            e.preventDefault();

            if (!isLoggedIn) {
                // Nếu chưa đăng nhập thì chuyển sang trang login
                alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
                window.location.href = "../login/login.html";
                return;
            }

            // Nếu đã đăng nhập: thông báo thanh toán thành công
            alert("Cảm ơn bạn đã đặt vé! Thông tin sẽ được gửi qua email và số điện thoại.");
            localStorage.removeItem("selectedSeats");
            localStorage.removeItem("totalPrice");

            // Disable nút sau khi thanh toán
            confirmBtn.disabled = true;
            confirmBtn.innerText = "Đã thanh toán";
            confirmBtn.style.backgroundColor = "#888";
            confirmBtn.style.cursor = "not-allowed";
        });
    }
});
