import React, { useState } from "react";
import numeral from 'numeral';
import { Collapse } from '@mui/material';
import { Envelope, Phone } from 'phosphor-react';

const CurrencyFormatter = ({ value }) => {
    const formattedValue = numeral(value).format('0,0') + ' VND';
    return <span>{formattedValue}</span>;
};

export default function QuoteCard({ quote, onDeclined }) {
    const newProductionPrice = quote.total_price - quote.product_price;
    const [checkOpen, setCheckOpen] = useState(false);
    const handleOpenClose = () => {
        setCheckOpen(!checkOpen);
    }
    const templateImage = "https://i.pinimg.com/564x/d0/65/b0/d065b0f511204401fe8af162372091a6.jpg";

    const saleStaffInformations = {
        id: 1,
        name: "Ngô Thị Hồng Hào",
        imageUrl: "https://i.pinimg.com/564x/f1/35/c4/f135c40157fb7cae9e960d169ab9ac1c.jpg",
        phone: "0987654321",
        email: "thuydungngo@gmail.com"
    }

    const designStaffInformations = {
        id: 1,
        name: "Võ Thị Kim Chỉ",
        imageUrl: "https://i.pinimg.com/564x/f1/74/83/f17483058438a9fbe95aa80a7e273414.jpg",
        phone: "0987654321",
        email: "themankimchi@gmail.com"
    }

    const productionStaffInformations = {
        id: 1,
        name: "Hoàng Việt Vị",
        imageUrl: "https://i.pinimg.com/564x/b4/3a/89/b43a892e3f68c50a5b7ce996aa41a1af.jpg",
        phone: "0987654321",
        email: "dabongtoanvietvi@gmail.com"
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-10/12 h-[200px] items-center bg-white  p-4 border-b border-black">
                <div className="h-full">
                    {quote.product.imageUrl ? (
                        <img src={quote.product.imageUrl} alt="product" className="h-full" />
                    ) : (
                        <img src={templateImage} alt="product" className="h-full" />
                    )}
                </div>

                <div className="flex flex-col h-full ml-5 w-[630px]">
                    <div className="flex">
                        <p className="font-semibold font-cartFont text-2xl">Quote ID: </p>
                        <p className="ml-1 font-semibold font-cartFont text-2xl">#{quote.id}</p>
                    </div>
                    <div className="flex mt-1">
                        <p className="font-cartFont">Created Date: {quote.created_date}</p>
                    </div>
                    <div className="flex flex-col mt-1">
                        <p className="font-cartFont">Note:</p>
                        <div className="w-10/12 h-[75px] bg-slate-200 overflow-y-auto">
                            <p className="font-gantariFont ml-2 mt-2 mr-2 mb-1">{quote.note}</p>
                        </div>
                    </div>
                </div>

                <div className="mx-1 h-full w-0.5 bg-black"> </div>

                <div className="flex-1 flex flex-col h-full ml-5">
                    {quote.total_price ? (
                        <p className="font-cartFont text-xl font-semibold"><CurrencyFormatter value={quote.total_price} /></p>
                    ) : (
                        <p className="font-cartFont text-xl font-semibold">Unpriced yet</p>
                    )}

                    <div className="flex">
                        <p className="font-cartFont text-md mr-2">Quote Status: </p>
                        <p className={
                            quote.quote_status.id === 1 ? "text-sky-700 font-cartFont font-semibold" :
                                quote.quote_status.id === 2 ? "text-sky-700 font-cartFont font-semibold" :
                                    quote.quote_status.id === 3 ? "text-sky-700 font-cartFont font-semibold" :
                                        quote.quote_status.id === 4 ? "text-green-700 font-cartFont font-semibold" :
                                            quote.quote_status.id === 5 ? "text-red-700 font-cartFont font-semibold" :
                                                ""
                        }>{quote.quote_status.id === 1 || quote.quote_status.id === 2 || quote.quote_status.id === 3 ? "Pending" : quote.quote_status.id === 4 ? "Accepted" : "Declined"}
                        </p>
                    </div>

                    <div className="flex">
                        <p className="font-cartFont text-md mr-2">Materials Price: </p>
                        {quote.product_price ? (
                            <p className="font-cartFont"><CurrencyFormatter value={quote.product_price} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="flex">
                        <p className="font-cartFont text-md mr-2">Production Price: </p>
                        {quote.production_price ? (
                            <p className="font-cartFont"><CurrencyFormatter value={newProductionPrice} /></p>
                        ) : (
                            <p>Not yet</p>
                        )}
                    </div>

                    <div className="w-full h-[65px] flex items-center justify-around">
                        <button onClick={handleOpenClose} className="w-[130px] h-[35px] bg-[#0024A4] text-white hover:bg-[#071E6F]">DETAILS</button>
                        {quote.quote_status.id === 4 || quote.quote_status.id === 5 ? (
                            <button className="w-[130px] h-[35px] bg-slate-500 text-white ">DECLINE</button>
                        ) : (
                            <button onClick={onDeclined} className="w-[130px] h-[35px] bg-[#CD0B2A] text-white hover:bg-[#8B1023]">DECLINE</button>
                        )}

                    </div>
                </div>

            </div>

            <Collapse className="w-full flex flex-col justify-center items-center" in={checkOpen} timeout="auto" unmountOnExit>

                <div className="w-full flex flex-col items-center">
                    <div className="w-10/12 grid bg-gray-200 grid-cols-3 mt-2">

                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex justify-center">
                                <p className="font-cartFont text-xl font-semibold ">Sale Staff</p>
                            </div>
                            {quote.saleStaff_id ? (
                                <div className="w-3/4 flex flex-col">
                                    <div className="flex justify-center mb-2">
                                        <img src={saleStaffInformations.imageUrl} alt="saleStaff" className="w-[25px] h-[25px] rounded-full mr-2" />
                                        <p className="font-cartFont font-semibold">{saleStaffInformations.name}</p>
                                    </div>
                                    <div className="flex mb-2">
                                        <Phone size={20} className="mr-2" />
                                        <p className="font-cartFont">{saleStaffInformations.phone}</p>
                                    </div>
                                    <div className="flex mb-2">
                                        <Envelope size={20} className="mr-2" />
                                        <p className="font-cartFont">{saleStaffInformations.email}</p>
                                    </div>
                                </div>
                            )
                                : (
                                    <div className="w-full flex justify-center">
                                        <p className="font-bold text-sky-800">NOT YET...</p>
                                    </div>
                                )}
                        </div>


                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex justify-center">
                                <p className="font-cartFont text-xl font-semibold ">Design Staff</p>
                            </div>
                            {quote.saleStaff_id ? (
                                <div className="w-3/4 flex flex-col">
                                    <div className="flex justify-center mb-2">
                                        <img src={designStaffInformations.imageUrl} alt="saleStaff" className="w-[25px] h-[25px] rounded-full mr-2" />
                                        <p className="font-cartFont font-semibold">{designStaffInformations.name}</p>
                                    </div>
                                    <div className="flex mb-2">
                                        <Phone size={20} className="mr-2" />
                                        <p className="font-cartFont">{designStaffInformations.phone}</p>
                                    </div>
                                    <div className="flex mb-2">
                                        <Envelope size={20} className="mr-2" />
                                        <p className="font-cartFont">{designStaffInformations.email}</p>
                                    </div>
                                </div>
                            )
                                : (
                                    <div className="w-full flex justify-center">
                                        <p className="font-bold text-sky-800">NOT YET...</p>
                                    </div>
                                )}
                        </div>

                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex justify-center">
                                <p className="font-cartFont text-xl font-semibold ">Production Staff</p>
                            </div>
                            {quote.saleStaff_id ? (
                                <div className="w-3/4 flex flex-col">
                                    <div className="flex justify-center mb-2">
                                        <img src={productionStaffInformations.imageUrl} alt="saleStaff" className="w-[25px] h-[25px] rounded-full mr-2" />
                                        <p className="font-cartFont font-semibold">{productionStaffInformations.name}</p>
                                    </div>
                                    <div className="flex mb-2">
                                        <Phone size={20} className="mr-2" />
                                        <p className="font-cartFont">{productionStaffInformations.phone}</p>
                                    </div>
                                    <div className="flex mb-2">
                                        <Envelope size={20} className="mr-2" />
                                        <p className="font-cartFont">{productionStaffInformations.email}</p>
                                    </div>
                                </div>
                            )
                                : (
                                    <div className="w-full flex justify-center">
                                        <p className="font-bold text-sky-800">NOT YET...</p>
                                    </div>
                                )}
                        </div>
                    </div>

                </div>
                {/* <div className="w-10/12 bg-slate-100 grid grid-cols-4 gap-2 p-4">
                        <div>
                            <p className="text-[#151542] font-semibold">Product Informations:</p>
                            <ul>
                                {quote.product.id ? (
                                    <li>- Product ID: {quote.product.id}</li>
                                ) : (
                                    <li>- Product ID: Not yet</li>
                                )}
                                {quote.product.mounting_type ? (
                                    <li>- Product Type: {quote.product.mounting_type.name}</li>
                                ) : (
                                    <li>- Product Type: Not yet</li>
                                )}
                                {quote.product.mounting_size ? (
                                    <li>- Product Size : {quote.product.mounting_size}</li>
                                ) : (
                                    <li>- Product Size: Not Available</li>
                                )}
                            </ul>
                        </div>

                        <div className="flex flex-col">
                            <p className="text-[#151542] font-semibold">Sale Staff Informations:</p>
                            {quote.saleStaff_id ? (
                                <div>
                                    <p>{saleStaffInformations.name}</p>
                                    <div className="flex items-center">
                                        <Phone size={20} className="mr-2" />
                                        <p>{saleStaffInformations.phone}</p>
                                    </div>

                                    <div className="flex items-center">
                                        <Envelope size={20} className="mr-2" />
                                        <p>{saleStaffInformations.email}</p>
                                    </div>
                                </div>
                            )
                                : (
                                    <div className="w-full">
                                        <p className="font-bold text-sky-800">NOT YET...</p>
                                    </div>
                                )}
                        </div>

                        <div className="flex flex-col">
                            <p className="text-[#151542] font-semibold">Designer Staff Informations:</p>
                            {quote.designStaff_id ? (
                                <div>
                                    <p>{designStaffInformations.name}</p>
                                    <div className="flex items-center">
                                        <Phone size={20} className="mr-2" />
                                        <p>{designStaffInformations.phone}</p>
                                    </div>

                                    <div className="flex items-center">
                                        <Envelope size={20} className="mr-2" />
                                        <p>{designStaffInformations.email}</p>
                                    </div>
                                </div>
                            )
                                : (
                                    <div className="w-full">
                                        <p className="font-bold text-sky-800">NOT YET...</p>
                                    </div>
                                )}
                        </div>

                        <div className="flex flex-col">
                            <p className="text-[#151542] font-semibold">Production Staff Informations:</p>
                            {quote.productionStaff_id ? (
                                <div>
                                    <p>{productionStaffInformations.name}</p>
                                    <div className="flex items-center">
                                        <Phone size={20} className="mr-2" />
                                        <p>{productionStaffInformations.phone}</p>
                                    </div>

                                    <div className="flex items-center">
                                        <Envelope size={20} className="mr-2" />
                                        <p>{productionStaffInformations.email}</p>
                                    </div>
                                </div>
                            )
                                : (
                                    <div className="w-full">
                                        <p className="font-bold text-sky-800">NOT YET...</p>
                                    </div>
                                )}
                        </div>

                        <div className="flex flex-col">
                            <p className="text-[#151542] font-semibold">Created Date:</p>
                            <p>{quote.created_date}</p>
                        </div>

                        <div className="flex flex-col">
                            <p className="text-[#151542] font-semibold">Note:</p>
                            <div className="bg-indigo-200 p-4 rounded-lg">
                                <p>{quote.note}</p>
                            </div>
                        </div>

                    </div> */}

            </Collapse >

        </div>

    );
}