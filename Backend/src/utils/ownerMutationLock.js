const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const { setTimeout: delay } = require("node:timers/promises");

const lockSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    token: { type: String },
    lockedUntil: { type: Date, required: true, default: () => new Date(0) },
  },
  { versionKey: false, collection: "system_locks" },
);

const OwnerMutationLock =
  mongoose.models.OwnerMutationLock ||
  mongoose.model("OwnerMutationLock", lockSchema);

const LOCK_ID = "active-owner-mutation";
const LOCK_LEASE_MS = 60_000;
const LOCK_WAIT_MS = 10_000;

const withOwnerMutationLock = async (callback) => {
  try {
    await OwnerMutationLock.updateOne(
      { _id: LOCK_ID },
      { $setOnInsert: { lockedUntil: new Date(0) } },
      { upsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
  }

  const deadline = Date.now() + LOCK_WAIT_MS;
  const token = randomUUID();

  while (Date.now() < deadline) {
    const now = new Date();
    const lock = await OwnerMutationLock.findOneAndUpdate(
      { _id: LOCK_ID, lockedUntil: { $lte: now } },
      {
        $set: {
          token,
          lockedUntil: new Date(now.getTime() + LOCK_LEASE_MS),
        },
      },
      { new: true },
    );

    if (lock?.token === token) {
      const renewTimer = setInterval(() => {
        OwnerMutationLock.updateOne(
          { _id: LOCK_ID, token },
          { $set: { lockedUntil: new Date(Date.now() + LOCK_LEASE_MS) } },
        ).catch(() => {});
      }, Math.floor(LOCK_LEASE_MS / 3));
      renewTimer.unref?.();

      try {
        return await callback();
      } finally {
        clearInterval(renewTimer);
        await OwnerMutationLock.updateOne(
          { _id: LOCK_ID, token },
          { $set: { lockedUntil: new Date(0) }, $unset: { token: "" } },
        ).catch((error) => {
          console.error("Could not release owner mutation lock:", error.message);
        });
      }
    }

    await delay(100);
  }

  const error = new Error("Timed out waiting for owner update lock");
  error.code = "OWNER_LOCK_TIMEOUT";
  throw error;
};

module.exports = { withOwnerMutationLock };
