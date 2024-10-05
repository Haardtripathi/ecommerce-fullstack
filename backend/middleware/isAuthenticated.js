exports.isAuthenticated = (req, res, next) => {
    console.log(req.session)
    if (req.session && req.session.isAuthenticated) {
        console.log(req.session.isAuthenticated)
        console.log('User is authenticated');
        return next();
    } else {
        console.log('User is not authenticated');
        return res.status(401).json({ message: 'Unauthorized access' });
    }
};

