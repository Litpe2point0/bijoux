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
    const templateImage = "https://i.pinimg.com/564x/03/1a/45/031a45adc4efa1deedc50732c477bceb.jpg";

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
            <div className="flex w-10/12 h-[100px] items-center bg-white hover:bg-gray-300 p-4 rounded-lg shadow-md mb-5">
                <div className="h-full">
                    {quote.product.imageUrl ? (
                        <img onClick={handleOpenClose} src={quote.product.imageUrl} alt="product" className="h-full rounded-lg" />
                    ) : (
                        <img onClick={handleOpenClose} src={templateImage} alt="product" className="h-full rounded-lg" />
                    )}
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Quote ID</p>
                    <p>{quote.id}</p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-col items-center">
                    <p className="font-bold">Quote Status</p>
                    <p className={
                        quote.quote_status.id === 1 ? "text-indigo-700 font-semibold" :
                            quote.quote_status.id === 2 ? "text-sky-700 font-semibold" :
                                quote.quote_status.id === 4 ? "text-green-700 font-semibold" :
                                    quote.quote_status.id === 5 ? "text-red-700 font-semibold" :
                                        ""
                    }>
                        {quote.quote_status.name}
                    </p>
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Product Price</p>
                    {quote.product_price ? (
                        <p className="truncate hover:text-clip"><CurrencyFormatter value={quote.product_price} /></p>
                    ) : (
                        <p>Not yet</p>
                    )}
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Production Price</p>
                    {quote.production_price ? (
                        <p className="truncate hover:text-clip"><CurrencyFormatter value={newProductionPrice} /></p>
                    ) : (
                        <p>Not yet</p>
                    )}
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex w-[200px] flex-col items-center">
                    <p className="font-bold">Total Price</p>
                    {quote.total_price ? (
                        <p className="truncate hover:text-clip"><CurrencyFormatter value={quote.total_price} /></p>
                    ) : (
                        <p>Not yet</p>
                    )}
                </div>

                <div className="h-full w-0.5 bg-zinc-500 mr-3 ml-3"></div>
                <div className="flex flex-col items-center ml-8">
                    {quote.quote_status.id === 4 || quote.quote_status.id === 5 ? (
                        <button className="bg-gray-500 text-white font-bold rounded-lg p-2">Decline</button>
                    )
                        :
                        (
                            <button onClick={onDeclined} className="bg-red-500 text-white font-bold rounded-lg p-2 hover:text-yellow-500">Decline</button>
                        )}
                </div>
            </div>

            <Collapse className="w-full flex justify-center items-center" in={checkOpen} timeout="auto" unmountOnExit>
                <div className="w-full flex justify-center">
                    <div className="w-10/12 bg-slate-100 grid grid-cols-4 gap-2 p-4">
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

                    </div>
                </div>
            </Collapse >

        </div>

    );
}