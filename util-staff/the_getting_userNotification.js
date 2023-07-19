const Notification = require("../model/Notification");

async function getUser_Noti(currentuser) {
  try {
    let count = await Notification.aggregate([
      {
        $match: { currentUser: currentuser }
      },
      {                                                                                                                                                                                                                                                       
        $group: {
          _id: "$Associated",
          count: { $sum: 1 },
          statusCount: {
            $sum: { $cond: [{ $eq: ["$Status", "N_C"] }, 1, 0] }
          }
        }
      }
    ]);
    return count;
  } catch (error) {
    console.error("Error counting instances:", error);
    throw error;
  }
}

module.exports = getUser_Noti;
``
