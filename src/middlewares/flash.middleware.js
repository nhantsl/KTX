export default function flashMiddleware(req, res, next) {
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
}

export function redirectWithFlash(req, res, url) {
    req.session.save(() => res.redirect(url));
}