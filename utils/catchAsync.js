const catchAsync = (fn) => {
    return (req, res, next) => {
        // This catches any rejected promise and passes it to your errorHandler.js
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = catchAsync;