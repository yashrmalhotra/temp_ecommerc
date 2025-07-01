import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { connectToDataBase } from "@/utill/connectDB";

export const getSalesData = async (uid: string) => {
  await connectToDataBase();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0); // Midnight

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999); // End of day

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(startOfToday.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  try {
    const data = await Order.aggregate([
      { $match: { soldBy: uid, createdAt: { $gte: sevenDaysAgo } } },
      {
        $addFields: {
          day: {
            $dateFromParts: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
          },
        },
      },
      {
        $facet: {
          chartData: [
            {
              $group: {
                _id: "$day",
                totalSales: { $sum: "$amount" },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                day: "$_id",
                totalSales: 1,
                label: { $dateToString: { format: "%d/%m", date: "$_id" } },
              },
            },
          ],
          todaySales: [
            { $match: { createdAt: { $gte: startOfToday, $lt: endOfToday } } },
            {
              $group: {
                _id: null,
                todaySalesAmount: { $sum: "$amount" },
                todayUnitSolds: { $sum: "$qty" },
              },
            },
          ],
          totalPayment: [
            { $match: { status: { $nin: ["Pending", "Refunded"] } } },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
              },
            },
          ],
          unshipedOrders: [
            { $match: { status: "Ordered" } },
            {
              $count: "unshipedOrders",
            },
          ],
          openReturnRequest: [{ $match: { status: "Returned" } }, { $count: "openReturns" }],
        },
      },

      {
        $project: {
          todaySalesAmount: "$todaySales.todaySalesAmount",
          todayUnitSolds: "$todaySales.todayUnitSolds",
          unshipedOrders: "$unshipedOrders.unshipedOrders",
          totalAmount: "$totalPayment.totalAmount",
          openReturns: "$openReturnRequest.openReturns",
          chartData: 1,
        },
      },
    ]);
    return data[0];
  } catch (error: any) {
    console.log(error);
  }
};
export const getProductForEdit = async (id: string) => {
  await connectToDataBase();
  const product = await Product.findOne({ pid: id }).select("-_id -createdAt -updatedAt");
  return product;
};

export const updateShopDisplayName = async (uid: string, sellerShopDisplayName: string) => {
  await connectToDataBase();
  try {
    const existingShopDisplayName = await User.findOne({ sellerShopDisplayName }).select("sellerShopDisplayName");

    if (existingShopDisplayName) {
      throw new Error("Shop name already exists");
    }

    await User.updateOne({ uid }, { $set: { sellerShopDisplayName } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateAddress = async (uid: string, updateAddress: any) => {
  await connectToDataBase();
  try {
    await User.updateOne({ uid }, { $set: { sellerAddress: updateAddress } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateBankAccountDetails = async (uid: string, bankAccountDetails: any) => {
  await connectToDataBase();
  try {
    await User.updateOne({ uid }, { $set: { sellerBankAccountDetails: bankAccountDetails } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updatePinedLink = async (uid: string, pinedLink: { url: string; name: string }[]) => {
  await connectToDataBase();
  try {
    await User.updateOne({ uid }, { $set: { pinedLink } });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
