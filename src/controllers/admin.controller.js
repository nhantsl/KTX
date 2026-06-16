import { getUser } from '../../models/db.js';
import {
    getAllRegistrations, getRegistrationById,
    approveRegistration, rejectRegistration,
    getAllBuildings, getRoomsByBuilding,
    getAllRoomsWithBuilding, getRegistrationsByRoom,
    getDashboardStats, deleteRegistration, addRegistrationByAdmin,
} from '../../models/dormModel.js';
import { redirectWithFlash } from '../middlewares/flash.middleware.js';

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
        res.redirect('/');
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
        const roomsByBuilding = {};
        for (const b of buildings) {
            roomsByBuilding[b.id] = await getRoomsByBuilding(b.id);
        }

        res.render('admin/yeu-cau', {
            registrations,
            buildings,
            roomsByBuilding,
            user: req.session.user,
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
            return redirectWithFlash(req, res, '/admin/yeu-cau');
        }

        await approveRegistration(regId, room_id);
        req.session.flash = 'Duyệt thành công';
        return redirectWithFlash(req, res, '/admin/yeu-cau');
    } catch (err) {
        console.error('Lỗi duyệt:', err);
        req.session.flash = err.message === 'Phòng đã đầy' ? 'Phòng đã đầy, vui lòng chọn phòng khác' : 'Có lỗi xảy ra';
        return redirectWithFlash(req, res, '/admin/yeu-cau');
    }
}

async function postTuChoi(req, res) {
    try {
        const regId = req.params.id;
        await rejectRegistration(regId);
        req.session.flash = 'Đã từ chối yêu cầu';
        redirectWithFlash(req, res, '/admin/yeu-cau');
    } catch (err) {
        console.error('Lỗi từ chối:', err);
        req.session.flash = 'Có lỗi xảy ra';
        redirectWithFlash(req, res, '/admin/yeu-cau');
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
        res.render('admin/phong-detail', { occupants, roomId, user: req.session.user});
    } catch (err) {
        console.error('Lỗi lấy chi tiết phòng:', err);
        res.status(500).send('Lỗi server');
    }
}

async function postXoa(req, res) {
    try {
        const regId = req.params.id;
        const reg = await getRegistrationById(regId);
        const roomId = reg?.room_id;

        await deleteRegistration(regId);
        req.session.flash = 'Đã xóa sinh viên';

        if (roomId) {
            return redirectWithFlash(req, res, `/admin/phong/${roomId}`);
        }
        redirectWithFlash(req, res, '/admin/yeu-cau');
    } catch (err) {
        console.error('Lỗi xóa:', err);
        req.session.flash = 'Có lỗi xảy ra khi xóa';
        redirectWithFlash(req, res, '/admin/phong');
    }
}

async function getThemSinhVien(req, res) {
    try {
        const buildings = await getAllBuildings();
        const roomsByBuilding = {};
        for (const b of buildings) {
            roomsByBuilding[b.id] = await getRoomsByBuilding(b.id);
        }
        res.render('admin/them-sinh-vien', { buildings, roomsByBuilding, error: null });
    } catch (err) {
        console.error('Lỗi tải form:', err);
        res.status(500).send('Lỗi server');
    }
}

async function postThemSinhVien(req, res) {
    try {
        const { full_name, phone, gender, room_id } = req.body;

        if (!full_name || !phone || !gender || !room_id) {
            const buildings = await getAllBuildings();
            const roomsByBuilding = {};
            for (const b of buildings) {
                roomsByBuilding[b.id] = await getRoomsByBuilding(b.id);
            }
            return res.render('admin/them-sinh-vien', {
                buildings, roomsByBuilding,
                error: 'Vui lòng điền đầy đủ thông tin.'
            });
        }

        await addRegistrationByAdmin(full_name.trim(), phone.trim(), gender, room_id);
        req.session.flash = 'Đã thêm sinh viên thành công';
        redirectWithFlash(req, res, `/admin/phong/${room_id}`);
    } catch (err) {
        console.error('Lỗi thêm sinh viên:', err);
        const buildings = await getAllBuildings();
        const roomsByBuilding = {};
        for (const b of buildings) {
            roomsByBuilding[b.id] = await getRoomsByBuilding(b.id);
        }
        res.render('admin/them-sinh-vien', {
            buildings, roomsByBuilding,
            error: err.message === 'Phòng đã đầy' ? 'Phòng đã đầy, vui lòng chọn phòng khác' : 'Có lỗi xảy ra'
        });
    }
}

export {
    getLogin, postLogin, getLogout,
    getDashboard,
    getYeuCau, postDuyet, postTuChoi,
    getPhong, getPhongDetail,
    postXoa, getThemSinhVien, postThemSinhVien
};