import { db } from './db.js';

// ============ REGISTRATIONS ============

const getAllRegistrations = async () => {
    try {
        const [rows] = await db.query(
            `SELECT r.*, rm.room, b.name AS building_name
             FROM registrations r
             LEFT JOIN rooms rm ON r.room_id = rm.id
             LEFT JOIN buildings b ON rm.building_id = b.id
             ORDER BY r.created_at DESC`
        );
        return rows;
    } catch (err) {
        console.error('Lỗi lấy danh sách yêu cầu:', err);
        throw err;
    }
};

const getRegistrationById = async (id) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM registrations WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (err) {
        console.error('Lỗi lấy yêu cầu:', err);
        throw err;
    }
};

const addRegistration = async (full_name, phone, gender, roomId) => {
    try {
        const [room] = await db.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
        if (!room[0]) throw new Error('Phòng không tồn tại');

        const [result] = await db.query(
            'INSERT INTO registrations (full_name, phone, gender, room_id) VALUES (?, ?, ?, ?)',
            [full_name, phone, gender, roomId]
        );
        return result;
    } catch (err) {
        console.error('Lỗi thêm đăng ký:', err);
        throw err;
    }
};

const approveRegistration = async (regId, roomId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [rooms] = await conn.query(
            'SELECT * FROM rooms WHERE id = ? FOR UPDATE',
            [roomId]
        );
        const room = rooms[0];

        if (!room) throw new Error('Phòng không tồn tại');
        if (room.current_count >= room.capacity) {
            throw new Error('Phòng đã đầy');
        }

        await conn.query(
            'UPDATE registrations SET status = "approved", room_id = ? WHERE id = ?',
            [roomId, regId]
        );

        await conn.query(
            'UPDATE rooms SET current_count = current_count + 1 WHERE id = ?',
            [roomId]
        );

        await conn.commit();
        return { success: true };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

const rejectRegistration = async (regId) => {
    try {
        const [result] = await db.query(
            'UPDATE registrations SET status = "rejected" WHERE id = ?',
            [regId]
        );
        return result;
    } catch (err) {
        console.error('Lỗi từ chối:', err);
        throw err;
    }
};

// ============ BUILDINGS & ROOMS ============

const getAllBuildings = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM buildings');
        return rows;
    } catch (err) {
        console.error('Lỗi lấy tòa:', err);
        throw err;
    }
};

const getAllRoomsWithBuilding = async () => {
    try {
        const [rows] = await db.query(
            `SELECT rm.*, b.name AS building_name
             FROM rooms rm
             JOIN buildings b ON rm.building_id = b.id
             ORDER BY b.id, rm.room`
        );
        return rows;
    } catch (err) {
        console.error('Lỗi lấy danh sách phòng:', err);
        throw err;
    }
};

const getRoomsByBuilding = async (buildingId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM rooms WHERE building_id = ? ORDER BY room',
            [buildingId]
        );
        return rows;
    } catch (err) {
        console.error('Lỗi lấy phòng:', err);
        throw err;
    }
};

const getRegistrationsByRoom = async (roomId) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM registrations WHERE room_id = ? AND status = "approved"',
            [roomId]
        );
        return rows;
    } catch (err) {
        console.error('Lỗi lấy người trong phòng:', err);
        throw err;
    }
};

// ============ DASHBOARD ============

const getDashboardStats = async () => {
    try {
        const [[totals]] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(status = 'pending') AS pending,
                SUM(status = 'approved') AS approved,
                SUM(status = 'rejected') AS rejected
            FROM registrations
        `);

        const [[roomStats]] = await db.query(`
            SELECT COUNT(*) AS available_rooms
            FROM rooms
            WHERE current_count < capacity
        `);

        return { ...totals, ...roomStats };
    } catch (err) {
        console.error('Lỗi lấy dashboard:', err);
        throw err;
    }
};

const deleteRegistration = async (regId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [regs] = await conn.query(
            'SELECT * FROM registrations WHERE id = ? FOR UPDATE',
            [regId]
        );
        const reg = regs[0];
        if (!reg) throw new Error('Không tìm thấy đăng ký');

        // Nếu đang ở phòng (approved), giảm current_count trước khi xóa
        if (reg.room_id) {
            await conn.query(
                'UPDATE rooms SET current_count = current_count - 1 WHERE id = ? AND current_count > 0',
                [reg.room_id]
            );
        }

        await conn.query('DELETE FROM registrations WHERE id = ?', [regId]);

        await conn.commit();
        return { success: true };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

const addRegistrationByAdmin = async (full_name, phone, gender, roomId) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [rooms] = await conn.query(
            'SELECT * FROM rooms WHERE id = ? FOR UPDATE',
            [roomId]
        );
        const room = rooms[0];

        if (!room) throw new Error('Phòng không tồn tại');
        if (room.current_count >= room.capacity) {
            throw new Error('Phòng đã đầy');
        }

        const [result] = await conn.query(
            `INSERT INTO registrations (full_name, phone, gender, status, room_id)
             VALUES (?, ?, ?, 'approved', ?)`,
            [full_name, phone, gender, roomId]
        );

        await conn.query(
            'UPDATE rooms SET current_count = current_count + 1 WHERE id = ?',
            [roomId]
        );

        await conn.commit();
        return result;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

export {
    getAllRegistrations,
    getRegistrationById,
    addRegistration,
    approveRegistration,
    rejectRegistration,
    getAllBuildings,
    getRoomsByBuilding,
    getAllRoomsWithBuilding,
    getRegistrationsByRoom,
    getDashboardStats,
    deleteRegistration,
    addRegistrationByAdmin,
};