export const formatPrice = (price: number) => {
    return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', currencyDisplay: 'code' }).format(price);
}