import express from 'express';
const router = express.Router();
import {
    getLogin, postLogin, getLogout,
    getDashboard,
    getYeuCau, postDuyet, postTuChoi,
    getPhong, getPhongDetail
} from '../src/controllers/admin.controller.js';
import requireAuth from '../src/middlewares/auth.middleware.js';

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', getLogout);

router.get('/dashboard', requireAuth, getDashboard);

router.get('/yeu-cau', requireAuth, getYeuCau);
router.post('/yeu-cau/:id/duyet', requireAuth, postDuyet);
router.post('/yeu-cau/:id/tu-choi', requireAuth, postTuChoi);

router.get('/phong', requireAuth, getPhong);
router.get('/phong/:id', requireAuth, getPhongDetail);

export default router;