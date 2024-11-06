import * as yup from 'yup';

export const schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm không được để trống'),
    price: yup.number().required('Giá sản phẩm không được để trống').typeError('Giá sản phẩm phải là số'),
    discount: yup.number().typeError('Giảm giá phải là số').transform((value, originalValue) => originalValue === '' ? 0 : value).min(0, 'Giảm giá phải là số hợp lệ'),
    description: yup.string().required('Mô tả sản phẩm không được để trống'),
    categoryId: yup.object({
        value: yup.string().required("Vui lòng chọn danh mục sản phẩm"),
      }),
    sizes: yup.array().min(1, "Vui lòng chọn ít nhất 1 kích thước").of(
        yup.string().required("Vui lòng chọn ít nhất 1 kích thước")
    ).required(),
    numberOfColor: yup.string().required('Số lượng màu sắc không được để trống').typeError('Số lượng màu sắc phải là số'),
    colors: yup.array().of(
        yup.string().matches(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i, 'Màu sắc phải là mã màu hợp lệ')
    ).required(),
    imgUrls: yup.array().of(
        yup.string().url("Đường dẫn hình ảnh không hợp lệ")
    ).required("Vui lòng cung cấp hình ảnh"),
    stocks: yup.array().of(
        yup.number().min(0, "Số lượng hàng phải hợp lệ").required("Vui lòng cung cấp số lượng hàng")
    ).required("Vui lòng cung cấp số lượng hàng")
});