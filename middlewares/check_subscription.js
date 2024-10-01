const pool = require('../config/db');

const check_subscription = async (req, res, next) => {
    const { user_id } = req.user || {};
    
    if (!user_id) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const query = {
            text: `
                SELECT id FROM user_subscriptions
                WHERE user_id = $1 AND status = 'active' AND end_date >= CURRENT_DATE
            `,
            values: [user_id]
        };

        const result = await pool.query(query);

        if (result.rows.length === 0 || result.rows[0].status !== 'active') {
            return res.status(403).json({ error: "No active subscription. Please subscribe to access this content." });
        }

        next();
    } catch (err) {
        console.error(`Error in check_subscription for user ${user_id}:`, err.message);
        res.status(500).send({ error: "Internal server error" });
    }
}

module.exports = {
    check_subscription,
};
