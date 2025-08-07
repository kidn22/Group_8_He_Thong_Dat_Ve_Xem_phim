// --- KHAI BÁO BIẾN & HÀM CHUNG ---
const danhmucItems = document.querySelectorAll('.danhmuc__items');
const contentSections = document.querySelectorAll('.content-section');

// Các biến cho modal
const customModal = document.getElementById('custom-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalButtons = document.getElementById('modal-buttons');

// Đối tượng đơn giản để quản lý Local Storage
const db = {
    // Tải dữ liệu từ Local Storage hoặc trả về mảng rỗng nếu không có
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Lỗi khi tải dữ liệu cho khóa: ${key}`, error);
            return [];
        }
    },
    // Lưu dữ liệu vào Local Storage
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Lỗi khi lưu dữ liệu cho khóa: ${key}`, error);
        }
    }
};

/**
 * Hiển thị modal với nội dung và các nút tùy chỉnh.
 * @param {string} title - Tiêu đề của modal.
 * @param {string} message - Nội dung thông báo.
 * @param {Array<Object>} buttons - Mảng các nút, mỗi object có text và callback.
 */
function showModal(title, message, buttons) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalButtons.innerHTML = '';
    buttons.forEach(btnConfig => {
        const button = document.createElement('button');
        button.textContent = btnConfig.text;
        button.className = `py-2 px-4 rounded-md transition-colors ${btnConfig.class}`;
        button.addEventListener('click', () => {
            if (btnConfig.callback) {
                btnConfig.callback();
            }
            hideModal();
        });
        modalButtons.appendChild(button);
    });
    customModal.style.display = 'flex';
}

// Ẩn modal
function hideModal() {
    customModal.style.display = 'none';
}

// Hàm hỗ trợ thêm số 0
function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Hàm xử lý chuyển đổi nội dung
function switchContent(contentId) {
    contentSections.forEach(content => {
        content.classList.remove('active');
    });
    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}
// Xử lý chuyển đổi các mục trong sidebar
document.querySelectorAll('.danhmuc__items').forEach(item => {
    item.addEventListener('click', () => {
        // Xóa active khỏi tất cả các mục
        document.querySelectorAll('.danhmuc__items').forEach(i => i.classList.remove('active'));

        // Ẩn toàn bộ content
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

        // Thêm active vào mục được click
        item.classList.add('active');

        // Hiển thị content tương ứng
        const contentId = item.dataset.content;
        const sectionToShow = document.getElementById(contentId);
        if (sectionToShow) sectionToShow.classList.add('active');
    });
});
