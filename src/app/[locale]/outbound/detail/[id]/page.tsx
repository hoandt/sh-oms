"use client";
import { BackButton } from "@/components/common/custom/BackButton";
import { CommonTable } from "@/components/common/table/CommonTable";
import { Card, CardContent } from "@/components/ui/card";

import { useGetOutboundDetailBySapo } from "@/query-keys/outbound";
import { OrderLineItem } from "@/types/outbound";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import Composite from "../../components/Composite";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const schema = z.object({
    variantId: z.string().nullish(),
  });

  const { data } = useGetOutboundDetailBySapo({
    id,
  });

  const orderList = data?.data?.order_line_items || [];

  const columns = useMemo(() => {
    return [
      // qty
      {
        accessorKey: "sku",
        header: () => <div>{"SKU"}</div>,
        cell: ({ row }) => {
          const compositeItems = row.original.composite_item_domains;
          //if

          return (
            <div
              className={
                compositeItems.length > 0 ? "text-blue-900 font-black" : ""
              }
            >
              {row.original.sku}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: () => <div>{"Quantity"}</div>,
        cell: ({ row }) => <div>{row.original.quantity}</div>,
        enableSorting: false,
      },
      {
        accessorKey: "onhand_adj",
        header: () => <div> </div>,
        cell: ({ row }) => (
          //  is composite item, display, else none
          <div>
            {row.original.composite_item_domains.length > 0 && (
              <Composite
                compositeDomains={row.original.composite_item_domains}
              />
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "account_name",
        header: () => <div>{"Item Name"}</div>,
        cell: ({ row }) => {
          return (
            <div>
              <div>{row.original.product_name}</div>
            </div>
          );
        },
        enableSorting: false,
      },
    ] as ColumnDef<OrderLineItem>[];
  }, []);

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <BackButton
          onClick={() => {
            router.back();
          }}
        />
        <h1 className="text-xl font-bold">
          {data?.data?.code || <span>...</span>}
        </h1>
        <p>
          {/* status */}
          <span className="text-blue-500 bg-slate-100 border rounded px-2">
            {(data?.data?.fulfillments &&
              data?.data?.fulfillments.length &&
              en_vi.index.tab[
                data?.data?.fulfillments[0]
                  .composite_fulfillment_status as keyof typeof en_vi.index.tab
              ]) ||
              data?.data.status}
          </span>
        </p>
      </div>
      <Card className="w-full">
        {/* display customer info */}
        <CardContent className="  p-4 py-2">
          <div className="flex flex-row gap-2   text-sm">
            <div>
              <p>
                <span className="font-bold">Channel: </span>
                {data?.data?.channel}
              </p>
              <p>
                <span className="font-bold">Customer Name: </span>
                {data?.data?.customer_data.name}
              </p>
              <p>
                <span className="font-bold">Phone: </span>
                {data?.data?.customer_data.phone_number}
              </p>
              <p>
                <span className="font-bold">Address: </span>
                {`${data?.data?.billing_address?.address1 || ""}, ${
                  data?.data?.billing_address?.address2 || ""
                },  
                 ${data?.data?.billing_address?.ward || ""},
                ${data?.data?.billing_address?.district || ""},  ${
                  data?.data?.billing_address?.city || ""
                } `}
              </p>
            </div>

            {/* <div>
              <p>
                <span className="font-bold">City: </span>
                {data?.data?.customer_city}
              </p>
              <p>
                <span className="font-bold">District: </span>
                {data?.data?.customer_district}
              </p>
              <p>
                <span className="font-bold">Ward: </span>
                {data?.data?.customer_ward}
              </p>
            </div> */}
          </div>
          <div className="flex flex-row gap-2 items-center text-sm">
            <h2 className="font-bold">Note</h2>
            <span>{data?.data?.note}</span>
          </div>
        </CardContent>
        <CardContent className="space-y-2 p-4 py-2">
          <CommonTable
            columns={columns}
            data={orderList || []}
            isLoading={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

const en_vi = {
  index: {
    title: "Danh sách vận đơn",
    btnAddOrderAndFulfillment: "Tạo đơn và giao hàng",
    btnLinkShipmentHandover: "Bàn giao và hoàn vận đơn",
    placeHolderFilterSearch:
      "Tìm kiếm theo mã đơn giao hàng, mã đơn hàng, tên, SĐT người nhận",
    column: {
      code: "Mã đóng gói",
      trackingCode: "Mã vận đơn",
      receiverName: "Người nhận",
      printStatus: "Trạng thái in",
      packedOn: "Ngày đóng gói",
      receiverPhone: "SĐT người nhận",
      shippingAddress: "Địa chỉ người nhận",
      compositeFulfillmentStatus: "Trạng thái giao hàng",
      freightAmount: "Phí trả ĐTVC",
      codAmount: "Cần thu hộ COD",
      note: "Ghi chú",
      receivedOn: "Ngày giao hàng",
      orderCode: "Mã đơn hàng",
      collationStatus: "Trạng thái đối soát",
      createdOn: "Ngày tạo",
      cityName: "Tỉnh/Thành",
      districtName: "Quận/Huyện",
      status: "Trạng thái",
      deliveryType: "Hình thức giao hàng",
      partnerCode: "Mã ĐTVC",
      partnerType: "Loại ĐTVC",
      shippedOn: "Ngày xuất kho",
      email: "Email người nhận",
      locationName: "Chi nhánh",
      resonCancelName: "Lý do hủy vận đơn",
      totalQuantity: "Tổng số lượng sản phẩm",
      total: "Khách phải trả",
      accountName: "Nhân viên tạo phiếu",
      stockOutAccountName: "Nhân viên xuất kho",
      cancelAccountName: "Nhân viên hủy phiếu",
      shippingProviderService: "Dịch vụ giao hàng",
      cancelDate: "Ngày hủy giao",
      shippingProvider: "Đối tác vận chuyển",
      referenceStatusExplanation: "Trạng thái đối tác",
      latePickup: "Lấy trễ",
      lateDelivery: "Giao trễ",
    },
    tab: {
      all: "Tất cả vận đơn",
      packed: "Packed",
      fulfilled: "Delivering",
      received: "Delivered",
      fulfilled_cancelling: "Canceled - Returning",
      fulfilled_cancelled: "Canceled - Returned",
    },
    exportShipment: {
      title: "Tùy chọn trường hiển thị xuất file",
      overviewShipment: "theo đơn giao hàng",
      overviewShipmentByProduct: "theo sản phẩm",
      detailShipment: "chi tiết đơn giao hàng",
      all: "Tất cả vận đơn",
      currentPage: "Đơn giao hàng trên trang này",
      selectedShipments: "Các đơn giao hàng được chọn",
      currentSearch: " đơn giao hàng phù hợp với kết quả tìm kiếm hiện tại",
    },
    typeExportShipment: {
      title: "Loại xuất file",
      shipmentOverview: "File tổng quan theo đơn giao hàng",
      shipmentOverviewByProduct: "File tổng quan theo sản phẩm",
      shipmentList: "File chi tiết ",
    },
    fieldsExport: {
      allFields: "Chọn tất cả",
      titleOrderInfor: "Đơn hàng",
      titleShipmentInfor: "Thông tin vận đơn",
      titleFulfillmentLineItemInfor: "Sản phẩm",
      titlePaymentInfor: "Thu hộ COD",
      order: {
        code: "Mã đơn hàng",
        note: "Ghi chú đơn",
        joinedTag: "Tags đơn hàng",
        accountName: "Nhân viên tạo đơn",
        locationName: "Chi nhánh",
        sourceName: "Nguồn bán hàng",
        shipOnLocal: "Hẹn giao hàng",
        freightAmount: "Phí vận chuyển của đơn hàng",
        paymentAmout: "Tiền khách đã trả",
        paymentMethodName: "Hình thức thanh toán",
        paymentPaidOnLocal: "Ngày thanh toán",
        deliveryType: "Hình thức giao hàng",
        orderTotal: "Tiền khách phải trả",
      },
      shipment: {
        trackingCode: "Mã vận đơn",
        deliveryServiceProviderName: "Đối tác giao hàng",
        serviceName: "Dịch vụ giao hàng",
        weight: "Khối lượng(g)",
        size: "Kích thước(DxRxC)",
        status: "Tình trạng gói hàng",
        reasonCancelFulfillment: "Lý do hủy giao hàng",
        collationStatusTranslated: "Trạng thái đối soát",
        packedOn: "Ngày đóng gói",
        shipmentOn: "Ngày xuất kho",
        receivedOn: "Ngày giao hàng",
        cancelledOn: "Ngày hủy giao",
        receiverName: "Tên người nhận",
        receiverPhone: "SĐT người nhận",
        destinationAddress: "Địa chỉ giao hàng",
        destinationDistrict: "Quận huyện",
        destinationProvince: "Tỉnh thành",
        destinationWard: "Phường xã",
        note: "Ghi chú đơn giao",
        referenceStatusExplanation: "Trạng thái đối tác",
        freightPayer: "Người trả phí",
        codAmount: "Tổng tiền thu hộ",
        freightAmount: "Phí trả đối tác",
        deliveryFee: "Phí vận chuyển",
        joinedTag: "Tags đơn giao",
        cancelDate: "Ngày hủy giao",
      },
      fulfillmentLineItem: {
        sku: "Mã sản phẩm",
        name: "Tên sản phẩm",
        note: "Ghi chú sản phẩm",
        quantity: "Số lượng",
        serial: "Serial",
        unit: "Đơn vị tính",
        price: "Đơn giá",
        discountAmount: "Chiết khấu sản phẩm(VND)",
        amountAfterDiscount: "Tổng tiền",
        taxPerUnit: "Thuế cho từng sản phẩm",
        distributedDiscountAmount: "CK tổng đơn hàng (phân bổ)(VND)",
      },
      fulfillment: {
        code: "Mã đóng gói",
        statusTranslated: "Tình trạng gói hàng",
        reasonCancelFulfillment: "Lý do hủy giao hàng",
        receivedOn: "Ngày giao hàng",
        accountName: "Nhân viên đóng gói",
        stockOutAccountName: "Nhân viên xuất kho",
        receiveAccountName: "Nhân viên giao hàng",
        shippedOn: "Ngày xuất kho",
        cancelledOn: "Ngày huỷ giao",
        packedOn: "Ngày đóng gói",
        totalQuantity: "Số lượng",
        totalLineDiscountAmount: "Chiết khấu sản phẩm",
        totalDiscount: "Chiết khấu tổng đơn",
        totalTax: "Thuế",
        totalBeginAmount: "Tổng tiền hàng",
      },
    },
    updateStatusFulfillment: {
      typeStatus: "Trạng thái:",
      reason: "Nhập lý do hủy:",
      chooseLastContent: "vận đơn.",
      chooseFirstContent: "Thao tác này sẽ cập nhật trạng thái cho",
      fulfilled: "Đang giao hàng",
      received: "Đã giao hàng",
      cancelling: "Hủy giao - Chưa nhận",
      cancelled: "Hủy giao - Đã nhận",
      unpackage: "Hủy đóng gói",
      statusFulfillmentSuccess: "Cập nhật thành công!",
      statusFulfillmentInvalid: "Trạng thái không hợp lệ!",
      noLimitFulfillment:
        "Số lượng phiếu giao hàng cập nhật phải lớn hơn 0 và không vượt quá 50!",
      updateStatusFulfillTitle: "Cập nhật trạng thái vận đơn",
      processSuccess: "XỬ LÝ DỮ LIỆU HOÀN TẤT!",
      loadingData: "Đang xử lý dữ liệu...",
      fulfillmentSuccess: "Phiếu giao hàng cập nhật thành công: ",
      fulfillmentFaild: "Phiếu giao hàng cập nhật không thành công: ",
      viewOrderSuccess: "Xem danh sách đơn hàng cập nhật thành công",
      detail: "Chi tiết",
      updateSuccess: "Cập nhật thành công!",
      default: "Chọn trạng thái cập nhật",
      noTypeStatus: "Trạng thái cập nhật chưa chọn!",
      noReason: "Tên lý do hủy không được để trống!",
      noChangeStatusFulfilled:
        "Trạng thái đơn hàng lấy tại cửa hàng không thể chuyển sang 'Đang giao hàng'",
    },
    bulkAction: {
      printShipments: "In nhiều phiếu giao hàng",
      printShipmentsPacked: "In phiếu bàn giao",
      printPackingInstructions: "In hướng dẫn đóng gói",
      createShipmentHandOvers: "Tạo phiếu bàn giao",
      updateStatus: "Cập nhật trạng thái vận đơn",
      deliveryCollations: "Đối soát",
      viewOrders: "Xem danh sách đơn hàng",
      noPrintFormShipmentInStore:
        "Không được chọn phiếu giao hàng nhận tại cửa hàng xin vui lòng chọn lại!",
      noLimitPrintFormShipment: "Bạn đã chọn quá 50 đơn xin vui lòng chọn lại!",
      noSelect: "Vui lòng chọn đơn",
      noCondition: "Phiếu giao hàng chưa đủ điều kiện để đối soát",
      noDeliveryServiceProvider:
        "Chỉ được chọn những đơn có cùng đối tác giao hàng xin vui lòng chọn lại!",
      noStockLocation:
        "Chỉ được chọn những đơn có cùng chi nhánh xin vui lòng chọn lại!",
      statusPacked: "Chỉ được chọn những đơn có cùng trạng thái chờ lấy hàng!",
      statusPickup: "Chỉ được chọn những đơn có dịch vụ giao hàng!",
      deliveryType: "Hình thức giao hàng phải là dịch vụ giao hàng",
      deliveryTypePickup: "Chỉ được chọn những đơn có dịch vụ giao hàng!",
      selectCreateHandOver:
        "Chỉ được chọn những vận đơn có cùng trạng thái Chờ lấy hàng, cùng đối tác vận chuyển và ở cùng chi nhánh",
      pushingStatusNotAllow:
        "Có vận đơn chưa được đẩy thành công sang đối tác vận chuyển",
      noLimitCreateShipmentHandOver: "Chỉ được chọn tối đa 100 vận đơn!",
      notAllowPickup: "Không tạo được phiếu bàn giao cho đơn Nhận tại cửa hàng",
    },
    filter: {
      compositeFulfillmentStatus: "Trạng thái giao hàng",
      pushingStatus: "Trạng thái đẩy đơn đối tác vận chuyển",
      account: "Nhân viên tạo",
      address: "Địa chỉ",
      deliveryServiceProvider: "Đối tác giao hàng",
      latePickup: "Cảnh báo lấy trễ",
      lateDelivery: "Cảnh báo giao trễ",
    },
    drillDown: {
      dialog: {
        lastContent: " đơn giao hàng này không?",
        firstContent: "Bạn có chắc chắn",
        title: "Cập nhật trạng thái vận chuyển",
        titleDialogShipByShipper: "Cập nhật thông tin cho vận đơn ",
        codAmount: "Tiền cần thu hộ",
        freightAmount: "Phí trả đối tác",
        payer: "Người trả phí ",
        shipperAmount: "Nhập tiền shipper đặt cọc",
        codError: "Nhập tiền đặt cọc lớn hơn 0!",
        sendSupportRequest: "Gửi yêu cầu hỗ trợ",
      },
      receive: "Cập nhật trạng thái vận đơn thành công",
      receiveAfterCancellation: "Nhận lại hàng thành công!",
      noData: "Chưa có dữ liệu",
      btnPrintShipmentOption: "In tùy chọn",
      shipmentInfo: "Thông tin giao hàng",
      deliveryInfo: "Hành trình đơn hàng",
      deliveryServiceName: "Giao qua",
      trackingCode: "Mã vận đơn",
      btnPrintShipment: "In vận đơn",
      btnPrintFulfillment: "In",
      deliveryStatus: "Trạng thái đối tác",
      shopPaid: "Shop trả",
      customerPaid: "Khách trả",
      noteShipment: "Ghi chú giao hàng: ",
      emptyNote: "Phiếu giao hàng chưa có ghi chú",
      emptyTag: "Phiếu giao hàng chưa có tag",
      codAmount: "Thu hộ COD",
      deliveryFee: "Phí trả shipper",
      freightPayer: "Người trả phí",
      collapse: "Thu gọn",
      totalAmountProduct: "Tổng tiền ({{count}} sản phẩm)",
      deliveryFee2: "Phí giao hàng",
      totalAmount: "Khách phải trả",
      discount: "Chiết khấu",
      button: {
        packed: "Xuất kho",
        received: "Đã giao hàng",
        fulfilled_cancelling: "Nhận hàng hủy",
        packedCancelled: "Hủy đóng gói",
        fulfilledCancelled: "Hủy giao hàng",
        sendRequest: "Gửi yêu cầu",
        packedLowcase: "xuất kho",
        receivedLowcase: "đã giao hàng",
        fulfilledCancellingLowcase: "nhận hàng hủy",
      },
      tax: "Thuế",
      column: {
        images: "Ảnh",
        sku: "Mã SKU",
        variantName: "Tên sản phẩm",
        quantity: "Số lượng",
        price: "Đơn giá",
        discount: "Chiết khấu",
        tax: "Thuế",
        lineAmount: "Thành tiền",
      },
      supportRequest: {
        default: "Chọn loại hỗ trợ",
        deliveryReturn: "Giục lấy / Giao / Trả",
        orderBack: "Yêu cầu giao lại đơn hàng",
        changeOrderInfo: "Yêu cầu thay đổi thông tin",
        collectionPayment: "Đối soát / Thanh toán",
        complainOrder: "Khiếu nại sai thông tin đơn hàng",
        complainDamaged: "Khiếu nại hư hỏng / thất lạc",
        wrongStatus: "Sai trạng thái",
        cancelOrder: "Hủy đơn hàng",
        errorTechnical: "Lỗi kỹ thuật",
        other: "Khác",
        typeSupport: "Loại hỗ trợ",
        contentSupport: "Nội dung hỗ trợ",
        detailSupport: "Chi tiết hỗ trợ",
        take: "Giục lấy",
        delivery: "Giục giao",
        return: "Giục trả",
        changeCod: "Thay đổi COD",
        changeAddressNumberDelivery: "Đổi địa chỉ và SĐT giao",
        changeAddressNumberReceipt: "Đổi địa chỉ và SĐT lấy",
        orderInfoCod: "Giá trị COD",
        phoneNumberShipping: "Số điện thoại",
        cityShipping: "Thành phố",
        addressShipping: "Địa chỉ",
        districtShipping: "Quận huyện",
        wardShipping: "Phường xã",
        noReceiptCOD: "Chưa nhận được tiền COD",
        noEmailControl: "Không nhận được mail đối soát",
        deviationControl: "Đối soát lệch",
        deviationPayment: "Thanh toán lệch",
        wrongReasonDelay: "Sai lý do delay",
        wrongTransportFree: "Sai phí vận chuyển",
        attitudeStaff: "Thái độ nhân viên",
        collectMoney: "Thu tiền sai",
        damaged: "Hư hỏng / Giao thiếu hàng",
        lost: "Thất lạc",
        wrongItem: "Sai hàng",
        wrongStatusReceipt: "Sai trạng thái lấy",
        wrongStatusDelivery: "Sai trạng thái giao",
        wrongStatusReturn: "Sai trạng thái hoàn",
        note: "Lưu ý:",
        provideInfoImages:
          "Shop cần cung cấp thêm một số thông tin để được hỗ trợ nhanh hơn bao gồm hình ảnh/ video liên quan đến đơn hàng",
        provideInformation:
          "Shop cần cung cấp thêm một số thông tin sau để được hỗ trợ nhanh hơn:",
        timeDelivery: "- Thời gian bàn giao",
        codeDelivery: "- Mã đơn cùng bàn giao",
        phoneStaffDelivery: "- Số điện thoại nhân viên lấy hàng",
        reportDelivery: "- Biên bản hoặc xác nhận bàn giao",
        received: "Đã nhận hàng - Chưa cập nhật Giao thành công",
        noReceived: "Chưa nhận hàng - Đã cập nhật Giao thành công",
        btnAttachFile: "Đính kèm tệp tin",
        limitSizeFile: "File đính kèm không được vượt quá 15MB.",
        limitFile:
          "Số lượng file quá giới hạn cho phép, bạn chỉ được đính kèm tối đa là 3 file.",
        limitNumberFile:
          "Số lượng file quá giới hạn cho phép, bạn chỉ được đính kèm tối đa là 3 file.",
        noTicketDescrpition: "Bạn cần phải điền nội dung hỗ trợ.",
        sendSuccess: "Yêu cầu hỗ trợ được tạo thành công",
        sendFaild: "Yêu cầu hỗ trợ gửi thất bại",
        noDistrict: "Quận/Huyện không được để trống.",
        noWard: "Phường/Xã không được để trống.",
        noPhone: "Số điện thoại không được để trống.",
        noAddress: "Địa chỉ không được để trống.",
        limitCOD: "COD không quá 12 số.",
        noCOD: "COD không được để trống.",
        noSelect: "Vui lòng chọn loại hỗ trợ.",
      },
    },
    printForm: {
      titlePrintSingleOrder: "Chọn mẫu phiếu in",
      titlePrint: "In nhiều phiếu giao hàng",
      chooseLocation: "Chọn mẫu in tại chi nhánh",
      tooltipPrintShipment:
        "Lựa chọn này sẽ in phiếu giao hàng gần nhất được tạo",
      orderBulk: "Đơn hàng",
      shipmentBulk: "Phiếu giao hàng",
      allBulk: "Cả đơn hàng và phiếu giao hàng",
      tooltipAllBulk:
        "Lựa chọn này sẽ in đồng thời cả hoá đơn và phiếu giao hàng gần nhất được tạo",
      chooseTemplate: "Chọn mẫu in phiếu",
      chooseTagTempalte: "Hoặc mẫu in tem nhãn",
      defaultMethod: "Đặt làm mặc định cho chức năng in tùy chọn",
      a4: "Mẫu in A4",
      a5: "Mẫu in A5",
      k80: "Mẫu in K80",
      k57: "Mẫu in K57",
      "15x10": "Kích cỡ 15 x 10cm",
      "10x10": "Kích cỡ 10 x 10cm",
      "7x5": "Kích cỡ 7,5 x 5cm",
      notiPrintShipment: "Phải chọn ít nhất là 1 phiếu giao hàng!",
    },
  },
  firstScreen: {
    noRecordShipment: "Cửa hàng của bạn chưa có phiếu giao hàng nào",
    notiShipment:
      "Các phiếu giao hàng sắp tới của bạn sẽ được hiển thị tại đây nhé!",
  },
  actionLog: {
    fulfillment: {
      title: "Thông tin Phiếu đóng gói",
      code: "Mã phiếu đóng gói",
      packedOn: "Ngày đóng gói",
      shippingAddress: "Địa chỉ giao hàng",
      deliveryName: "Phương thức giao hàng",
      deliveryType: {
        pickup: "Nhận tại cửa hàng",
        courier: "Dịch vụ giao hàng",
      },
      packageStatus: "Trạng thái đóng gói",
      note: "Ghi chú",
      shipment: {
        title: "Thông tin Phiếu giao hàng",
        trackingCode: "Mã vận đơn",
        created: "Ngày tạo phiếu giao hàng",
        deliveryServiceProviderName: "Đối tác giao hàng",
        shipping: {
          fullName: "Tên người nhận",
          phoneNumber: "Số điện thoại",
          address: "Địa chỉ",
        },
        codAmount: "Tiền thu hộ",
        freightAmount: "Phí vận chuyển",
        packageStatus: "Trạng thái phiếu giao",
        deliveryType: {
          employee: "Shipper cửa hàng",
          external_shipper: "Shipper cá nhân",
          external_service: "Công ty",
          ecommerce: "Marketplace",
        },
        boxDelivery: {
          title: "Thông tin Phiếu giao hàng",
          trackingCode: "Mã vận đơn",
          createdOn: "Ngày tạo phiếu giao hàng",
          deliveryType: "Phương thức giao hàng",
          deliveryName: "Đối tác giao hàng",
          serviceName: "Gói dịch vụ",
          pickupContactName: "Địa chỉ kho lấy hàng",
          width: "Rộng (cm)",
          height: "Cao (cm)",
          length: "Dài (cm)",
          weight: "Khối lượng đơn hàng (g)",
        },
      },
    },
  },
};
