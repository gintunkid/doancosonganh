document.addEventListener("DOMContentLoaded", function() {
    // Định nghĩa URL API với tham số depth=2
    const apiUrl = 'https://provinces.open-api.vn/api/?depth=2';

    // Lấy dropdown tỉnh thành và quận/huyện
    const provinceDropdown = document.getElementById('provinceDropdown');
    const districtDropdown = document.getElementById('districtDropdown');

    // Lấy danh sách tỉnh thành từ API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dữ liệu tỉnh thành:', data);

            if (Array.isArray(data)) {
                // Thêm các tỉnh thành vào dropdown
                data.forEach(province => {
                    const option = document.createElement('option');
                    option.value = province.code;
                    option.textContent = province.name;
                    provinceDropdown.appendChild(option);
                });
            } else {
                console.error("Dữ liệu không hợp lệ:", data);
            }
        })
        .catch(error => {
            console.error('Có lỗi khi lấy dữ liệu từ API:', error);
        });

    // Sự kiện khi tỉnh thành được chọn
    provinceDropdown.addEventListener('change', function() {
        const provinceCode = this.value; // Mã tỉnh thành được chọn

        // Nếu không có tỉnh thành nào được chọn, xóa danh sách quận/huyện
        if (!provinceCode) {
            districtDropdown.innerHTML = '<option value="">--Chọn quận/huyện--</option>';
            return;
        }

        // Lấy danh sách quận/huyện cho tỉnh đã chọn
        fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            .then(response => response.json())
            .then(data => {
                console.log('Dữ liệu quận/huyện:', data);
                // Xóa các option cũ trong districtDropdown
                districtDropdown.innerHTML = '<option value="">--Chọn quận/huyện--</option>';

                // Thêm quận/huyện vào dropdown
                if (data.districts && Array.isArray(data.districts)) {
                    data.districts.forEach(district => {
                        const option = document.createElement('option');
                        option.value = district.code;
                        option.textContent = district.name;
                        districtDropdown.appendChild(option);
                    });
                } else {
                    console.error("Dữ liệu quận/huyện không hợp lệ:", data);
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy quận/huyện:', error);
            });
    });
});
