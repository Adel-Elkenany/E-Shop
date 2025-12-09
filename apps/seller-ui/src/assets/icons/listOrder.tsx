import React from "react";

const ListOrder = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="currentColor"
            {...props}
        >
            <path d="M0 0h4v3h-4v-3z"></path>
            <path d="M0 4h4v3h-4v-3z"></path>
            <path d="M0 12h4v3h-4v-3z"></path>
            <path d="M0 8h4v3h-4v-3z"></path>
            <path d="M5 0h11v3h-11v-3z"></path>
            <path d="M5 4h11v3h-11v-3z"></path>
            <path d="M5 12h11v3h-11v-3z"></path>
            <path d="M5 8h11v3h-11v-3z"></path>
        </svg>
    );
};

export default ListOrder;