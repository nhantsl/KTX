import { getUser } from '../../models/db.js';
import {
    getAllRegistrations, getRegistrationById,
    approveRegistration, rejectRegistration,
    getAllBuildings, getRoomsByBuilding,
    getAllRoomsWithBuilding, getRegistrationsByRoom,
    getDashboardStats
} from '../../models/dormModel.js';

// ============ AUTH ============

async function getLogin(req, res) {
    res.render('admin/login', { error: null });
}

async function postLogin(req, res) {
    try {
        const { username, password } = req.body;
        const rows = await getUser(username, password);

        if (rows.length === 0) {
            return res.render('admin/login', { error: 'Sai tài khoản hoặc mật khẩu' });
        }

        req.session.user = { id: rows[0].id, username: rows[0].username };
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Lỗi login:', err);
        res.render('admin/login', { error: 'Có lỗi xảy ra, vui lòng thử lại' });
    }
}

async function getLogout(req, res) {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
}

// ============ DASHBOARD ============

async function getDashboard(req, res) {
    try {
        const stats = await getDashboardStats();
        res.render('admin/dashboard', { stats, user: req.session.user });
    } catch (err) {
        console.error('Lỗi dashboard:', err);
        res.status(500).send('Lỗi server');
    }
}

// ============ YÊU CẦU ============

async function getYeuCau(req, res) {
    try {
        const registrations = await getAllRegistrations();
        const buildings = await getAllBuildings();

        // Lấy phòng cho từng tòa để render select trong view
        const roomsByBuilding = {};
        for (const b of buildings) {
            roomsByBuilding[b.id] = await getRoomsByBuilding(b.id);
        }

        const flash = req.session.flash;
        delete req.session.flash;

        res.render('admin/yeu-cau', {
            registrations,
            buildings,
            roomsByBuilding,
            user: req.session.user,
            flash
        });
    } catch (err) {
        console.error('Lỗi lấy yêu cầu:', err);
        res.status(500).send('Lỗi server');
    }
}

async function postDuyet(req, res) {
    try {
        const regId = req.params.id;
        const { room_id } = req.body;

        if (!room_id) {
            req.session.flash = 'Vui lòng chọn phòng';
            return res.redirect('/admin/yeu-cau');
        }

        await approveRegistration(regId, room_id);
        req.session.flash = 'Duyệt thành công';
        res.redirect('/admin/yeu-cau');
    } catch (err) {
        console.error('Lỗi duyệt:', err);
        req.session.flash = err.message === 'Phòng đã đầy' ? 'Phòng đã đầy, vui lòng chọn phòng khác' : 'Có lỗi xảy ra';
        res.redirect('/admin/yeu-cau');
    }
}

async function postTuChoi(req, res) {
    try {
        const regId = req.params.id;
        await rejectRegistration(regId);
        res.redirect('/admin/yeu-cau');
    } catch (err) {
        console.error('Lỗi từ chối:', err);
        res.redirect('/admin/yeu-cau');
    }
}

// ============ PHÒNG ============

async function getPhong(req, res) {
    try {
        const rooms = await getAllRoomsWithBuilding();
        res.render('admin/phong', { rooms, user: req.session.user });
    } catch (err) {
        console.error('Lỗi lấy phòng:', err);
        res.status(500).send('Lỗi server');
    }
}

async function getPhongDetail(req, res) {
    try {
        const roomId = req.params.id;
        const occupants = await getRegistrationsByRoom(roomId);
        res.render('admin/phong-detail', { occupants, roomId, user: req.session.user });
    } catch (err) {
        console.error('Lỗi lấy chi tiết phòng:', err);
        res.status(500).send('Lỗi server');
    }
}

export {
    getLogin, postLogin, getLogout,
    getDashboard,
    getYeuCau, postDuyet, postTuChoi,
    getPhong, getPhongDetail
};