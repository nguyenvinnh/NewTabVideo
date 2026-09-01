document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các module theo thứ tự phụ thuộc
    Background.init();
    SettingsUI.init();
    Position.init();
    Drag.init();
    Search.init();

    // Gán sự kiện cho input file
    document.getElementById('bg-file-input').addEventListener('change', (e) => {
        Background.handleFileSelect(e);
    });

    console.log('Tab mới đã sẵn sàng!');
});