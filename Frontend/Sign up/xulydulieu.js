document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Ngăn submit thật

  const fullName = document.getElementById("fullName").value.trim();
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value.trim();

  // Kiểm tra dữ liệu đầu vào
  if (!fullName || !gender || !phone.match(/^0\d{9}$/)) {
    alert("Vui lòng nhập đầy đủ và đúng định dạng!");
    return;
  }

  // Hiển thị kết quả tạm thời (ở thực tế sẽ gửi đến server)
  const result = `
    ✅ Đăng ký thành công!<br>
    👤 Họ tên: ${fullName}<br>
    🚻 Giới tính: ${gender}<br>
    ☎️ Số điện thoại: ${phone}
  `;
  document.getElementById("result").innerHTML = result;

  // Reset form
  document.getElementById("registerForm").reset();
});
