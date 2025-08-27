document.addEventListener("DOMContentLoaded", () => {
  // ====== Utils ======
  const fmt = (n) => (Number(n) || 0).toLocaleString("vi-VN") + " đ";
  const $$ = (s, r=document) => r.querySelectorAll(s);
  const $  = (s, r=document) => r.querySelector(s);

  // ====== Input từ localStorage ======
  const selectedSeatsRaw = localStorage.getItem("selectedSeats") || "";
  const seatsArray = selectedSeatsRaw.split(",").map(s => s.trim()).filter(Boolean);
  const totalPrice = parseInt(localStorage.getItem("totalPrice"), 10) || 0;

  // Thông tin phim/suất/phòng/rạp (tuỳ bạn set ở trang trước)
  const movieTitle = localStorage.getItem("movieTitle") || "—";
  const showTime   = localStorage.getItem("showTime")   || "—";
  const room       = localStorage.getItem("room")       || "—";
  const cinema     = localStorage.getItem("cinema")     || "Beta Trần Quang Khải";

  // ====== Cấu hình giá & phí ======
  const PRICE_STANDARD = 60000;
  const PRICE_VIP = 90000;
  const VIP_ROWS = new Set(["D","E"]);
  const FEE = 3000; // theo yêu cầu: 3.000đ/đơn (không theo số vé)

  // ====== Tóm tắt đơn hàng ======
  const orderTableBody = document.querySelector(".order-summary tbody");
  orderTableBody.innerHTML = ""; // xoá dòng mẫu

  let standardCount = 0, vipCount = 0;
  let standardTotal = 0, vipTotal = 0;

  if (seatsArray.length) {
    for (const seat of seatsArray) {
      const row = seat[0]?.toUpperCase();
      const isVIP = VIP_ROWS.has(row);
      if (isVIP) { vipCount++; vipTotal += PRICE_VIP; }
      else { standardCount++; standardTotal += PRICE_STANDARD; }
    }
  }

  // Render các dòng nhóm
  if (standardCount > 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>Standard</td><td>${standardCount}</td><td>${fmt(standardTotal)}</td>`;
    orderTableBody.appendChild(tr);
  }
  if (vipCount > 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>VIP</td><td>${vipCount}</td><td>${fmt(vipTotal)}</td>`;
    orderTableBody.appendChild(tr);
  }

  // Nếu không có ghế (vào trực tiếp), hiển thị mẫu 1 vé Standard
  if (standardCount + vipCount === 0) {
    standardCount = 1; standardTotal = PRICE_STANDARD;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>Standard</td><td>1</td><td>${fmt(PRICE_STANDARD)}</td>`;
    orderTableBody.appendChild(tr);
  }

  // Phí tiện ích (mỗi đơn)
  const feeRow = document.createElement("tr");
  feeRow.innerHTML = `<td>Phí tiện ích</td><td></td><td>${fmt(FEE)}</td>`;
  orderTableBody.appendChild(feeRow);

  // Tổng cuối
  const finalTotal = standardTotal + vipTotal + FEE;
  const totalRow = document.createElement("tr");
  totalRow.classList.add("total");
  totalRow.innerHTML = `<td>Tổng</td><td>${standardCount + vipCount}</td><td>${fmt(finalTotal)}</td>`;
  orderTableBody.appendChild(totalRow);

  // Ghi vào phần tổng (tfoot)
  const grandTotalCell = $("#grandTotal");
  const totalQtyCell = $("#totalQty");
  if (grandTotalCell) grandTotalCell.textContent = fmt(finalTotal);
  if (totalQtyCell) totalQtyCell.textContent = String(standardCount + vipCount);

  // ====== Thông tin vé ======
  const ticketInfoP = document.querySelector(".ticket-info p");
  const seatsLabel = seatsArray.length ? seatsArray.join(", ") : "B7"; // fallback mẫu
  if (ticketInfoP) {
    ticketInfoP.innerHTML = `
      <strong>${movieTitle}</strong><br>
      ${cinema}<br>
      Suất <strong>${showTime}</strong><br>
      Phòng chiếu <strong>${room}</strong> – Ghế <strong>${seatsLabel}</strong>`;
  }

  const totalAmountStrong = document.querySelector(".total-amount strong");
  if (totalAmountStrong) totalAmountStrong.textContent = fmt(finalTotal);

  // ====== Hiển thị tên người dùng & nút đăng xuất ======
  const fullName   = localStorage.getItem("fullName");
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

    // Chèn sau link tên user
    userNameLink.parentNode.appendChild(logoutBtn);
  }

  // ====== Nút quay lại ======
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.addEventListener("click", () => history.back());

  // ====== Xử lý nút xác nhận thanh toán ======
  const confirmBtn = document.getElementById("confirmBtn");
  const infoForm   = document.getElementById("infoForm");

  if (confirmBtn) {
    confirmBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Chưa đăng nhập -> chuyển trang login
      if (!isLoggedIn) {
        alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
        window.location.href = "../login/login.html";
        return;
      }

      // Đã đăng nhập -> kiểm tra form hợp lệ
      if (infoForm && !infoForm.reportValidity()) {
        // Browser sẽ highlight trường lỗi
        return;
      }

      // Hoàn tất: lưu thông tin (tuỳ trang sau dùng), dọn state ghế
      const payload = {
        fullName: $("#fullName")?.value?.trim() || "",
        phone: $("#phone")?.value?.trim() || "",
        email: $("#email")?.value?.trim() || "",
        payment: (document.querySelector('input[name="payment"]:checked')?.value) || "qr",
        seats: seatsArray,
        movieTitle, showTime, room, cinema,
        total: finalTotal,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("checkoutInfo", JSON.stringify(payload));

      // Thông báo & dọn một số key
      alert("Cảm ơn bạn đã đặt vé! Thông tin sẽ được gửi qua email và số điện thoại.");
      localStorage.removeItem("selectedSeats");
      localStorage.removeItem("totalPrice");

      // Khóa nút
      confirmBtn.disabled = true;
      confirmBtn.innerText = "Đã thanh toán";
      confirmBtn.style.backgroundColor = "#888";
      confirmBtn.style.cursor = "not-allowed";

      // (Tuỳ chọn) điều hướng trang kết quả:
      // window.location.href = "payment.html";
    });
  }
});
