document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const gender = document.getElementById("gender").value;
  const phone = document.getElementById("phone").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Kiểm tra rỗng và định dạng
  if (!fullName || !gender || !phone.match(/^0\d{9}$/) || !username || !password || !confirmPassword) {
    alert("Vui lòng điền đầy đủ thông tin và đúng định dạng.");
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

  // Hiển thị thông tin tạm thời
  const resultHTML = `
    ✅ Đăng ký thành công!<br>
    👤 Họ tên: ${fullName}<br>
    🚻 Giới tính: ${gender}<br>
    ☎️ SĐT: ${phone}<br>
    🧑‍💻 Tài khoản: ${username}
  `;
  document.getElementById("result").innerHTML = resultHTML;

  // Reset form
  this.reset();
});
