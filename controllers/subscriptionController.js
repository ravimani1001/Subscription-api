const {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscription,
  cancelSubscription,
  getPlanById,
} = require("../models/subscriptionModel");

const { publisher } = require("../redis/redisClient");

const create = async (req, res) => {
  const userId = req.user.userId;
  const { planId } = req.body;

  try {
    const existing = await getSubscriptionByUserId(userId);
    if (existing) {
      return res
        .status(400)
        .json({ error: "You already have an active subscription" });
    }

    const plan = await getPlanById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const subscription = await createSubscription(
      userId,
      planId,
      startDate,
      endDate
    );

    const event = {
      type: "SUBSCRIBED TO A PLAN",
      userId,
      plan_name: plan.name,
      timestamp: new Date().toISOString(),
    };
    await publisher.publish("subscription_created", JSON.stringify(event));

    res.status(201).json({ message: "Subscribed successfully", subscription });
  } catch (err) {
    console.error("Create subscription error:", err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

const get = async (req, res) => {
  const userId = req.params.userId;
  try {
    const subscription = await getSubscriptionByUserId(userId);
    if (!subscription) {
      return res.status(404).json({ error: "No active subscription found" });
    }
    res.json(subscription);
  } catch (err) {
    console.error("Get subscription error:", err);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

const update = async (req, res) => {
  const userId = req.params.userId;
  const { planId } = req.body;

  try {
    const plan = await getPlanById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + plan.duration);

    const subscription = await updateSubscription(userId, planId, newEndDate);

    const event = {
      type: "UGRADED TO A PLAN",
      userId,
      plan_name: plan.name,
      timestamp: new Date().toISOString(),
    };
    await publisher.publish("upgraded_subscription", JSON.stringify(event));

    res.json({ message: "Subscription updated", subscription });
  } catch (err) {
    console.error("Update subscription error:", err);
    res.status(500).json({ error: "Failed to update subscription" });
  }
};

const cancel = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await cancelSubscription(userId);
    if (!result)
      return res
        .status(404)
        .json({ error: "No active subscription to cancel" });

    const event = {
      type: "CANCELLED SUBSCRIPTION",
      userId,
      plan_name: "",
      timestamp: new Date().toISOString(),
    };
    await publisher.publish("cancelled_subscription", JSON.stringify(event));
    res.json({ message: "Subscription cancelled", result });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
};

module.exports = {
  create,
  get,
  update,
  cancel,
};
