document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Kiểm tra dữ liệu
  if (!fullName || !gender || !phone.match(/^0\d{9}$/) || !username || !password || !confirmPassword) {
    alert("Vui lòng điền đầy đủ và đúng định dạng.");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu và xác nhận mật khẩu không khớp.");
    return;
  }

  const resultHTML = `
    ✅ Đăng ký thành công!<br>
    👤 Họ tên: ${fullName}<br>
    🚻 Giới tính: ${gender}<br>
    ☎️ Số điện thoại: ${phone}<br>
    🧑‍💻 Tài khoản: ${username}
  `;
  document.getElementById("result").innerHTML = resultHTML;

  this.reset();
});
