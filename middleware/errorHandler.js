const errorHandler = (err, req, res, next) => {
    // Only log the error if we are NOT running automated tests
    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }

    res.status(err.status || 500).json({
        message: err.message || "Server Error"
    });
};

module.exports = errorHandler;