import React from "react";

function ClassWeekInProgress({ week, paymentType }) {

  const getStatusColor = (status) => {
    if (status === "Active") return "bg-green-500";
    if (status === "Completed") return "bg-brown-500";
    return "bg-gray-600";
  };
  return (
    <div className="bg-gray-100 bg-opacity-50 px-2 py-3 shadow-sm  border border-primary rounded-md  ">
    

      <div className="flex justify-between">
        <p className="font-bold md:text-lg   ">{week?.name || "Week"}</p>
       
      </div>

      <div className="flex flex-col md:flex-row gap-5 justify-between">
        <div className="w-full">
          <table className="">
            <tbody>
              <tr>
                <td className="text-gray-600 pr-4">Status</td>
                <td
                  className={`${getStatusColor(
                    week?.status
                  )} text-center text-light rounded-md bg-opacity-75  px-2  font-bold`}
                >
                  {week?.status}
                </td>
              </tr>
              <tr>
                <td className="text-gray-600 pr-4">Start Date</td>
                <td className="font-bold">{week?.startDate?.split("T")[0]}</td>
              </tr>

              <tr>
                <td className="text-gray-600 pr-4">End Date</td>
                <td className="font-bold">{week?.endDate?.split("T")[0]}</td>
              </tr>
            </tbody>
          </table>
          <div className="w-full md:w-[80%] border bg-gray-100 mt-2 border-dotted border-gray-500 px-2 py-1 rounded-md ">
            <p className="text-gray-900 pr-4">Report</p>
            <div className=" ">
              <p className="text-gray-700  leading-6 line-clamp-none ease-in-out duration-500 ">
                {week?.report || "No report yet"}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <p className="font-bold">Week Payments</p>
          <table className="mb-3  ">
            <tbody>
              <tr>
                <td className="text-gray-600 pr-4">Total Amount</td>
                <td className="font-bold">
                  {week?.amount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}{" "}
                  <span className="text-gray-600 font-bold pl-2 ">
                   
                    : {paymentType}
                  </span>
                </td>
              </tr>
            
              <tr className={`${week?.classId?.paymentType === "Paid as a whole" && "hidden"}`}>
                <td className="text-gray-600 pr-4">Total Amount Paid </td>
                <td className="font-bold">
                  {(week?.amountPaidByClient || 0)?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
              </tr>

              <tr className={`${week?.classId?.paymentType === "Paid as a whole" && "hidden"}`}>
                <td className="text-gray-600 pr-4">Balance</td>
                <td className={` ${(
                    parseFloat(week?.amount || 0) -
                    parseFloat(week?.amountPaidByClient || 0)
                  ) > 0 &&  'text-red-400'} font-bold`}>
                  {(
                    parseFloat(week?.amount || 0) -
                    parseFloat(week?.amountPaidByClient || 0)
                  )?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
       
        </div>
      </div>
    </div>
  );
}

export default ClassWeekInProgress;
