import React, { useEffect, useRef } from "react";
import HeadServices from "../../components/Services/head";
import ExploreCustomization from "../../components/Services/exploreCustomization";
import ExploreTemplate from "../../components/Services/exploreTemplate";

export default function Services() {

    const customizationRef = useRef(null);
    const templateRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        localStorage.removeItem("mountingType");
        localStorage.removeItem("finalProduct");
        localStorage.removeItem("currentStep");
        localStorage.removeItem("nextStep");

    }, []);

    return (
        <>
            <div className="grid md:grid-cols-1 xs:grid-cols-1">
                <HeadServices
                    scrollToCustomization={() => scrollToSection(customizationRef)}
                    scrollToTemplate={() => scrollToSection(templateRef)}
                />
                <div className="grid grid-cols-3 m-10 gap-5">
                    <img
                        src="https://images.unsplash.com/photo-1599459183200-59c7687a0275?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Ảnh"
                        className="w-auto h-auto"
                    ></img>
                    <img
                        src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Ảnh"
                        className="w-auto h-auto"
                    ></img>
                    <img
                        src="https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Ảnh"
                        className="w-auto h-auto"
                    ></img>
                </div>
                <div ref={customizationRef}>
                    <ExploreCustomization />
                </div>
                <img
                    src="https://images.unsplash.com/photo-1585960622850-ed33c41d6418?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Ảnh"
                    className="w-full h-auto"
                ></img>
                <div ref={templateRef}>
                    <ExploreTemplate />
                </div>
                <img
                    src="https://images.unsplash.com/photo-1583937443566-6fe1a1c6e400?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Ảnh"
                    className="w-full h-auto"
                ></img>
            </div>

        </>
    );
}
