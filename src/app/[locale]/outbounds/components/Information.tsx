import { useGetOutbound } from "@/query-keys";
import { OmsInbound, OmsOutbound } from "@/types/todo";
import Image from "next/image";

export function Information({ id }: { id: number }) {
  const { data } = useGetOutbound({ id });
  const outboundData = data?.data?.[0] as OmsOutbound;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1">
        <span>{"Code:"}</span>
        <span className="font-bold">{outboundData?.code}</span>
      </div>
      <div className="flex flex-col gap-2">
        {outboundData?.orderItems.map((value, index) => {
          return (
            <div key={index} className="flex flex-row gap-5 items-center">
              <Image
                className=" rounded-sm"
                height={52}
                width={52}
                src={value.system_item_master?.data?.attributes.images}
                alt=""
              />
              <div>{value.system_item_master?.data?.attributes.name}</div>
              <div className="font-bold">{`Quantity: ${value.qty}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
