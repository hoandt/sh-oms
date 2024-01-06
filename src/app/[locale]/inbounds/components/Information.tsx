import { defaultImage } from "@/lib/constants";
import { useGetInbound } from "@/query-keys"
import { OmsInbound } from "@/types/todo";
import Image from "next/image";

export function Information({id}: {id: number}){
    const {data} = useGetInbound({id});
    const inboundData = data?.data?.[0] as OmsInbound;

    if(!data?.data.length){
        return "No data"
    }
    
    return(
        <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-1">
                <span>{"Code:"}</span>
                <span className="font-bold">{inboundData?.code}</span>
            </div>
            <div className="flex flex-col gap-2">
                {inboundData?.Item.map((value, index)=>{
                    return(
                        <div className="flex flex-row gap-5 items-center">
                            <Image className=" rounded-sm" height={52} width={52} src={value.system_item_master?.data?.attributes.images || defaultImage} alt="" />
                            <div>{value.system_item_master?.data?.attributes.name}</div>
                            <div className="font-bold">{`Quantity: ${value.qty}`}</div>
                            <div className="font-bold">{`Lot: ${value.lot || '-'}`}</div>
                        </div>      
                    ) 
                })}
            </div>
        </div>
    )
}