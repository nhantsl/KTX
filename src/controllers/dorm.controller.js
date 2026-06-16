import { addRegistration, getAllRoomsWithBuilding, getRegistrationsByRoom } from '../../models/dormModel.js';
import { redirectWithFlash } from '../middlewares/flash.middleware.js';

async function getHome(req, res) {
    try {
        const rooms = await getAllRoomsWithBuilding();
        res.render('home', { rooms, user: req.session.user});
    } catch (err) {
        console.error('Lỗi lấy phòng:', err);
        res.status(500).send('Lỗi server');
    }
}

const getPhongDetail = async (req, res) => {
    try {
        const roomId = req.params.id;
        const occupants = await getRegistrationsByRoom(roomId);
        res.render('phong-detail', { occupants, roomId, user: req.session.user });
    } catch (err) {
        console.error('Lỗi lấy chi tiết phòng:', err);
        res.status(500).send('Lỗi server');
    }
}

async function getDangKy(req, res){
    try {
        const rooms = await getAllRoomsWithBuilding();

        res.render("dang-ky", {
            rooms, user: req.session.user,error: null
        });
    } catch (err) {
        console.log('Lỗi lấy phòng:', err);
        res.sendStatus(500).send('Lỗi server');
    }
};


async function postDangKy(req, res) {
    try {
        const { full_name, phone, gender, room_id } = req.body;

        if (!full_name || !phone || !gender || !room_id) {
            const rooms = await getAllRoomsWithBuilding();
            return res.render("dang-ky", {
                rooms, user: req.session.user,
                error: "Vui lòng điền đầy đủ thông tin và chọn phòng."
            });
        }

        await addRegistration(full_name.trim(), phone.trim(), gender, room_id);
        req.session.flash = 'Đăng ký thành công. Vui lòng chờ Admin duyệt.';
        redirectWithFlash(req, res, '/');
    } catch (err) {
        console.error("Lỗi đăng ký:", err);
        const rooms = await getAllRoomsWithBuilding();
        res.render("dang-ky", {
            rooms, user: req.session.user,
            error: "Có lỗi xảy ra, vui lòng thử lại."
        });
    }
}

export { getHome, getDangKy, postDangKy ,getPhongDetail};