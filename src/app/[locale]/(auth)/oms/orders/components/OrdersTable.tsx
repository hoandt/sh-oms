import React from "react";

const OrdersTable = ({ saleChannel }: { saleChannel: string }) => {
  return <div className="px-4 sm:px-6 lg:px-8 mt-2">{saleChannel}</div>;
};

export default OrdersTable;
