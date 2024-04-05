export function formatNumber(number) {
    // Chuyển số thành chuỗi và đảo ngược chuỗi
    let numberStr = String(number).split('').reverse().join('');

    // Tạo một mảng để lưu các phần đã được định dạng
    let formattedParts = [];

    // Duyệt qua chuỗi số và chia thành các phần có 3 chữ số
    for (let i = 0; i < numberStr.length; i += 3) {
        formattedParts.push(numberStr.substr(i, 3));
    }

    // Kết hợp các phần đã được định dạng bằng dấu phẩy và đảo ngược lại
    let formattedNumber = formattedParts.join(' ').split('').reverse().join('');

    return formattedNumber;
}