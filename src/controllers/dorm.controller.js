import { addRegistration } from '../../models/dormModel.js';

async function getHome(req, res) {
    res.render('home');
}

async function getGioiThieu(req, res) {
    res.render('gioi-thieu');
}

async function getNoiQuy(req, res) {
    res.render('noi-quy');
}

async function getDangKy(req, res) {
    res.render('dang-ky', { error: null });
}

async function postDangKy(req, res) {
    try {
        const { full_name, phone, gender } = req.body;

        if (!full_name || !phone || !gender) {
            return res.render('dang-ky', { error: 'Vui lòng điền đầy đủ thông tin.' });
        }

        await addRegistration(full_name.trim(), phone.trim(), gender);

        res.render('dang-ky-thanh-cong');
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        res.render('dang-ky', { error: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
}

export { getHome, getGioiThieu, getNoiQuy, getDangKy, postDangKy };