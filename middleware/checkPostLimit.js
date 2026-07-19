const subscriptionModel = require("../models/subscriptionModel");
const postModel = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");

const checkPostLimit = catchAsync(async (req, res, next) => {
    // 1. Admins bypass limits completely
    if (req.user.role === "admin") {
        return next();
    }

    // 2. Fetch the user's subscription tier
    const [subscriptions] = await subscriptionModel.getSubscriptionByUser(req.user.id);

    if (subscriptions.length === 0) {
        return res.status(403).json({ message: "Subscription not found" });
    }

    const subscription = subscriptions[0];

    // 3. Premium users bypass limits
    if (subscription.plan === "premium") {
        return next();
    }

    // 4. Optimized Check: Count records directly in the database
    const [countRows] = await postModel.getPostCountByUser(req.user.id);
    const totalPosts = countRows[0].postCount;

    // 5. Enforce Limit
    if (totalPosts >= subscription.post_limit) {
        return res.status(403).json({ 
            message: "Free post limit reached. Upgrade to premium." 
        });
    }

    next();
});

module.exports = checkPostLimit;