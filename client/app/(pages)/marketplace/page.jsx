import Image from "next/image";

import prop from "@/assets/hot.jpeg"
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";



export default function Market() {

    return (
        <div className=" flex flex-col md:mx-80 mx-3 ">

            <div className="flex space-x-5 mt-2">


                <div className="bg-gray-200 hover:bg-white border-2 md:px-3 px-3 py-2"> All Markets ↓  </div>
                <div className="bg-orange-300 hover:bg-orange-400 border-2 border-black md:px-3 px-3 py-2" > Goodwill </div>
                <div className="bg-gray-200 hover:bg-white border-2 md:px-3 px-3 py-2"> Normal selling  </div>

            </div>


            <div className="flex md:flex-row flex-col md:flex-wrap gap-4 mt-10 items-center">

                <div className="flex flex-col bg-gray-100 border-2 rounded-md md:w-auto w-80 pb-1">
                    <DirectionAwareHover imageUrl={prop} className="w-full "children={"goodwill"} />
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div> ST louis street</div>
                            <div> min. buying $30 </div>
                        </div>
                        <div className="text-center"> only indians can buy</div>
                    </div>
                </div>

                   <div className="flex flex-col bg-gray-100 border-2 rounded-md md:w-auto w-80 pb-1">
                    <DirectionAwareHover imageUrl={prop} className="w-full "children={"goodwill"} />
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div> ST louis street</div>
                            <div> min. buying $30 </div>
                        </div>
                        <div className="text-center"> only indians can buy</div>
                    </div>
                </div>

             
                <div className="flex flex-col bg-gray-100 border-2 rounded-md md:w-auto w-80 pb-1">
                    <DirectionAwareHover imageUrl={prop} className="w-full "children={"goodwill"} />
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div> ST louis street</div>
                            <div> min. buying $30 </div>
                        </div>
                        <div className="text-center"> only indians can buy</div>
                    </div>
                </div>

             
                <div className="flex flex-col bg-gray-100 border-2 rounded-md md:w-auto w-80 pb-1">
                    <DirectionAwareHover imageUrl={prop} className="w-full "children={"goodwill"} />
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div> ST louis street</div>
                            <div> min. buying $30 </div>
                        </div>
                        <div className="text-center"> only indians can buy</div>
                    </div>
                </div>

             
                <div className="flex flex-col bg-gray-100 border-2 rounded-md md:w-auto w-80 pb-1">
                    <DirectionAwareHover imageUrl={prop} className="w-full "children={"goodwill"} />
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div> ST louis street</div>
                            <div> min. buying $30 </div>
                        </div>
                        <div className="text-center"> only indians can buy</div>
                    </div>
                </div>

             
             

              

                


            </div>




        </div>
    )
}
