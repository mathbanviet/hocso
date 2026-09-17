// File: app.js

// Hàm chuẩn hóa tiếng Việt không dấu (để tìm kiếm không bị lỗi dấu)
const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, m => m === 'đ' ? 'd' : 'D').toLowerCase().trim();

// Hàm xuất tài liệu ra giao diện HTML
function renderDocuments(dataToRender) {
    const container = document.getElementById('data-container');
    document.getElementById('countDisplay').innerText = dataToRender.length;
    container.innerHTML = '';

    if (!dataToRender || dataToRender.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; background: #fff; border-radius: 8px;">
                <h3 style="color: #666;">Không tìm thấy tài liệu phù hợp!</h3>
                <p style="font-size: 14px; color: #999;">Hãy thử dùng từ khóa khác hoặc xóa bộ lọc.</p>
            </div>`;
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    // Tạm thời hiển thị 30 tài liệu đầu tiên
    const displayData = dataToRender.slice(0, 30);
    
    displayData.forEach(item => {
        let badgesHTML = '<span class="badge new">Cập nhật mới</span>';
        
        if (item.loai && item.loai.toLowerCase().includes('đề')) {
            badgesHTML += ' <span class="badge word">📄 Bản Word (GV)</span>';
            badgesHTML += ' <span class="badge matran">✅ Kèm Ma Trận</span>';
        } else {
            badgesHTML += ' <span class="badge pdf">📕 PDF (HS)</span>';
        }

        const card = document.createElement('div');
        card.className = 'd10-doc-card';
        card.innerHTML = `
            <div class="d10-badges">${badgesHTML}</div>
            <h3 style="margin: 10px 0; color: var(--primary-color); font-size: 18px; line-height: 1.4;">${item.ten}</h3>
            <p style="margin: 5px 0; font-size: 13px; color: #555; background: #f8f9fa; padding: 5px 10px; border-radius: 4px; display: inline-block;">
                Biên soạn: <strong>${item.nguoi_dang || 'Phòng Đào Tạo'}</strong> | Môn: <strong>${item.mon || 'Khác'}</strong> | Khối: <strong>${item.khoi || 'Khác'}</strong>
            </p>
            <p style="font-size: 14px; line-height: 1.5; color: #444;">${item.mo_ta || 'Tài liệu lưu hành nội bộ Hệ thống Điểm 10+.'}</p>
            
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button onclick="window.open('${item.drive_preview}', '_blank')" style="background: var(--primary-color); color: #fff; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 5px;">
                    👁️ Xem / Đọc thử
                </button>
                <button onclick="alert('Vui lòng kết nối Zalo Giáo Viên để tải bản gốc!');" style="background: #e9ecef; color: #333; border: 1px solid #ced4da; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    📥 Nhận file gốc
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    if(dataToRender.length > 30) {
        document.getElementById('pagination').style.display = 'block';
    } else {
        document.getElementById('pagination').style.display = 'none';
    }
}

// Hàm thực thi tìm kiếm qua text
function executeSearch() {
    const keyword = norm(document.getElementById('searchInput').value);
    if (!keyword) {
        renderDocuments(DEMO_DATA);
        return;
    }

    const filtered = DEMO_DATA.filter(item => {
        const ten = norm(item.ten);
        const mota = norm(item.mo_ta);
        const mon = norm(item.mon);
        return ten.includes(keyword) || mota.includes(keyword) || mon.includes(keyword);
    });

    renderDocuments(filtered);
}

// Lắng nghe sự kiện "Enter" trên ô input
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') executeSearch();
});

// Lắng nghe sự kiện tick Checkbox/Radio ở Sidebar
const checkboxes = document.querySelectorAll('.d10-sidebar input[type="checkbox"], .d10-sidebar input[type="radio"]');
checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        const keyword = cb.parentElement.innerText.trim();
        document.getElementById('searchInput').value = keyword;
        executeSearch();
    });
});

// Khởi tạo web khi vừa load xong
window.onload = () => {
    if (typeof DEMO_DATA === 'undefined' || DEMO_DATA.length === 0) {
        document.getElementById('data-container').innerHTML = `
            <div style="text-align: center; padding: 50px; background: #fff; border-radius: 8px; border: 2px dashed #dc3545;">
                <h3 style="color: #dc3545;">Lỗi: Chưa có dữ liệu!</h3>
                <p style="font-size: 15px; color: #333;">Thầy vui lòng mở file <strong>data.js</strong> và dán mảng DEMO_DATA vào nhé.</p>
            </div>`;
    } else {
        renderDocuments(DEMO_DATA);
    }
};